# 📱 Smart MMS (মেস ম্যানেজার) — Next.js, MongoDB & Firebase Auth (Mobile-First)

Smart MMS (মেস ম্যানেজার) is a specialized bachelor mess and student/working hostel meal and shared expense management system designed specifically for the Bangladeshi bachelor mess ecosystem. Built with **Next.js (App Router)**, **MongoDB Atlas**, **Firebase Auth**, and a **Mobile-First PWA** design system.

---

## 🌟 Key Features

1. **Mobile-First UX (360px - 430px Optimized)**:
   - Sticky bottom navigation bar with 5 primary touch destinations.
   - Slide-up bottom drawers (`BottomDrawer.tsx`, `MonthPickerDrawer.tsx`) replacing cumbersome modals.
   - Micro-stepper buttons with 1-tap `[১-১-১]` (full meal) and `[বন্ধ]` (off) quick presets.
   - Color-coded daily meal slots: 🌅 সকাল (Morning), ☀️ দুপুর (Lunch), 🌙 রাত (Dinner).
   - High-contrast financial balance alert banner ("আপনার পাওনা" / "আপনার বকেয়া").

2. **সদস্যভিত্তিক মিল হিসাব ও সারাংশ (Person-Wise Meal Calendar & Summary)**:
   - Horizontal member selector scrollbar allowing 1-tap switching between any member's 1-31 day daily meal calendar.
   - **All Members Summary Matrix**: Compare morning, lunch, dinner, and total meals across all mess roommates in one unified screen.
   - Role-aware permissions: House manager & duty meal manager can edit anyone's meals; members have safe read-only view of roommates with full edit access for themselves.

3. **৫-৬ দিনের মিল ম্যানেজার রোটেশন (5-6 Day Rotating Duty Manager)**:
   - Automated 5-6 day shift rotation schedule ensuring every roommate serves as meal manager equally.
   - Live duty badge on top header showing current on-duty manager and days remaining.
   - Instant duty handover and roster generator drawer.

4. **মেসে যুক্ত হওয়ার সহজ উপায় (Join Any Mess with Code / ID)**:
   - Join any mess using a 6-character code (e.g. `MMS-7K2X`) or unique House ID (e.g. `HOUSE_DHAKA_01`).
   - Clean profile menu with zero demo personas for real authenticated users.

5. **MongoDB Database Architecture**:
   - 8 collections: `houses`, `users`, `meals`, `bazaars`, `deposits`, `fixed_costs`, `individual_bills`, and `permissions`.
   - Compound indexes for millisecond query performance.
   - Singleton connection pooling (`src/lib/mongodb/client.ts`) optimized for Next.js serverless route handlers.

6. **Firebase Authentication & RBAC**:
   - Email & Password, Phone OTP, and Google Sign-in.
   - Verified server-side via Firebase Admin SDK.
   - Automatic sync with MongoDB `users` collection.
   - 3-tier Role-Based Access Control (`super_admin`, `manager`, `member`).

7. **Accurate Accounting Math Engine**:
   - Real-time live meal rate: $\frac{\text{Total Bazaar Expenses}}{\text{Total House Meals}}$.
   - Automated shared utility per-head split.
   - Individual net financial balance computation with zero floating-point errors.
   - Direct bazaar out-of-pocket expenses credited back to the buyer automatically.

8. **Local Cultural Features**:
   - Dual currency formatting with Bangladeshi Taka (`৳`) and Bengali numerals (`০-৯`).
   - 1-Click WhatsApp settlement message generator (`wa.me` links).
   - Printable money receipt slips & vouchers.
   - 6-character mess join codes (e.g., `MMS-7K2X`).

---

## 📂 Directory Structure

```text
smart-mms-nextjs/
├── public/
│   ├── manifest.json             # PWA web manifest
│   └── icons/logo.svg            # Standalone vector brand emblem
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with fonts, PWA metadata & providers
│   │   ├── globals.css           # Dark glassmorphic Tailwind styles
│   │   ├── page.tsx              # Entry router
│   │   ├── login/page.tsx        # Mobile login with Google & email
│   │   ├── register/page.tsx     # Register with Join Code or Create Mess
│   │   ├── dashboard/page.tsx    # Mobile dashboard with KPIs & quick actions
│   │   ├── meals/page.tsx        # 1-31 meal calendar, person-wise switcher & summary
│   │   ├── bazaar/page.tsx       # Expense feed with category filter chips
│   │   ├── deposits/page.tsx     # Money deposits list & receipt viewer
│   │   ├── fixed-costs/page.tsx  # Shared utilities & per-head calculator
│   │   ├── individual-bills/page.tsx # Seat rents & guest meal adjustments
│   │   ├── ledger/page.tsx       # Month-end settlement & WhatsApp exporter
│   │   ├── members/page.tsx      # Mess member directory & join code
│   │   └── api/                  # 9 Next.js Route Handlers
│   ├── components/
│   │   ├── layout/               # MobileAppHeader & MobileBottomNav
│   │   ├── ui/                   # MonthPickerDrawer, BottomDrawer, GlassCard, StepperControl
│   │   ├── dashboard/            # BalanceAlertBanner, StatCard, QuickActionFab
│   │   ├── meals/                # DailyMealRow, BulkMealSheet, MealManagerRosterDrawer
│   │   ├── bazaar/               # BazaarCard, AddBazaarDrawer
│   │   ├── deposits/             # DepositCard, VoucherModal
│   │   └── ledger/               # MemberSettlementCard, WhatsAppExportButton
│   ├── context/
│   │   ├── AuthContext.tsx       # Firebase Auth & active user state
│   │   └── MessContext.tsx       # House financial state & live calculations
│   ├── lib/
│   │   ├── calculations.ts       # Accounting formulas engine
│   │   ├── firebase/             # Client & Admin SDK configurations
│   │   └── mongodb/              # Mongoose client & schema models
│   ├── scripts/
│   │   └── full-system-test.mjs  # 26 automated unit & integration tests
│   └── utils/
│       ├── formatters.ts         # Taka (৳), Bengali numerals & Bengali months
│       └── whatsapp.ts           # Bengali WhatsApp settlement template
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
- Firebase project credentials.

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser (or open in Mobile DevTools mode at 390px width).

### 4. Run Automated Test Suite
```bash
node src/scripts/full-system-test.mjs
```
Runs 26 automated unit and business logic tests covering meal rates, shared utilities, negative balance dues, rotating meal manager rosters, and Mongoose schema definitions.

---

## 📄 License
MIT License. Built with ❤️ for Bangladeshi bachelor mess communities.
