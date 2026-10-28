# Handover: House of Classic website

Read this first if you are picking up work on this project. It covers what the project is, what has been done, where things live, and what is still open.

Last updated: 24 Oct 2026

---

## 1. What this project is

A new website for **House of Classic**, a luxury party villa in Jaipur (C-9, Pratap Marg, Subhash Nagar). It replaces the old WordPress site at `houseofclassic.in`.

- Built with **Next.js 16 (App Router)**, React 19, Tailwind CSS v4, TypeScript.
- Every public page is static. There is no database.
- Content (text, rates, photos) is stored in JSON files and edited through the **admin page at `/admin`** (section 6).
- Enquiries go to **WhatsApp** (and email), so no server is needed for forms.
- It is meant to be hosted on **Vercel** (free tier).

> **Note:** This version of Next.js has breaking changes compared to older versions. Before changing framework-level code, read the docs in `node_modules/next/dist/docs/` (see `AGENTS.md`).

---

## 2. Repository and branches

- GitHub: `https://github.com/shyamsundersahani-classicIT/ClassicHOC`
- The repo root is `ClassicHOC/`. It holds two folders:
  - `house-of-classic/`: **the website** (this folder). All active work happens here.
  - `house-of-classic-src/`: saved HTML copies of the **old WordPress pages** plus `urls.txt`, used as reference when moving content across. Do not deploy it.
- Branches:
  - `main`: the merged, current version.
  - `asif-siddki`: Asif's branch (merged into `main` through PR #1).
  - `aman`: Aman's working branch. Merged into `main` through PR #2, then brought up to date with `main` (28 Oct 2026).

**Rule:** do not commit straight to `main`. Work on your own branch and open a pull request.

### Git history so far

| Commit | What it did |
|---|---|
| `b1a73ff` | First commit of the HOC website. |
| `94bcde7` | Fixed the repo: `house-of-classic` had been added as a broken submodule (it had its own nested `.git`), so its files never reached GitHub. The nested `.git` was removed and the real files were added. |
| `f3ac05b` | Merged PR #1 (`asif-siddki` into `main`). |
| `5897a57` | Admin panel, "Our Tie-ups" page removed, Windows `dev` script fix, this handover file. Merged through PR #2 (`16da9b3`). |
| `c830e2b` | Asif: "Menu pages". New **Reserve the Villa** page at `/product/hoc-booking` and a booking menu (`components/BookingMenu.tsx`); Splash & Relax moved under it in the header. Merged through PR #3 (`0e68f77`). |

---

## 3. What has been done

### Pages built (public pages are in `app/(site)/`)

| URL | File | Contents |
|---|---|---|
| `/` | `app/(site)/page.tsx` | Home: hero slideshow, intro, amenities ("Everything in one villa"), Splash & Relax teaser, rooms ("Comfort and luxury"), "Plan your celebration" call to action |
| `/gallery` | `app/(site)/gallery/page.tsx` | Masonry photo gallery with a lightbox |
| `/amenities` | `app/(site)/amenities/page.tsx` | Pool, garden, dance floor, bar, cinema, game zone, gym, bedrooms |
| `/splash-relax` | `app/(site)/splash-relax/page.tsx` | The 4 Splash & Relax (Aqua Party) packages with prices, plus an enquiry form |
| `/product/hoc-booking` | `app/(site)/product/hoc-booking/page.tsx` | Reserve the Villa: Lawn, Premium and Entire House party packages, plus an enquiry form. Added by Asif. **Its prices are still written in the page file, not in the admin** |
| `/contact` | `app/(site)/contact/page.tsx` | Contact details, map, enquiry form |
| `/rules-regulations` | `app/(site)/rules-regulations/page.tsx` | Policy page |
| `/privacy-policy` | `app/(site)/privacy-policy/page.tsx` | Policy page |
| `/cancellation-refund-policy` | `app/(site)/cancellation-refund-policy/page.tsx` | Policy page |
| 404 | `app/not-found.tsx` | Custom "page not found" page |
| `/admin` | `app/admin/page.tsx` | Password-protected content editor (section 6). Not linked from the site, blocked in `robots.txt` |

