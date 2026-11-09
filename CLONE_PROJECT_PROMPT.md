# 🚀 Masterclass Prompt: Clone "Smart MMS (মেস ম্যানেজার)" With Next.js, MongoDB & Firebase Auth (Mobile-First)

> **Prompt Engineering Architecture**: Designed using the **SPARK / R-T-C-F Framework** (Role, Task, Context, Constraints, Few-shot/Specs, Step-by-Step Phased Execution).
> **Target Stack**: **Next.js (App Router)**, **MongoDB** (Atlas/Native or Mongoose), **Firebase Authentication**, **Tailwind CSS**, and **Mobile-First PWA** architecture.
> **Target Models**: Claude 3.7 / 3.5 Sonnet, Gemini 2.5 / 2.0 Pro, GPT-4o, Cursor Agent, Windsurf Cascade, or Google Antigravity.
> **Expected Output**: A 100% production-ready, working clone of the **Smart MMS (মেস ম্যানেজার)** Bachelor Mess & Hostel Management System with mobile-first responsive UX, Firebase Auth, MongoDB database, real accounting math, dual-language UI (Bengali & English), and zero placeholder code.

---

## 📋 How to Use This Prompt
1. Copy the entire prompt section below (from `### 🌟 [START OF PROMPT]` to `### 🏁 [END OF PROMPT]`).
2. Paste it into your AI coding assistant (Cursor Composer, Windsurf Cascade, Claude Code, Antigravity, or ChatGPT).
3. If using an interactive agent mode, let the agent execute phase-by-phase so that all Next.js components, API routes, Firebase configs, and MongoDB models are created with full production code.

---

### 🌟 [START OF PROMPT]

```markdown
You are a World-Class Principal Full-Stack Software Architect and Senior Mobile-First UI/UX Designer specializing in production-grade financial web apps, modern Next.js (App Router) architectures, MongoDB data modeling, and Firebase Authentication.

Your task is to build a complete, 1:1 production-ready clone of **"Smart MMS (মেস ম্যানেজার)"** — a bachelor mess and student/working hostel meal and shared expense tracker tailored specifically for the Bangladeshi bachelor mess ecosystem, built with **Next.js**, **MongoDB**, **Firebase Auth**, and designed **Mobile-First**.

The clone MUST NOT be a toy example or mock wireframe. It must be a fully functional, production-ready system with real accounting math, robust session management, mobile-first touch UI (bottom navigation, sheet drawers, thumb-zone controls), Bengali & English localization, and zero placeholder code.

---

### 1. 🏗️ SYSTEM ARCHITECTURE & KEY SPECIFICATIONS

1. **Tech Stack**:
   - **Framework**: **Next.js (App Router)** with React 19/18, TypeScript / Modern ES6+.
   - **Database**: **MongoDB** (MongoDB Atlas / local) via Mongoose or official MongoDB Node Driver with singleton connection pooling for serverless execution.
   - **Authentication**: **Firebase Authentication** (Email/Password, Phone OTP support, Google Sign-in) on client-side, verified on the server via **Firebase Admin SDK** or session tokens in Next.js Middleware and Route Handlers.
   - **Styling & UI**: **Tailwind CSS** with a dark glassmorphic design system (`#0f172a` slate background, backdrop-blur card overlays, amber-500 & emerald-500 financial accents, Lucide-react icons, and Google Fonts `Hind Siliguri` for Bengali and `Inter` for numbers/English).
   - **Mobile PWA Ready**: Mobile viewport optimizations, web app manifest (`manifest.json`), theme-color meta tags, standalone display mode, and safe-area padding for notch/home indicators.

