# How to run House of Classic

The website files and changes are saved in:

```text
/home/asif/frappe/frappe-bench-v16/house-of-classic
```

## Start the saved website

Open a terminal and run:

```bash
cd /home/asif/frappe/frappe-bench-v16/house-of-classic
npm run start -- --port 3000
```

Leave that terminal running, then open **http://localhost:3000** in your browser.
This uses the existing production build, which was built and checked before the server was stopped.

## If you have changed the code

Stop any running preview first with **Ctrl+C**, then rebuild and start:

```bash
cd /home/asif/frappe/frappe-bench-v16/house-of-classic
npm run build -- --webpack
npm run start -- --port 3000
```

Webpack is used here because the default Turbopack build encountered a worker-port restriction in the coding environment. The Webpack build passed.

## Develop with automatic updates

Instead of the production server, run:

```bash
cd /home/asif/frappe/frappe-bench-v16/house-of-classic
npm run dev -- --webpack --port 3000
```

Open **http://localhost:3000**. Saved code changes will update the preview automatically.
Run only one server on port 3000 at a time.

## Stop the website

Press **Ctrl+C** in the terminal where it is running.
Closing the browser tab alone does not stop the server. Stopping the server does not delete your files.

## If dependencies or the build are missing

Node.js and npm must be installed. This project was checked with Node.js 24.
Dependencies are already installed on this machine. On a fresh copy, run:

```bash
cd /home/asif/frappe/frappe-bench-v16/house-of-classic
npm ci
npm run build -- --webpack
npm run start -- --port 3000
```

Installation and font downloads during the build may need internet access.

## Useful pages

- Home: http://localhost:3000/
- Packages: http://localhost:3000/splash-relax
- Gallery: http://localhost:3000/gallery
- Contact: http://localhost:3000/contact

Business and package details are in `lib/site.ts`.
