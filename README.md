# 🍽️ Spice Garden Restaurant Booking

AI-powered restaurant website with table booking chatbot.

## ✨ Features
- 🤖 AI chatbot for menu exploration and table booking
- 🍛 Full menu management in admin panel
- 🪑 Table availability management
- 🔔 Real-time booking notifications for admin
- 🔐 Admin login (username: admin / password: admin)
- 📊 Google Sheets as database

## 🚀 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set environment variables in .env.local
```
CLOUDFLARE_ACCOUNT_ID=your_id
CLOUDFLARE_AI_API_TOKEN=your_token
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### 3. Run locally
```bash
npm run dev
```

### 4. Deploy to Cloudflare Pages
- Push to GitHub
- Connect in Cloudflare Pages
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output: `.vercel/output/static`
- Add compatibility flag: `nodejs_compat`
- Add environment variables

## 📊 Google Sheets Structure
Create a spreadsheet with 3 tabs:
- **Dishes** — ID, Name, Category, Price, Veg, Available, Description
- **Tables** — ID, Capacity, Location, Status
- **Bookings** — ID, Guest, Phone, Table, Date, Time, Guests, Status

## 🔐 Admin Access
```
URL: yoursite.pages.dev/admin
Username: admin
Password: admin
```