2. **Mobile-First UX & Interaction Design (Primary Target: 360px - 430px Viewport)**:
   - **Bottom Navigation Bar**: Fixed thumb-friendly bottom nav for primary flows: Dashboard, Meals, Bazaar, Deposits, and More/Menu.
   - **Top App Bar**: Compact mobile header showing House name selector, current month picker, network/sync badge, and user avatar.
   - **Bottom Sheet Drawers (Mobile Modals)**: Use sliding bottom sheets instead of oversized desktop modals for mobile entries (e.g., Quick Meal entry, Add Bazaar, Add Deposit).
   - **Thumb-Friendly Touch Targets**: Minimum 48px × 48px touch targets, large steppers (+ / -) for Breakfast, Lunch, and Dinner.
   - **Haptic/Micro-Interactions**: Instant optimistic UI updates for meal counters and expense logging.
   - **Responsive Scaling**: Mobile viewport is the primary layout; seamlessly stretches and displays multi-column grids on tablets/desktops (`md:` and `lg:` breakpoints).

3. **3-Tier Role-Based Access Control (RBAC)**:
   - 👑 **Super Admin**: System-wide oversight. Can create new messes/houses, view global statistics, reassign managers, and view system logs.
   - 🛡️ **Mess Admin / Manager**: Scoped strictly to their `houseId`. Manages daily meal sheets, bazaar expenses, member deposits, shared utility bills, individual bill adjustments, and member permissions.
   - 👤 **Mess Member (Regular User)**: Scoped access to personal dashboard, personal meal entries, active meal rate, personal balance (পাবে/বকেয়া), money receipts, and month-end settlement slip.

4. **Core Accounting & Mathematical Formulas**:
   - $\text{Total House Meals} = \sum (\text{Breakfast} + \text{Lunch} + \text{Dinner})$
   - $\text{Live Meal Rate (মিল রেট)} = \frac{\text{Total Bazaar Expenses (চলতি বাজার খরচ)}}{\text{Total House Meals (মোট মিল সংখ্যা)}}$
   - $\text{Individual Meal Cost} = \text{Member Total Meals} \times \text{Meal Rate}$
   - $\text{Shared Utility Cost Per Member} = \frac{\text{Electricity} + \text{Gas/Water} + \text{Cook Bill (খালা বিল)} + \text{Wifi} + \text{Waste/Other}}{\text{Active Member Count}}$
   - $\text{Individual Total Cost} = \text{Individual Meal Cost} + \text{Shared Utility Cost} + \text{Custom Room/Seat Rent} + \text{Individual Bill Adjustments}$
   - $\text{Net Member Balance} = (\text{Approved Deposits} + \text{Direct Member Bazaar Out-of-Pocket}) - \text{Individual Total Cost}$
     - If $\ge 0 \rightarrow$ **"পাবে" (Refund / Advance credit)**
     - If $< 0 \rightarrow$ **"বকেয়া" (Due to Mess)**

5. **Special Cultural & Operational Features**:
   - **Dual Currency / Number Formatting**: Bangladeshi Taka symbol (`৳`), Bengali numerals (`০-৯`) and English numerals (`0-9`).
   - **WhatsApp 1-Click Settlement Generator**: Generates formatted Bengali text summaries to share directly via WhatsApp with one tap (`https://wa.me/?text=...`).
   - **Mobile Printable Voucher / Slip**: Generates print/PDF vouchers formatted for mobile sharing and thermal slip printers.
   - **Mess Join Code**: Auto-generated 6-character code (e.g. `MMS-7K2X`) allowing members to join a house during onboarding.

---

### 2. 🗄️ DATABASE SCHEMAS (MongoDB with Mongoose / BSON)

Design production-grade MongoDB schemas with proper indexing, validation, and references:

