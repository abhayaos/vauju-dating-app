# Yugal Meet - Dating App

This is a modern dating application built with React 19, Vite, and Tailwind CSS.

## Dependency Conflict Resolution

This project uses React 19, which may cause dependency conflicts with some packages. To resolve these conflicts, use one of the following approaches:

### For Local Development:
```bash
npm install --legacy-peer-deps
# or
npm run install:legacy
```

### For Vercel Deployment:
The vercel.json file is already configured to use `--legacy-peer-deps` during installation.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run sitemap` - Generate sitemap.xml
- `npm run install:legacy` - Install dependencies with legacy peer deps

## Project Structure

- `src/pages/Home.jsx` - Main landing page
- `src/pages/PageNotFound.jsx` - 404 error page
- `public/robots.txt` - Search engine crawler instructions
- `public/sitemap.xml` - XML sitemap for SEO
- `public/ads.txt` - AdSense verification file

## SEO Features

- React Helmet for dynamic meta tags
- Responsive design for all devices
- Proper 404 error handling
- Sitemap generation script
- robots.txt and ads.txt files