The `(site)` folder is a Next.js route group: it doesn't appear in URLs. It exists so `app/(site)/layout.tsx` can give the public pages their header, footer and effects, while `/admin` gets a plain page.

### Features

- **Single content file:** business details, rates, amenities, page text and which photo goes where are in `data/content.json`. `lib/site.ts` re-exports them for the pages, so the same detail is never typed in two places.
- **Enquiry form** (`components/EnquiryForm.tsx`): opens WhatsApp with the message already filled in. There is also a mailto fallback.
- **Automatic gallery** (`lib/photos.ts`): every `.webp`, `.jpg` or `.png` file in `public/images/` shows up in the gallery. It reads each photo's real size so the grid keeps its shape. Logos, maps, menus, business cards and so on are excluded by filename prefix.
- **Lightbox and slideshows**: `Lightbox.tsx`, `Slideshow.tsx`, `HeroSlideshow.tsx`.
- **Scroll reveal animations**: `ScrollReveals.tsx`.
- **SEO**:
  - Page titles and descriptions, plus Open Graph images (`app/layout.tsx`).
  - `LodgingBusiness` structured data (JSON-LD) with the address, phone and location.
  - `sitemap.xml` (`app/sitemap.ts`) and `robots.txt` (`app/robots.ts`).
  - **Redirects** from old WordPress URLs (`next.config.ts`): `/elementor-280` goes to `/`. (The old `/product/hoc-booking` redirect was removed on 28 Oct 2026, because that address is now the real Reserve the Villa page.) The removed `/our-tie-ups` page also redirects to `/`.
- **Policy text** was copied from the old site into `data/legal.json` and is shown through `components/LegalPage.tsx`.
- **Photos** were converted to `.webp` in `public/images/` (about 68 files).
- **Splash & Relax prices** were typed in from the Aqua Party rate chart (`rates` in `data/content.json`): Rs 15,000, Rs 18,000, Rs 25,000 and Rs 30,000, plus a Rs 10,000 security deposit.

### Bolder design, Phase 1 (inspired by slice.bank.in)

Techniques adapted from the Slice bank home page, keeping our own fonts and theme colours:

- **Big, tight headings:**
  - Two classes in `app/globals.css`: `display-xl` for page titles (about 3rem on phones up to 6.5rem) and `display-lg` for section headings (2.5rem up to 5rem).
  - Used on the home page and the Splash & Relax page.
  - The map card heading on the home page only got a smaller bump, because the card is half the page wide.