1. **`houses` Collection**:
   ```typescript
   {
     _id: ObjectId,
     houseId: String,          // Unique slug/code e.g. "HOUSE_01"
     name: String,             // e.g. "ধানমন্ডি ব্যাচেলর পয়েন্ট"
     address: String,
     managerFirebaseUid: String, // Firebase Auth UID of manager
     joinCode: { type: String, unique: true, uppercase: true }, // e.g. "MMS-7K2X"
     status: { type: String, enum: ['active', 'archived'], default: 'active' },
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **`users` Collection**:
   ```typescript
   {
     _id: ObjectId,
     firebaseUid: { type: String, unique: true, index: true }, // From Firebase Auth
     email: { type: String, required: true },
     phone: String,
     fullName: String,
     houseId: { type: String, index: true }, // FK to House
     roomNo: String,
     role: { type: String, enum: ['super_admin', 'manager', 'member'], default: 'member' },
     status: { type: String, enum: ['active', 'inactive'], default: 'active' },
     pin: String,               // 4-digit security PIN for quick confirmations
     customRent: { type: Number, default: 0 }, // Individual room/seat rent
     createdAt: Date,
     updatedAt: Date
   }
   ```

3. **`meals` Collection**:
   ```typescript
   {
     _id: ObjectId,
     houseId: { type: String, required: true, index: true },
     date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
     firebaseUid: { type: String, required: true, index: true },
     breakfast: { type: Number, default: 0 }, // 0, 0.5, 1
     lunch: { type: Number, default: 0 },     // 0, 1, 2...
     dinner: { type: Number, default: 0 },    // 0, 1, 2...
     totalMeals: { type: Number, default: 0 }, // Computed: B + L + D
     updatedAt: Date
   }
   // Compound index: { houseId: 1, date: 1, firebaseUid: 1 } (unique)
   ```

4. **`bazaars` Collection**:
   ```typescript
   {
     _id: ObjectId,
     houseId: { type: String, required: true, index: true },
     date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
     month: { type: String, required: true, index: true }, // "YYYY-MM"
     itemDetails: { type: String, required: true },       // "চাল, ডাল, মুরগি, আলু"
     category: { 
       type: String, 
       enum: ['Grocery/মুদি', 'Meat-Fish/মাছ-মাংস', 'Vegetables/সবজি', 'Spices/তেল-মসলা', 'Snacks/অন্যান্য'],
       default: 'Grocery/মুদি' 
     },
     cost: { type: Number, required: true },
     paidByUid: { type: String, required: true }, // Firebase UID or "MESS_FUND"
     voucherImageUrl: String,                    // Optional Firebase storage receipt image
     createdAt: Date
   }
   ```

5. **`deposits` Collection**:
   ```typescript
   {
     _id: ObjectId,
     houseId: { type: String, required: true, index: true },
     date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
     month: { type: String, required: true, index: true }, // "YYYY-MM"
     firebaseUid: { type: String, required: true, index: true },
     amount: { type: Number, required: true },
     receivedByUid: String,
     paymentMethod: { type: String, enum: ['bKash', 'Nagad', 'Rocket', 'Bank', 'Cash'], default: 'bKash' },
     trxId: String,
     notes: String,
     status: { type: String, enum: ['pending', 'approved'], default: 'approved' },
     createdAt: Date
   }
   ```

6. **`fixed_costs` Collection**:
   ```typescript
   {
     _id: ObjectId,
     houseId: { type: String, required: true, index: true },
     month: { type: String, required: true, index: true }, // "YYYY-MM"
     rent: { type: Number, default: 0 },
     electricity: { type: Number, default: 0 },
     gasWater: { type: Number, default: 0 },
     cookBill: { type: Number, default: 0 },
     wifi: { type: Number, default: 0 },
     other: { type: Number, default: 0 },
     updatedAt: Date
   }
   // Compound index: { houseId: 1, month: 1 } (unique)
   ```

7. **`individual_bills` Collection**:
   ```typescript
   {
     _id: ObjectId,
     houseId: { type: String, required: true, index: true },
     month: { type: String, required: true, index: true }, // "YYYY-MM"
     firebaseUid: { type: String, required: true, index: true },
     seatFare: { type: Number, default: 0 },
     prevDue: { type: Number, default: 0 },
     charges: { type: Number, default: 0 }, // Guest meal or equipment charge
     khala: { type: Number, default: 0 },
     others: { type: Number, default: 0 },
     grandTotal: { type: Number, default: 0 },
     updatedAt: Date
   }
   ```

8. **`permissions` Collection**:
   ```typescript
   {
     _id: ObjectId,
     houseId: { type: String, required: true },
     firebaseUid: { type: String, required: true, index: true },
     canEntryMeal: { type: Boolean, default: true },
     canEntryBazaar: { type: Boolean, default: false },
     canManagePeoples: { type: Boolean, default: false }
   }
   ```

---

### 3. 📂 EXACT PROJECT DIRECTORY STRUCTURE TO CREATE

```text
smart-mms-nextjs/
├── public/
│   ├── manifest.json              # PWA manifest (standalone display, theme-color, icons)
│   ├── icons/                     # 192x192 & 512x512 app icons
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout, Hind Siliguri + Inter fonts, AuthProvider
│   │   ├── page.tsx               # Entry redirect (to /dashboard or /login)
│   │   ├── login/
│   │   │   └── page.tsx           # Mobile-first login (Email/Password, Phone OTP, Google)
│   │   ├── register/
│   │   │   └── page.tsx           # Member registration with Join Code or Create House
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Mobile summary cards, meal rate, due/refund banner
│   │   ├── meals/
│   │   │   └── page.tsx           # Mobile 1-31 meal calendar & batch daily entry sheet
│   │   ├── bazaar/
│   │   │   └── page.tsx           # Expense feed with category chips, mobile add drawer
│   │   ├── deposits/
│   │   │   └── page.tsx           # Money deposits list, bKash badges, receipt viewer
│   │   ├── fixed-costs/
│   │   │   └── page.tsx           # Utility bills manager & live per-head split calculator
│   │   ├── ledger/
│   │   │   └── page.tsx           # Master month-end balance sheet, WhatsApp exporter
│   │   ├── members/
│   │   │   └── page.tsx           # Mess member roster, room list, permissions drawer
│   │   ├── super-admin/
│   │   │   └── page.tsx           # Multi-house overview, manager reassignment
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── sync-user/route.ts   # Sync Firebase user to MongoDB user doc
│   │       │   └── verify-token/route.ts # Verify Firebase ID token
│   │       ├── houses/route.ts          # Create & fetch house details, validate join code
│   │       ├── meals/route.ts           # CRUD for daily and bulk meal records
│   │       ├── bazaars/route.ts         # CRUD for bazaar entries
│   │       ├── deposits/route.ts        # CRUD for member deposits
│   │       ├── fixed-costs/route.ts     # Save & fetch monthly utility costs
│   │       ├── individual-bills/route.ts # Adjust individual seat rents/dues
│   │       ├── ledger/route.ts          # Calculate & fetch full month financial matrix
│   │       └── members/route.ts         # Member permissions & status update
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MobileAppHeader.tsx      # Top mobile app bar with House & Month picker
│   │   │   ├── MobileBottomNav.tsx      # Sticky bottom thumb navigation with icons
│   │   │   └── DesktopSidebar.tsx       # Responsive sidebar for desktop/tablet viewports
│   │   ├── ui/
│   │   │   ├── BottomDrawer.tsx         # Mobile slide-up drawer for fast entries
│   │   │   ├── GlassCard.tsx            # Styled glassmorphic container card
│   │   │   ├── StepperControl.tsx       # Touch-friendly increment/decrement for meals
│   │   │   ├── Badge.tsx                # Status & payment method badges
│   │   │   └── Toast.tsx                # Mobile-friendly toast notifications
│   │   ├── dashboard/
│   │   │   ├── BalanceAlertBanner.tsx   # Prominent "পাবে / বকেয়া" mobile alert
│   │   │   ├── QuickActionFab.tsx       # Floating Action Button for 1-tap quick actions
│   │   │   └── StatCard.tsx             # Touch-friendly KPI card
│   │   ├── meals/
│   │   │   ├── DailyMealRow.tsx         # Mobile date row with B/L/D stepper buttons
│   │   │   └── BulkMealSheet.tsx        # Manager mass entry drawer for all house members
│   │   ├── bazaar/
│   │   │   ├── BazaarCard.tsx           # Compact card showing item, payer, price & category
│   │   │   └── AddBazaarDrawer.tsx      # Fast mobile form for logging grocery expenses
│   │   ├── deposits/
│   │   │   ├── DepositCard.tsx          # Card with bKash/Nagad badge & receipt preview
│   │   │   └── VoucherModal.tsx         # Printable thermal/slip receipt
│   │   └── ledger/
│   │       ├── MemberSettlementCard.tsx # Mobile expandable card with meal & bill breakdown
│   │       └── WhatsAppExportButton.tsx # 1-tap WhatsApp message generator
│   ├── context/
│   │   ├── AuthContext.tsx              # Firebase auth listener & active MongoDB user state
│   │   └── MessContext.tsx              # Active House, selected Month, & live financial state
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── client.ts                # Client Firebase App, Auth, Analytics initialization
│   │   │   └── admin.ts                 # Firebase Admin SDK for server-side token verification
│   │   ├── mongodb/
│   │   │   ├── client.ts                # Cached MongoDB connection pool for serverless Next.js
│   │   │   └── models/                  # Mongoose models for all 8 collections
│   │   │       ├── House.ts
│   │   │       ├── User.ts
│   │   │       ├── Meal.ts
│   │   │       ├── Bazaar.ts
│   │   │       ├── Deposit.ts
│   │   │       ├── FixedCost.ts
│   │   │       ├── IndividualBill.ts
│   │   │       └── Permission.ts
│   │   └── calculations.ts              # Mathematical engine for meal rates, splits & dues
│   ├── utils/
│   │   ├── formatters.ts                # ৳ Currency formatting, Bengali numerals, YYYY-MM
│   │   └── whatsapp.ts                  # Bengali WhatsApp settlement template generator
│   └── middleware.ts                    # Next.js route protection & auth token validation
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

