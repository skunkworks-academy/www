#!/usr/bin/env node
/**
 * Lighthouse Contrast Audit Validator
 * 
 * Validates color-contrast audit results from Lighthouse with:
 * - Detailed element-by-element failure analysis
 * - Computed color extraction and contrast ratio calculation
 * - Automatic suggestions for fixing failing elements
 * - Recovery procedures for transient failures
 */

import { readFile } from 'node:fs/promises';

const reportPath = process.argv[2] || './lighthouse-contrast.json';

/**
 * Calculate relative luminance (WCAG)
 */
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const sRGB = v / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio (WCAG)
 */
function contrastRatio(rgb1, rgb2) {
  const lum1 = relativeLuminance(...rgb1);
  const lum2 = relativeLuminance(...rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

/**
 * Parse rgb/rgba string to [r, g, b]
 */
function parseRgb(rgbStr) {
  const match = rgbStr.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
}

/**
 * Parse hex color to [r, g, b]
 */
function parseHex(hex) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return null;
  const match = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return match ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)] : null;
}

/**
 * Format RGB for display
 */
function rgbToString(rgb) {
  return `rgb(${rgb.join(', ')})`;
}

/**
 * Suggest corrected colors with better contrast
 */
function suggestFix(fgRgb, bgRgb, isLight = true) {
  const currentRatio = contrastRatio(fgRgb, bgRgb);
  
  // Strategy: adjust foreground toward black (light theme) or white (dark theme)
  const targetRgb = isLight ? [0, 0, 0] : [255, 255, 255];
  const suggestedRatio = contrastRatio(targetRgb, bgRgb);
  
  return {
    current: parseFloat(currentRatio),
    suggested: parseFloat(suggestedRatio),
    direction: isLight ? 'darker' : 'lighter',
    targetColor: isLight ? '#000000' : '#ffffff',
  };
}

/**
 * Main validation function
 */
async function validateContrast() {
  try {
    const data = await readFile(reportPath, 'utf8');
    const report = JSON.parse(data);
    
    const audit = report.audits?.['color-contrast'];
    
    if (!audit) {
      console.error('✗ No color-contrast audit found in report');
      process.exit(1);
    }
    
    console.log('='.repeat(70));
    console.log('Lighthouse Color Contrast Audit Results');
    console.log('='.repeat(70));
    console.log(`\nAudit Score: ${(audit.score * 100).toFixed(0)}%`);
    console.log(`Audit Status: ${audit.scoreDisplayMode}`);
    
    // If perfect score, report success
    if (audit.score === 1 || audit.scoreDisplayMode === 'notApplicable') {
      console.log('\n✓ Rendered light/dark colour-contrast audit passed.');
      process.exit(0);
    }
    
    // Parse failure details
    const items = audit.details?.items || [];
    
    if (items.length === 0) {
      console.log('\n✓ No contrast failures detected');
      process.exit(0);
    }
    
    console.error(`\n✗ Found ${items.length} colour-contrast failure(s):\n`);
    
    const failures = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const selector = item.node?.selector || item.node?.snippet || JSON.stringify(item);
      const fgColor = item.foregroundColor || item.computedStyle?.color;
      const bgColor = item.backgroundColor || item.computedStyle?.backgroundColor;
      const fontSize = item.fontSize;
      const fontWeight = item.fontWeight;
      
      const fgRgb = fgColor ? (parseRgb(fgColor) || parseHex(fgColor)) : null;
      const bgRgb = bgColor ? (parseRgb(bgColor) || parseHex(bgColor)) : null;
      
      console.error(`Failure ${i + 1}:`);
      console.error(`  Selector: ${selector}`);
      
      if (fgColor) console.error(`  Foreground: ${fgColor}`);
      if (bgColor) console.error(`  Background: ${bgColor}`);
      if (fontSize) console.error(`  Font size: ${fontSize}`);
      if (fontWeight) console.error(`  Font weight: ${fontWeight}`);
      
      // Calculate actual ratio if colors available
      if (fgRgb && bgRgb) {
        const ratio = contrastRatio(fgRgb, bgRgb);
        const isNormalText = fontSize && parseInt(fontSize) < 18;
        const required = isNormalText ? 4.5 : 3;
        
        console.error(`  Contrast ratio: ${ratio}:1 (requires ${required}:1)`);
        console.error(`  Deficit: ${(required - parseFloat(ratio)).toFixed(2)}:1`);
        
        // Suggest fix
        const isLight = bgRgb[0] > 128 || bgRgb[1] > 128 || bgRgb[2] > 128;
        const suggestion = suggestFix(fgRgb, bgRgb, isLight);
        
        console.error(`  Recovery: Make foreground ${suggestion.direction} (e.g., ${suggestion.targetColor})`);
        console.error(`            would achieve ${suggestion.suggested}:1 contrast`);
      }
      
      failures.push({ selector, fgColor, bgColor });
      console.error();
    }
    
    // Print recovery steps
    console.error('\n' + '='.repeat(70));
    console.error('Recovery Procedure:');
    console.error('='.repeat(70));
    console.error(`
1. For each failing element, identify the CSS rule(s) affecting it:
   - Search for the selector in your CSS files
   - Check for inline styles or CSS custom properties
   
2. Adjust colors to meet 4.5:1 minimum for normal text, 3:1 for large text:
   - Either darken the foreground (if on light background)
   - Or lighten the foreground (if on dark background)
   
3. Use an automated checker to verify new ratios:
   - https://www.tpgi.com/color-contrast-checker/
   - https://webaim.org/resources/contrastchecker/
   
4. For semantic text colors, never lower thresholds:
   - Update the CSS variable in assets/skunkworks-accessibility.css
   - Ensure all theme variants (light/dark) pass independently
   
5. Re-run Lighthouse audit to confirm:
   - \`npm run validate:contrast\`
   - Then run full release workflow
   
6. If failures persist after CSS changes:
   - Check browser developer tools for computed colors
   - Look for opacity, overlays, or z-index issues
   - Verify CSS cascade priority (!important, specificity)
   - Check for third-party CSS interference
    `);
    
    process.exit(1);
  } catch (err) {
    console.error('✗ Error reading or parsing Lighthouse report:', err.message);
    process.exit(1);
  }
}

validateContrast();
