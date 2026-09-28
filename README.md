# BedMatch Family Placement Landing Page

Static marketing site for **familyplacement.bedmatch.health** — connecting medically fragile children with qualified foster families.

## 🏗️ Structure

```
site/               # Everything uploaded to server (document root)
├── index.html      # Main landing page
├── 404.html        # Custom 404 page
├── robots.txt      # Search engine directives
├── sitemap.xml     # Site map
├── .htaccess       # Apache config (caching, compression, security)
├── favicon.ico
├── favicon-32.png
├── apple-touch-icon.png
└── assets/
    ├── styles.css      # All styles (responsive, no build step)
    ├── app.js          # Mobile menu + carousel
    ├── tracking.js     # UTM pass-through + GTM consent
    ├── fonts/          # Self-hosted DM Sans + Playfair Display
    └── images/         # Optimized AVIF + WebP images

source-images/      # Full-size originals (not uploaded)
scripts/            # Image optimization script
.github/workflows/  # GitHub Actions deployment
```

## 🚀 Deployment

### One-Time Setup

1. **cPanel Domain**:
   - Create domain: `familyplacement.bedmatch.health`
   - Separate document root (e.g. `/home/<acct>/familyplacement.bedmatch.health`)
   - Uncheck "Share document root"

2. **Cloudflare DNS** (bedmatch.health zone):
   - A record: `familyplacement` → WHM server IP
   - Proxy enabled (orange cloud)
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On

3. **cPanel SSL**:
   - SSL/TLS Status → Run AutoSSL for subdomain

4. **GitHub Secrets** (Settings → Secrets and variables → Actions):
   ```
   WHM_HOST: server hostname or IP
   WHM_USER: cPanel username
   WHM_PASSWORD: cPanel/FTP password
   WHM_REMOTE_DIR: /home/<acct>/familyplacement.bedmatch.health
   WHM_PROTOCOL: sftp (or ftps)
   WHM_PORT: 22 (sftp) or 21 (ftps)
   WHM_KNOWN_HOSTS: output of ssh-keyscan -p 22 <host>
   ```

5. **First Deploy**:
   - Actions → "Deploy family-placement landing page (WHM)" → Run workflow

### Auto-Deploy

Every push to `site/` on `main` branch triggers automatic deployment.

Deploy only uploads/overwrites files — never deletes. Remove old files manually in cPanel File Manager.

## 📊 Tracking

### Attribution (Always On, No Cookies)
- Every link to `app.bedmatch.health` carries incoming UTM parameters
- If no UTMs present, adds default: `utm_source=familyplacement&utm_medium=landing_page&utm_campaign=family_placement&utm_content=<button_name>`
- App stores first-touch UTMs on lead record

### Google Tag Manager (Consent-Gated)
- Container: `GTM-W7TP6DT7` (shared with bedmatch.health)
- Loads only after "Accept all" consent
- CTA clicks push: `{ event: "cta_click", cta_name, cta_text, link_url }`
- In GTM: Create Custom Event trigger on `cta_click` for GA4/Ads/Meta tags

## 🔍 SEO & Performance

- **Meta tags**: Title, description, canonical, Open Graph, Twitter Card
- **Structured data**: Organization, WebPage, FAQPage (JSON-LD)
- **Sitemap**: Submit to Google Search Console (update `<lastmod>` when content changes)
- **Images**: AVIF/WebP with `srcset` (2 sizes), hero preloaded
- **Fonts**: Self-hosted (no Google Fonts before consent)
- **Lighthouse**: 99 mobile / 100 desktop (Performance, Accessibility, Best Practices, SEO all 100)

## 🖼️ Changing Images

1. Put full-size original in `source-images/` (same filename)
2. Run: `cd family-placement && npm i --no-save sharp && node scripts/optimize-images.mjs`
3. For new images: Add to `PHOTOS` array in script + add `<picture>` block in HTML

## 📱 Responsive Breakpoints

Tested at: 320, 360, 375, 414, 600, 681, 768, 820, 900, 901, 960, 1024, 1100, 1180, 1280, 1440, 1920px

| Width | Layout |
|-------|--------|
| > 1180px | Desktop |
| ≤ 1180px | Hero text narrows |
| ≤ 1024px | Testimonials: photo on top |
| ≤ 960px | Header collapses to ☰ menu |
| ≤ 900px | Hero stacks, 2-column grids |
| ≤ 680px | Single column (phone) |

## 🔗 Links

- **Live site**: https://familyplacement.bedmatch.health
- **Sign up**: https://app.bedmatch.health/signup
- **Main site**: https://bedmatch.health

## 📝 Notes

- No build step required — plain HTML/CSS/JS
- Fonts licensed under SIL OFL (self-hosted)
- GTM container shared with main bedmatch.health site
- Cloudflare proxy handles SSL/CDN
- Apache handles compression/caching via .htaccess

---

**Last Updated**: 2026-09-28  
**Maintained by**: BedMatch Health