### 4. 🚀 STEP-BY-STEP IMPLEMENTATION ROADMAP

Execute the creation of this project across 5 distinct phases. Implement every file completely with zero placeholders or truncated comments.

#### PHASE 1: Next.js Foundation, Firebase Config & MongoDB Singleton
1. **`package.json`**:
   - Next.js (`^14.2` or `^15.x`), React, React-DOM.
   - `firebase` (Client SDK), `firebase-admin` (Server verification).
   - `mongodb` and `mongoose` (ORM/ODM).
   - `lucide-react` (mobile icons), `clsx`, `tailwind-merge`.
2. **`src/lib/firebase/client.ts` & `admin.ts`**:
   - Safe client initialization using `process.env.NEXT_PUBLIC_FIREBASE_*`.
   - Firebase Admin initialization using `FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PROJECT_ID` with singleton caching.
3. **`src/lib/mongodb/client.ts`**:
   - Implement cached connection `global.mongoose` to prevent multiple connection pools during Next.js Hot Module Replacement (HMR) and serverless function cold starts.
4. **`src/context/AuthContext.tsx`**:
   - `onAuthStateChanged` listener syncing Firebase user to MongoDB `/api/auth/sync-user`.
   - Expose `user`, `mongoUser`, `role`, `loading`, `login`, `logout`, `loginWithGoogle`.
