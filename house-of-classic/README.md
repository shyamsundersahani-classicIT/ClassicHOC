# House of Classic website

Next.js (App Router) site for House of Classic, Jaipur. Static HTML, fast, and SEO-ready.

## 1. Run locally

See [HOW-TO-RUN.md](./HOW-TO-RUN.md) for starting the saved build, developing, rebuilding, and stopping the local website.

```bash
npm install
npm run dev        # http://localhost:3000
```

## 2. Change content (text, rates, photos)

Use the admin page at `/admin`. See [HANDOVER.md](./HANDOVER.md), section 6, for setup (`ADMIN_PASSWORD`, plus `GITHUB_TOKEN` on the live site).

Developers can also edit `data/content.json` (business details, rates, page text, photo choices) and `data/legal.json` (policies) directly.

## 3. Add photos

Upload them on the admin page (Photos tab), or drop `.webp`/`.jpg`/`.png` files into `public/images/`. The gallery picks them up automatically (except files starting with `logo`, `favicon`, `map`, `index`, `Menu`, `satkar`, `WhatsApp`). Keep files around 1600px wide to keep the site fast.

## 4. Deploy (free, recommended: Vercel)

1. Create a GitHub repo and push this folder:
   ```bash
   git add . && git commit -m "Initial Next.js site"
   git branch -M main
   git remote add origin https://github.com/<you>/house-of-classic.git
   git push -u origin main
   ```
2. Go to https://vercel.com, sign in with GitHub, click **Add New > Project**, pick the repo, click **Deploy**. You get a `*.vercel.app` URL in about a minute.
3. In the Vercel project: **Settings > Domains**, add `houseofclassic.in` and `www.houseofclassic.in`.
4. At your domain registrar's DNS panel, set the records Vercel shows (usually an `A` record for `@` to `76.76.21.21` and a `CNAME` for `www` to `cname.vercel-dns.com`).
5. Every `git push` to `main` redeploys automatically.

## 5. Go live without downtime

- Keep the WordPress site running until the new site is checked on a phone.
- Old URLs that are redirected in `next.config.ts` keep their Google ranking. Others (for example old blog posts) return 404 unless you add redirects.
- After the switch: add the site to Google Search Console, submit `https://houseofclassic.in/sitemap.xml`, and check Google Business Profile links point to the new domain.

## 6. Before launch checklist

- [ ] Fill in social links on the admin page (Business details)
- [ ] Confirm the map location is the correct property
- [ ] Review the privacy and cancellation policies
- [ ] Paste real Airbnb review texts into the admin (Page text > Home page: guest reviews). The scores are already shown
- [ ] Test the WhatsApp enquiry button on a phone
