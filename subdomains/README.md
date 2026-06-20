# Skunkworks Academy Subdomain Launch Plan

This folder tracks the unified landing-page plan for Academy subdomains that do not yet have their own GitHub Pages deployment or confirmed DNS mapping.

## Existing repositories detected during scan

- `portal` repo exists and is intended for `portal.skunkworksacademy.com`
- `labs` repo exists and is intended for `labs.skunkworksacademy.com`

The available write scope in this session is the main `.github` website repository. The starter pages in this folder are ready to copy into the relevant subdomain repositories or hosting targets.

## Planned / linked subdomains

- `jobs.skunkworksacademy.com`
- `blog.skunkworksacademy.com`
- `docs.skunkworksacademy.com`
- `prompt.skunkworksacademy.com`
- `publish.skunkworksacademy.com`

> Note: the requested `publish.skunkworksacaemy.com` appears to be a spelling error. The corrected Academy domain is `publish.skunkworksacademy.com`.

## Required launch steps per subdomain

1. Create or confirm a dedicated GitHub repository or hosting target.
2. Add a `CNAME` file with the exact subdomain.
3. Copy the matching `subdomains/<name>/index.html` starter page.
4. Point DNS for the subdomain to the chosen hosting target.
5. Confirm HTTPS certificate provisioning.
6. Add the final URL to `sitemap.xml`, `llms.txt`, and the main homepage navigation.

All starter pages use the same adaptive light/dark theme from:

```text
https://skunkworksacademy.com/assets/academy-ecosystem.css
https://skunkworksacademy.com/assets/academy-ecosystem.js
```