5. **`src/context/MessContext.tsx`**:
   - Store and distribute: `currentHouse`, `selectedMonth` (defaults to current `YYYY-MM`), `refreshTrigger`, `liveStats`.

#### PHASE 2: MongoDB Mongoose Models & API Handlers
1. **Mongoose Models (`src/lib/mongodb/models/`)**:
   - Create fully typed schemas for `House`, `User`, `Meal`, `Bazaar`, `Deposit`, `FixedCost`, `IndividualBill`, and `Permission`.
   - Setup unique compound indexes (e.g. `{ houseId: 1, date: 1, firebaseUid: 1 }` for `Meal`).
2. **API Route Handlers (`src/app/api/`)**:
   - **`/api/auth/sync-user`**: Upsert user profile when logged in via Firebase; populate default permissions.
   - **`/api/meals`**:
     - `GET`: Fetch meals for house & month.
     - `POST`: Save or update a single member's breakfast, lunch, dinner for a date.
     - `PUT`: Bulk update meals for all house members on a specific date.
   - **`/api/bazaars`**: `GET`, `POST`, `DELETE` for grocery expenses.
   - **`/api/deposits`**: `GET`, `POST`, `DELETE` with payment method and Trx ID.
   - **`/api/fixed-costs`**: Fetch or upsert house monthly utilities.
   - **`/api/ledger`**: Aggregate all meals, bazaars, fixed costs, and deposits for the active month and compute:
     - Total meals, active meal rate.
     - Shared utility per head.
     - Individual balances (Refund/Due).

