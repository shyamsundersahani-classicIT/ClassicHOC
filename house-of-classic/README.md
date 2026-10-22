# House of Classic website

Next.js (App Router) site for House of Classic, Jaipur. Static HTML, fast, and SEO-ready.

## 1. Run locally

See [HOW-TO-RUN.md](./HOW-TO-RUN.md) for starting the saved build, developing, rebuilding, and stopping the local website.

```bash
npm install
npm run dev        # http://localhost:3000
```

## 2. Change business details

Edit `lib/site.ts`:

- phone, WhatsApp number, email, address
- `social` links (Facebook, Instagram, YouTube)
- `nightlyRate`: leave empty to show "Ask for price", or fill it in
- `splashPackages`: prices for the Splash & Relax packages
- `geo`: latitude and longitude of the property (check on Google Maps)

Policy text is in `data/legal.json`. It was copied from the old site. Have it reviewed before publishing.

## 3. Add photos

Drop `.webp` files into `public/images/`. The gallery picks them up automatically (except files starting with `logo`, `favicon`, `map`, `index`, `Menu`, `satkar`, `WhatsApp`). Keep files around 1600px wide to keep the site fast.

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

- [ ] Fill in social links and nightly rate in `lib/site.ts`
- [ ] Confirm the map location is the correct property
- [ ] Review the privacy and cancellation policies
- [ ] Add real customer reviews (the old "Lorem ipsum" testimonial was removed)
- [ ] Test the WhatsApp enquiry button on a phone