- **Full-width home banner** (changed 28 Oct 2026 at the owner's request):
  - The home banner is now styled like the Gallery page slideshow. The slideshow photos fill the whole banner behind a wine gradient, and the heading, text, buttons and photo tiles sit on top.
  - Thumbnails sit on the right (wide screens) and a gold progress bar runs along the bottom. The caption, arrows, pause button and dots were removed at the owner's request. Instead, the slideshow pauses while the mouse is over the banner or keyboard focus is inside it.
  - Code: `components/HeroSlideshow.tsx`, which now takes the banner content as children. Photos and captions are still edited in the admin under **Photos > Home page slideshow**.
- **Photo tiles in the home banner:**
  - Three clickable photo tiles under the banner buttons: Aqua Party, Reserve the Villa, Gallery. On phones they scroll sideways.
  - Content is in `pages.home.tiles` in `data/content.json`. Admin: **Page text > Home page: photo tiles in the banner** (title, line underneath, photo, which page it opens).
  - In the line underneath, `{fromPrice}` shows the lowest package price.
- **Frosted-glass package cards on Splash & Relax:**
  - The banner and the package cards now share one full-width pool photo (`pages.splash.heroImage`).
  - The cards use the `.glass` class in `app/globals.css`, which is built from the theme's cream colour. The recommended package keeps a gold border and darker glass.
  - The comparison table and "Before you book" stay below on a light background.
- **Checked** (28 Oct 2026) with screenshots at 360px and 1440px wide, in Royal Wine, Rajwada Blue, Emerald Garden and Midnight Minimal. Not checked: Desert Sandstone, and real phones.
### Bolder design, Phase 2 (28 Oct 2026)

- **Smoother rise-in:**
  - The existing reveal effect (`components/ScrollReveals.tsx` plus the `[data-reveal-state]` rules in `app/globals.css`) is now longer and softer, and headings rise further (48px).
  - Items that come into view together (a row of cards) arrive about 90ms apart, using the `--reveal-delay` CSS variable.
  - Still switched off for visitors who prefer reduced motion.
- **Amenity photo panels** (`app/(site)/amenities/page.tsx`):
  - Each amenity is a large photo panel (at least 80% of the screen height) with a frosted-glass text card. The panels scroll normally, one after another.
  - A pinned, overlapping "deck of cards" version, where each panel stayed put while the next slid over it, was tried and **removed on 28 Oct 2026 at the owner's request**: the next panel covered the text card while scrolling. Don't bring it back without asking.
  - An amenity without a photo shows a gradient in the theme's colours.
- **Essentials strip** (home page, after the packages teaser):
  - Four short facts under the heading "The essentials, upfront."
  - Every fact is reworded from text already on the site (fixed package charge, refundable deposit, "Food is allowed", same-day WhatsApp replies). Nothing new is claimed.
  - **The owner should still review it.** Admin: **Page text > Home page: essentials strip**. Use `{fromPrice}` and `{deposit}` for live prices.
  - We avoided the heading "No fine print", because the Splash & Relax page asks guests to confirm "applicable terms" before booking.
- **Closing call to action** (end of the home page):
  - "Your celebration starts here." over a full-width photo, with a WhatsApp button (message pre-filled) and a call button.
  - Admin: **Page text > Home page: closing call to action** (heading, paragraph, background photo).
- **Checked** with screenshots at 360px and 1440px wide, in Royal Wine, Rajwada Blue and Desert Sandstone. The amenity panels were re-checked at 1366×768 and 360px after the overlap was removed. Not checked on a real phone, and the new admin sections were not opened in a browser.

### Testing-only tools (temporary, must be removed before launch)

These let the client compare looks live in the browser. A floating panel on every page switches between them.

- **Colour themes** (`lib/themes.ts`): Royal Wine (the default), Rajwada Blue, Desert Sandstone, Emerald Garden, Midnight Minimal.
- **Motion effects** (`lib/effects.ts`, `components/EffectsLayer.tsx`): None, Champagne Glow (the default), Starlit Evening, Poolside Ripples, Golden Celebration, Silk & Light.
- The panel itself: `components/PreviewControls.tsx`.

**Once the client picks a theme and an effect:**

1. Hardcode the chosen theme as the default.
2. Remove `PreviewControls` from `app/(site)/layout.tsx`, and the `themeBootScript` from `app/layout.tsx`.
3. Remove `EffectsLayer` too if "None" is chosen.

The `TESTING ONLY` comment in `app/layout.tsx` marks this code. `EffectsLayer` is in `app/(site)/layout.tsx`.

---

## 4. How to run it (Windows)

> `HOW-TO-RUN.md` was written for Asif's Linux machine (`/home/asif/...`). On Windows, use the steps below.

```powershell
cd C:\Users\78GAman\Desktop\HOC\ClassicHOC\house-of-classic
npm install
npm run dev      # then open http://localhost:3000
```

**If PowerShell says "running scripts is disabled on this system":** Windows is blocking npm's PowerShell script. Either:

- type `npm.cmd` instead of `npm` (for example `npm.cmd run dev`), or
- allow scripts for your Windows user once, with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (answer `Y`), then reopen the terminal.

The `dev` script uses `cross-env`, so it works on Windows, macOS and Linux.

To use the admin page locally, first create a file `.env.local` in this folder containing one line, `ADMIN_PASSWORD=choose-a-password`, then restart the server and open http://localhost:3000/admin. (`.env.local` is ignored by git, so the password never gets committed.)

Production build:

```powershell
npx next build --webpack
npx next start --port 3000
```

Webpack is used because the default Turbopack build hit a worker-port restriction in an earlier environment. The Webpack build passes.

Run only one server on port 3000 at a time.

---

## 5. Where to change things

Most content is now edited at **`/admin`** (section 6). Developers can also edit `data/content.json` directly.

| To change | Admin page tab | File |
|---|---|---|
| Package prices, timings, guest limits, included spaces, security deposit | Rates & packages | `data/content.json`, `rates` |
| Headings and paragraphs on the home, amenities, Splash & Relax, gallery and contact pages | Page text | `data/content.json`, `pages` |
| Event types in the scrolling band | Page text | `data/content.json`, `eventTypes` |
| Amenities (title, text, photo) | Amenities | `data/content.json`, `amenities` |
| Upload or delete photos; slideshows; which photo goes where | Photos | `public/images/` and `data/content.json` |
| Phone, WhatsApp, email, address, map location, check-in/out, social links, Google description | Business details | `data/content.json`, `business` |
| Policy wording | Policies | `data/legal.json` |
| Menu items | (code only) | `lib/site.ts`, `nav` |
| Website domain | (code only) | `lib/site.ts`, `site.url` |
| Old URL redirects | (code only) | `next.config.ts` |
| Colours and global styles | (code only) | `app/globals.css` |

Small labels (such as "About the villa" and button texts) are still in the page files.

---

## 6. Admin page (`/admin`)

### What it does

A password-protected editor with six tabs: **Rates & packages**, **Page text**, **Amenities**, **Photos**, **Business details** and **Policies**.

- Changes are made in the browser and only go live when you press **Save changes**. The page warns you if you try to leave with unsaved changes.
- Before saving, the server checks the data, so a bad save can't break the site. For example, it rejects a price that isn't a number, a missing photo, or a package that includes a space that no longer exists.
- In page text, writing `{fromPrice}` shows the lowest package price, so sentences like "from ₹15,000" update when rates change. The security deposit and guest-limit sentences on the Splash & Relax page are also written automatically from the rates.
- **Photo uploads** are shrunk in the browser to at most 1600px and converted to WebP before upload. Uploaded photos appear in the website gallery automatically. A photo that is still used somewhere can't be deleted, and the logo and site icon are protected.

### Turning it on

| Environment variable | Needed | What it is |
|---|---|---|
| `ADMIN_PASSWORD` | Always | The admin password. Without it, `/admin` shows "Admin is switched off". Changing it signs everyone out. |
| `GITHUB_TOKEN` | Live site only | A GitHub fine-grained personal access token with **Contents: Read and write** on the `ClassicHOC` repo. |
| `GITHUB_BRANCH` | Optional | Branch to save to. Default `main`, which should be the branch Vercel deploys. |
| `GITHUB_REPO` / `GITHUB_DIR` | Optional | Default `shyamsundersahani-classicIT/ClassicHOC` and `house-of-classic`. |

On Vercel, set these in **Project > Settings > Environment Variables**, then redeploy.

### How saving works

- **On your own computer** (no `GITHUB_TOKEN`), saves write straight to `data/*.json` and `public/images/`. `npm run dev` shows changes right away. With `next start`, you have to rebuild first.
- **On the live site** (`GITHUB_TOKEN` set), Vercel's disk is read-only, so each save becomes a **git commit** to the repo. Vercel sees the commit and rebuilds, and the change is live in about **1-2 minutes**. Every change is in git history, so a bad edit can be undone by reverting its commit.
- Admin commits are made directly on the deploy branch, with messages like "Admin: update website content". **Developers: run `git pull` before editing `data/content.json` or `public/images/`**, or you may get merge conflicts with edits made through the admin page.

### Code

| File | Role |
|---|---|
| `app/admin/page.tsx` | Checks login and loads the latest saved content (from GitHub on the live site, so a fresh save shows straight away) |
| `app/admin/actions.ts` | Server actions: login, logout, save content, save policies, upload photo, delete photo. Every action checks the login itself |
| `lib/admin/auth.ts` | Password check and a signed, HTTP-only session cookie (7 days) |
| `lib/admin/store.ts` | Saves to local files or to GitHub, depending on `GITHUB_TOKEN` |
| `components/admin/AdminEditor.tsx`, `fields.tsx`, `LoginForm.tsx` | The editor screens |

### Tested and not yet tested

- **Tested** on a local production build (24 Oct 2026), by calling the admin's server actions directly with scripted requests:
  - Logging in works, and a wrong password is rejected.
  - A save without being logged in is refused.
  - Invalid data, a missing photo, and an attempt to delete a file outside `public/images/` are all rejected.
  - Saving, uploading and deleting photos work.
  - The public pages show the saved values.
- **Not tested yet:**
  - **GitHub mode.** It needs a real token, so try it on Vercel before relying on it.
  - **The editor screens in a real browser.** Click through every tab once.
- The session cookie is marked `secure` in production builds. Over plain `http://` it only works on `localhost`, not on a LAN IP; on the live HTTPS site this is fine.

---

## 7. Still to do (open tasks)

### Priority tasks (from the owner, in order)

**1. Admin page for content (rates, plans, paragraphs, photos): BUILT (24 Oct 2026), see section 6**
- [x] Password-protected `/admin` page for rates, packages, page text, amenities, photos, business details and policies.
- [ ] Set `ADMIN_PASSWORD` and `GITHUB_TOKEN` on Vercel, then test a save on the live site.
- [ ] Click through every tab in a real browser, on a computer and on a phone.
- [ ] Move the **Reserve the Villa** prices (Lawn Party ₹20,000, Premium ₹30,000, Entire House ₹40,000) from `app/(site)/product/hoc-booking/page.tsx` into `data/content.json`, so staff can change them in the admin like the Splash & Relax rates.
- [ ] Later, if needed: let staff edit the small labels and button texts, and the photo descriptions (alt text) used by screen readers and Google.

**2. Connect with Airbnb and MakeMyTrip**
- [ ] Sync bookings and availability so the same date can't be booked on two platforms.
- [ ] Neither Airbnb nor MakeMyTrip offers an open public API for a single property. The usual routes are:
  - **Calendar (iCal) sync:** Airbnb can export and import iCal calendar links. This syncs blocked dates only, not prices.
  - **Channel manager** (for example eZee, STAAH, AxisRooms or Hostaway): connects to Airbnb, MakeMyTrip/Goibibo and others in one place, and syncs rates and availability. Usually a paid service.
- [ ] First confirm whether House of Classic is already listed on both platforms, and get the account access.
- [ ] Rates now live in `data/content.json` (task 1). A channel manager would become the master copy of rates and availability; decide which system "owns" prices so they don't drift apart.

**3. WhatsApp bot for automatic replies**
- [ ] Auto-reply to customer WhatsApp messages: greeting, package prices, availability, location, and a hand-off to staff.
- [ ] Options:
  - **WhatsApp Business app:** free, built-in greeting, away and quick replies. Basic, with no real bot logic.
  - **WhatsApp Business Platform (Meta Cloud API)**, used directly or through a provider such as Interakt, WATI, AiSensy or Gupshup: a full bot. Needs a Meta Business account, a verified number and approved message templates, and is billed per conversation.
- [ ] The bot should read prices from `data/content.json` (task 1), so its replies match the website.
- [ ] The site's enquiry form already sends to WhatsApp number `919829132322` (Business details tab in the admin). Check whether the bot will run on that number.

**4. Remove the "Our Tie-ups" page: DONE (24 Oct 2026)**
- [x] Deleted the `our-tie-ups` page folder, plus the `tieUps` data and the menu link in `lib/site.ts`.
- [x] Removed the page from `app/sitemap.ts`. `/our-tie-ups` now redirects to `/` (`next.config.ts`).
- [x] Deleted the assets it alone used: `public/menus/Menu-chowka.pdf`, `public/images/satkar.webp`, `Menu-chowka_Updated-1-1.webp`, `chowka-menu-preview.png`. They can be recovered from git history (commit `f3ac05b`) if ever needed.
- [x] Updated `HOW-TO-RUN.md` and this file.

### Content and business

- [ ] Fill in the Facebook, Instagram and YouTube links (admin: Business details).
- [ ] Decide on a nightly rate. Note: `nightlyRate` exists in `data/content.json` but **no page shows it yet**, so the admin page doesn't offer it. A page would need to display it first.
- [ ] **Check the map coordinates** (admin: Business details). The current 26.9124, 75.7873 is only approximate. Confirm it on Google Maps.
- [ ] Have the privacy, cancellation and rules policies reviewed. They were copied from the old site.
- [x] Guest reviews section on the home page (28 Oct 2026):
  - Shows the real Airbnb scores: 4.87 from 15 reviews, plus the six category scores.
  - Layout (from the owner's mockup, in our theme colours): a framed rounded card.
    - Left: the rating with stars filled to the exact score.
    - Right: "Detailed ratings" with an icon per category (`components/RatingIcon.tsx`, chosen by category name; unknown names get a star).
    - The slide-to-open controls alternate sides: the first starts on the left and slides right, the second starts on the right and slides left.
  - Underneath are two stacked **"slide to open"** controls (`components/SlideToOpen.tsx`), one for Airbnb (https://www.airbnb.co.in/rooms/809803371091618766) and one for MakeMyTrip (https://www.makemytrip.com/hotels/house_of_classic_jaipur-details-jaipur.html).
    - At the owner's request, a click or tap does nothing. The visitor drags the gold handle at least 85% of the way, and the site opens in a new tab.
    - Keyboard users can't drag, so they use the arrow keys, or Enter to open.
    - Sites and links are edited in the admin under **Booking sites** in the guest reviews section.
    - Tested in headless Edge with real mouse events: a click opens nothing, a 40% drag springs back, a full drag opens each site, and Enter works.
    - The MakeMyTrip page blocks automated visitors, so its content couldn't be checked; confirm the link by hand.
  - Admin: **Page text > Home page: guest reviews**. The flow was tested end to end in a browser: sign in, add a review, save, and it appears on the home page.
- [ ] Paste the actual review texts into that admin section. Airbnb loads review texts with JavaScript, so they couldn't be copied automatically; copy them from the Airbnb host dashboard **word for word** with the guest's first name and month. The quote cards stay hidden until at least one is added.
- [ ] Update the scores and the "Last checked" month now and then, as new Airbnb reviews come in.
- [ ] The "Indoor Bar Area" amenity has no photo yet (admin: Amenities).
- [ ] Recheck the Splash & Relax prices against the latest rate chart.

### Design

- [ ] Client to pick the final colour theme and motion effect.
- [ ] Then remove the testing-only preview panel (see section 3).

### Technical

- [x] Fixed the `dev` script so it works on Windows (now uses `cross-env`).
- [ ] `allowedDevOrigins: ["192.168.1.134"]` in `next.config.ts` is one developer's LAN IP, there so the site can be tested from a phone. Change it to your own IP if needed.
- [ ] Test the WhatsApp enquiry button on a real phone.
- [ ] Add redirects for any other old WordPress URLs that matter, such as blog posts (see `house-of-classic-src/urls.txt`). Without one, an old URL shows a 404.

### Launch

- [ ] Deploy to Vercel: import the GitHub repo and set the root directory to `house-of-classic`. Add the admin environment variables (section 6).
- [ ] Add the `houseofclassic.in` and `www.houseofclassic.in` domains in Vercel, then update the DNS records at the domain registrar.
- [ ] Keep the WordPress site live until the new site has been checked on a phone.
- [ ] After the switch: submit `https://houseofclassic.in/sitemap.xml` in Google Search Console, and update the website link in the Google Business Profile.

---

## 8. Other docs in this folder

- `README.md`: overview, deployment steps and the pre-launch checklist.
- `HOW-TO-RUN.md`: run instructions (Linux paths, from Asif's machine).
- `AGENTS.md` / `CLAUDE.md`: notes for AI coding assistants about this Next.js version.
