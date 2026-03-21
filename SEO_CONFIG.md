# SEO Configuration

This file documents SEO-related settings. Update these if your site URL changes.

## Base URL
Currently set to: **https://totalebiz.com/**

If deploying to a different domain (e.g., GitHub Pages), update the following:

1. **public/index.html**
   - `link rel="canonical"` href
   - All `og:url`, `og:image` meta tags
   - JSON-LD `url` and `logo` fields

2. **public/sitemap.xml**
   - All `<loc>` URLs

3. **public/robots.txt**
   - `Sitemap:` URL

## HTTPS Redirect
The audit recommends HTTPS. Configure at your hosting provider:
- **GitHub Pages**: HTTPS is enabled by default
- **Netlify/Vercel**: Automatic HTTPS
- **Custom server**: Configure redirect in nginx/Apache

## Link Building (Off-site)
"Execute a Link Building Strategy" is an off-site SEO activity. Consider:
- Guest posting on industry blogs
- Directory submissions
- Partner/partner site links
- Content marketing
