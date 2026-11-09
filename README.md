# 📱 Smart MMS (মেস ম্যানেজার) — Next.js, MongoDB & Firebase Auth (Mobile-First)

Smart MMS (মেস ম্যানেজার) is a specialized bachelor mess and student/working hostel meal and shared expense management system designed specifically for the Bangladeshi bachelor mess ecosystem. Built with **Next.js (App Router)**, **MongoDB**, **Firebase Auth**, and a **Mobile-First PWA** design system.

---

## 🌟 Key Features

1. **Mobile-First UX (360px - 430px Optimized)**:
   - Sticky bottom navigation bar with 5 primary touch destinations.
   - Slide-up bottom drawers (`BottomDrawer.tsx`) replacing cumbersome modals.
   - Minimum 48px × 48px touch targets with instant increment/decrement meal steppers.
   - Floating Action Button (FAB) for 1-tap quick actions (Add Meal, Add Bazaar, Add Deposit).
   - High-contrast financial balance alert banner ("আপনার পাওনা" / "আপনার বকেয়া").

2. **MongoDB Database Architecture**:
   - 8 collections: `houses`, `users`, `meals`, `bazaars`, `deposits`, `fixed_costs`, `individual_bills`, and `permissions`.
   - Compound indexes for millisecond query performance.
   - Singleton connection pooling (`src/lib/mongodb/client.ts`) optimized for Next.js serverless route handlers.

3. **Firebase Authentication & RBAC**:
   - Email & Password, Phone OTP, and Google Sign-in.
   - Verified server-side via Firebase Admin SDK.
   - Automatic sync with MongoDB `users` collection.
   - 3-tier Role-Based Access Control (`super_admin`, `manager`, `member`).

4. **Accurate Accounting Math Engine**:
   - Real-time live meal rate: $\frac{\text{Total Bazaar Expenses}}{\text{Total House Meals}}$.
   - Automated shared utility per-head split.
   - Individual net financial balance computation with zero floating-point errors.

5. **Local Cultural Features**:
   - Dual currency formatting with Bangladeshi Taka (`৳`) and Bengali numerals (`০-৯`).
   - 1-Click WhatsApp settlement message generator (`wa.me` links).
   - Printable money receipt slips & vouchers.
   - 6-character mess join codes (e.g., `MMS-7K2X`).

---

## 📂 Directory Structure

```text
smart-mms-nextjs/
├── public/
│   └── manifest.json             # PWA web manifest
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with fonts & providers
│   │   ├── globals.css           # Dark glassmorphic Tailwind styles
│   │   ├── page.tsx              # Entry router
│   │   ├── login/page.tsx        # Mobile login with Google & demo persona switcher
│   │   ├── register/page.tsx     # Register with Join Code or Create Mess
│   │   ├── dashboard/page.tsx    # Mobile dashboard with KPIs & quick actions
│   │   ├── meals/page.tsx        # 1-31 meal calendar & manager batch sheet
│   │   ├── bazaar/page.tsx       # Expense feed with category filter chips
│   │   ├── deposits/page.tsx     # Money deposits list & receipt viewer
│   │   ├── ledger/page.tsx       # Month-end settlement & WhatsApp exporter
│   │   ├── members/page.tsx      # Mess member directory & join code
│   │   └── api/                  # 9 Next.js Route Handlers
│   ├── components/
│   │   ├── layout/               # MobileAppHeader & MobileBottomNav
│   │   ├── ui/                   # BottomDrawer, GlassCard, StepperControl, Badge
│   │   ├── dashboard/            # BalanceAlertBanner, StatCard, QuickActionFab
│   │   ├── meals/                # DailyMealRow, BulkMealSheet
│   │   ├── bazaar/               # BazaarCard, AddBazaarDrawer
│   │   ├── deposits/             # DepositCard, VoucherModal
│   │   └── ledger/               # MemberSettlementCard, WhatsAppExportButton
│   ├── context/
│   │   ├── AuthContext.tsx       # Firebase Auth & active user state
│   │   └── MessContext.tsx       # House financial state & live calculations
│   ├── lib/
│   │   ├── calculations.ts       # Accounting formulas engine
│   │   ├── mockData.ts           # Realistic Dhaka mess mock database
│   │   ├── firebase/             # Client & Admin SDK configurations
│   │   └── mongodb/              # Mongoose client & 8 schema models
│   ├── utils/
│   │   ├── formatters.ts         # Taka (৳), Bengali numerals & dates
│   │   └── whatsapp.ts           # Bengali WhatsApp settlement template
│   └── middleware.ts             # Route protection
├── .env.example
├── .env.local
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+ installed.
- MongoDB (local or MongoDB Atlas connection string).
- Firebase project credentials (optional; built-in mock demo persona switching allows instant local preview without credentials).

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your browser.

> 💡 **Tip for Mobile Viewport**: Open Chrome/Firefox DevTools (`Ctrl + Shift + M` or `Cmd + Shift + M`) and select **iPhone 14 Pro** or **Samsung Galaxy S20** to experience the native bottom navigation bar and slide-up touch drawers.