#### PHASE 3: Mathematical Engine & Mobile-First Utilities
1. **`src/lib/calculations.ts`**:
   - `calculateMealRate(totalBazaar: number, totalMeals: number): number`
   - `calculateSharedUtilityPerHead(fixedCosts: IFixedCost, activeMemberCount: number): number`
   - `calculateMemberBalance(...)`: Exact net calculation returning `netBalance`, `status: 'পাবে' | 'বকেয়া'`.
   - `calculateHouseSummary(...)`: Complete house accounting totals.
2. **`src/utils/formatters.ts`**:
   - `formatTaka(amount: number, useBengaliDigits = false): string` (outputs e.g., `৳ ১,২৫০` or `৳ 1,250.00`).
   - `toBengaliNumeral(num: number | string): string` (maps `0-9` to `০-৯`).
   - `formatDateBengali(dateStr: string): string`.
3. **`src/utils/whatsapp.ts`**:
   - Creates clean, formatted Bengali WhatsApp messages with emojis, breakdown of meals, meal rate, utility share, deposits, and final payable/due with 1-click WhatsApp web/app link.

#### PHASE 4: Mobile-First Core Components
1. **`src/components/layout/MobileAppHeader.tsx`**:
   - Sticky top bar with mess title, current month dropdown, and member avatar/role badge.
2. **`src/components/layout/MobileBottomNav.tsx`**:
   - Fixed bottom bar on mobile viewports with 5 primary touch buttons:
     - 📊 ড্যাশবোর্ড (Dashboard)
     - 🍽️ মিল (Meals)
     - 🛒 বাজার (Bazaar)
     - 💰 জমা (Deposits)
     - 📑 লেজার (Ledger / More)
   - Active state indicator, high-contrast touch styling.
3. **`src/components/ui/BottomDrawer.tsx`**:
   - Accessible slide-up drawer for mobile screens (touch-swipe dismiss, backdrop blur).
4. **`src/components/ui/StepperControl.tsx`**:
   - Large `+` and `-` buttons (at least 48px target) for setting Breakfast (0/0.5/1), Lunch (0/1/2..), Dinner (0/1/2..).
5. **`src/components/dashboard/BalanceAlertBanner.tsx`**:
   - High-impact mobile banner: Emerald green for "আপনার পাওনা (Refund)" or Crimson red for "আপনার বকেয়া (Due)".
6. **`src/components/dashboard/QuickActionFab.tsx`**:
   - Thumb-friendly Floating Action Button (FAB) at bottom-right opening a quick sheet: "আজকের মিল দিন", "বাজার খরচ লিখুন", "টাকা জমা দিন".
7. **`src/components/meals/DailyMealRow.tsx`**:
   - Expandable mobile cards or scrollable date matrix with quick stepper inputs.
8. **`src/components/deposits/VoucherModal.tsx`**:
   - Formatted thermal slip or money receipt with mess stamp for digital sharing.

