# 🎯 Discord Studio — Professional Webhook & Embed Designer

> A modern, high-performance, and feature-rich **Discohook alternative** built with **Vite, React 18, TypeScript, Tailwind CSS, and Zustand**.

---

## 🌟 Key Features

* **⚡ Real-Time Discord Live Preview**: Pixel-perfect replication of Discord desktop and mobile message rendering (custom fonts, circle avatars, verified `BOT` badge, timestamps, markdown formatting).
* **🎨 Rich Embed Designer**: Support for up to 10 embeds per message, decimal-to-hex color picker with 8 Discord brand presets, clickable titles, author profiles, and footer timestamps.
* **📋 12-Column Responsive Field Grid**: Organize embed fields with a single click. Inline fields automatically arrange into clean 3-column rows.
* **🔘 Interactive ActionRow & Button Builder**: Visual button designer with Discord's 5 official styles (Primary, Secondary, Success, Danger, Link). Includes a 1-click **Discord.js v14 code exporter** for custom bots.
* **✨ 1-Click Server Templates**: Ready-to-send templates for **Server Rules**, **Support Tickets**, **Anti-Raid Verification**, **Announcements**, and **Store/VIP Tiers**.
* **💾 Automatic Draft Protection**: All work is continuously auto-saved to browser `localStorage` via Zustand `persist` middleware. Never lose your rules or drafts on accidental tab closures.
* **🔒 Token-Safe Shareable URLs**: Generate and share designs via base64 URLs. Webhook tokens are **deliberately stripped** to guarantee channel security.
* **🔄 Full Discohook JSON Compatibility**: Bidirectional Raw JSON editor allowing users to export or import any Discohook backup file directly.
* **🩺 Smart Webhook Health Checker**: Test webhook reachability before sending, with clear error translation (404 deleted, 401 unauthorized, 429 rate limit).

---

## 🚀 Quick Start (Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to start designing.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory.

---

## 🌐 100% Free Hosting Guide (Deploy in 2 Minutes)

Because Discord Studio is a pure client-side web application, it requires **zero backend servers or databases** and can be hosted for **$0 forever**.

### Option 1: Vercel (Recommended — 30 Seconds)
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework preset will automatically detect **Vite**.
5. Click **"Deploy"**. Your site is now live globally with free HTTPS and custom domain support!

### Option 2: Netlify (Drag and Drop)
1. Run `npm run build` on your computer.
2. Log into [netlify.com](https://netlify.com).
3. Drag and drop the generated `dist` folder onto the Netlify dashboard.
4. Your website is instantly published!

### Option 3: GitHub Pages
1. In `vite.config.ts`, add: `base: './'`
2. Run `npm run build` and publish the `dist` folder to your repo's `gh-pages` branch.

---

## 🛡️ Security & Privacy

* **Zero Server Tracking**: Discord Studio has no backend database collecting webhook URLs. All `fetch` requests go directly from the user's browser to Discord's official API (`https://discord.com/api/webhooks/...`).
* **Content Security**: All Discord Markdown is tokenized and rendered as native React Virtual DOM elements with **zero usage of `dangerouslySetInnerHTML`**, eliminating Cross-Site Scripting (XSS) vectors.

---

## 📄 License
MIT License. Free to use, customize, and self-host for personal or commercial Discord communities.
