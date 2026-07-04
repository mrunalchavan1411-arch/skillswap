# SkillSwap — College Resource Sharing Web App

Ek dynamic web portal jisme college students apni skills share kar sakte hain
aur dusro se naye skills sikh sakte hain (skill barter system).

## Tech Stack
- **Frontend:** React.js (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** lowdb (file-based JSON database — koi installation nahi chahiye)
- **Real-time Chat:** Socket.io
- **Auth:** JWT (JSON Web Token) + bcrypt password hashing

## Folder Structure
```
skillswap/
├── backend/        → Server, APIs, database
└── frontend/       → React website (UI)
```

## Kaise Run Karein (Apne Laptop Par)

Pehle Node.js install hona chahiye apne laptop me (https://nodejs.org se download karo, LTS version).

### Step 1: Backend Start Karo
```
cd skillswap/backend
npm install
node server.js
```
Backend chalega: http://localhost:5000

### Step 2: Frontend Start Karo (NAYE terminal me)
```
cd skillswap/frontend
npm install
npm run dev
```
Frontend chalega: http://localhost:5173

### Step 3: Browser Me Kholo
http://localhost:5173 pe jao aur "Create an account" pe click karo.

**IMPORTANT:** Backend aur Frontend dono ek saath chalna chahiye (2 alag terminal windows me).

## Features
1. Signup/Login (JWT secure authentication)
2. Animated landing page
3. Profile management - skills offer aur skills wanted add karna, cover photo, bio
4. Smart Matching Algorithm - jo automatically compatible swap partners dhundta hai
5. Real-time Chat (Socket.io)
6. Session Scheduling - swap session book karna with status tracking
7. Explore page - search/filter karke dusre students dhundo
8. Notification dropdown - session requests aur new messages
9. Dark mode toggle
10. Ranking system (Bronze/Silver/Gold/Platinum/Diamond) + profile completion %
11. Glassmorphism UI with smooth animations (Framer Motion)
12. Loading skeletons + charts (Recharts)
13. Fully responsive professional UI

## Demo Ke Liye Tip
Presentation se pehle kam se kam 2 demo accounts bana lo jinke skills ek dusre se
match karte ho (jaise User A: teaches Photoshop, wants Guitar | User B: teaches Guitar,
wants Photoshop) — taaki Matching feature live dikha sako.