#### PHASE 5: App Router Pages, Auth Flow & PWA Setup
1. **`src/app/login/page.tsx` & `src/app/register/page.tsx`**:
   - Mobile-first card layout.
   - Firebase Email/Password login, Google One-Tap/Popup, Phone auth.
   - Registration includes option to "Join existing mess with Code (e.g. MMS-XXXX)" or "Create new Mess".
2. **`src/app/dashboard/page.tsx`**:
   - Mobile KPIs: Current Meal Rate (`৳ ৪৫.৫০`), Total Bazaar, Total Meals, Personal Balance.
   - Recent 5 bazaar entries and recent deposits list.
3. **`src/app/meals/page.tsx`**:
   - Date picker, personal meal viewer for members, manager bulk-entry modal for entering house-wide daily meals with 1 click.
4. **`src/app/bazaar/page.tsx`**:
   - Expense feed with category filter chips (সব, মাছ-মাংস, মুদি, সবজি).
   - Floating "+ খরচ যোগ" button opening bottom drawer.
5. **`src/app/deposits/page.tsx`**:
   - Deposits log with payment method badges (bKash pink, Nagad orange, Rocket purple, Cash green).
   - "রসিদ দেখুন" (View Receipt) button per deposit.
6. **`src/app/ledger/page.tsx`**:
   - Responsive summary: Compact card-based settlement cards for mobile; full table for tablet/desktop.
   - 1-click WhatsApp share button per member.
7. **`public/manifest.json`**:
   - PWA configuration: `name: "Smart MMS - মেস ম্যানেজার"`, `short_name: "Smart MMS"`, `display: "standalone"`, `theme_color: "#0f172a"`, `background_color: "#0f172a"`.
8. **`src/middleware.ts`**:
   - Protect dashboard, meals, bazaar, and ledger routes against unauthenticated requests.

---

### 5. 🎯 ACCEPTANCE CRITERIA & VERIFICATION
When you finish creating all files:
1. Running `npm run dev` launches the Next.js application at `http://localhost:3000` with zero compile or syntax errors.
2. Firebase Authentication properly handles Sign In, Registration with Mess Join Code (`MMS-XXXX`), and Google Auth.
3. All data (Houses, Users, Meals, Bazaars, Deposits, Fixed Costs, Bills) seamlessly persists in MongoDB Atlas / local MongoDB with connection pooling.
4. Mobile viewport testing (360px - 430px wide, e.g., iPhone 14/15 or Samsung Galaxy) displays the sticky bottom navigation, touch-friendly meal steppers, and slide-up drawers perfectly without horizontal scroll bugs.
5. Live Meal Rate and Net Member Balances (পাবে/বকেয়া) update immediately when meals or bazaar expenses are added.
6. 1-Click WhatsApp settlement text generator builds accurate Bengali summaries ready to send.
7. All code must be completely written out with zero `// TODO: implement this later` comments.
```

### 🏁 [END OF PROMPT]

---

## 💡 Expert Prompt Engineering Tips for Best Results

1. **For Cursor / Windsurf / Antigravity Agents**:
   - Feed the prompt directly into the agent. Because agents have write tool access, instruct the agent:
     > *"Follow Phase 1 to Phase 5 in order. Create and write every Next.js, Firebase, and MongoDB file completely. Do not skip any file."*
2. **For Claude 3.7 / ChatGPT 4o (Chat Interface)**:
   - If generating through a standard chat window, execute phase by phase:
     > *"Let's start with Phase 1: Next.js setup, package.json, Tailwind, Firebase client & admin configs, MongoDB client, and AuthContext. Write each file in full."*
3. **Environment Variables Configuration (`.env.local`)**:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_mms?retryWrites=true&w=majority

   # Firebase Client Config (Public)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin Config (Server-side)
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
4. **Mobile-First Development Tip**:
   - In Chrome/Firefox DevTools, switch to Mobile Device View (`Ctrl+Shift+M` or `Cmd+Shift+M`) on iPhone 14 Pro or Pixel 7 to verify bottom navigation bar and drawer interactions.
