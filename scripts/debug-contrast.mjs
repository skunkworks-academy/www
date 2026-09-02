#!/usr/bin/env node

/**
 * Debug contrast issues from lighthouse-contrast.json
 * Run after Lighthouse generates the report
 */

import fs from 'fs';
import path from 'path';

const reportPath = process.argv[2] || './lighthouse-contrast.json';

if (!fs.existsSync(reportPath)) {
  console.error(`Report not found: ${reportPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
const audit = report.audits['color-contrast'];

console.log('=== Color Contrast Audit Debug ===\n');
console.log(`Score: ${audit.score}`);
console.log(`Display Value: ${audit.displayValue}\n`);

if (!audit || audit.score !== 1) {
  console.log('❌ Contrast audit FAILED\n');
  
  if (audit?.details?.items?.length > 0) {
    console.log(`Found ${audit.details.items.length} contrast violation(s):\n`);
    
    audit.details.items.forEach((item, idx) => {
      console.log(`[${idx + 1}] ${item.node?.selector || item.node?.snippet || 'Unknown'}`);
      console.log(`    Contrast Ratio: ${item.contrastRatio?.toFixed(2) || 'N/A'}`);
      console.log(`    Foreground: ${item.backgroundColor || 'N/A'}`);
      console.log(`    Background: ${item.backgroundColor || 'N/A'}`);
      console.log(`    Font Size: ${item.fontSize || 'N/A'}`);
      console.log(`    Font Weight: ${item.fontWeight || 'N/A'}`);
      console.log();
    });
  }
} else {
  console.log('✅ All color contrast checks passed!');
}
