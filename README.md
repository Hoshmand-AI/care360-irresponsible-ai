# Care360 AI — Full-Stack Next.js Application

> **A Hoshmand AI Product**

AI-powered health guidance platform with symptom analysis, OTC recommendations, pharmacy/doctor finder, and AI chat advisor.

![Care360 AI](https://via.placeholder.com/800x400/0D9488/FFFFFF?text=Care360+AI)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Neon (PostgreSQL) / Vercel Postgres |
| **ORM** | Prisma |
| **Auth** | NextAuth.js v4 |
| **AI** | OpenAI GPT-4o |
| **Places API** | Google Places API |
| **Deployment** | Vercel (recommended) |

---

## 📁 Project Structure

```
care360-nextjs/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   └── register/route.ts        # User registration
│   │   ├── chat/route.ts                # AI chat endpoint
│   │   ├── places/
│   │   │   ├── route.ts                 # Search nearby places
│   │   │   └── saved/route.ts           # Save/get saved locations
│   │   └── symptoms/route.ts            # Symptom analysis
│   ├── chat/page.tsx                    # AI Chat interface
│   ├── dashboard/page.tsx               # User dashboard
│   ├── find-care/page.tsx               # Pharmacy/doctor finder
│   ├── login/page.tsx                   # Login page
│   ├── results/page.tsx                 # Symptom results
│   ├── signup/page.tsx                  # Registration page
│   ├── symptoms/page.tsx                # Symptom checker
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Landing page
├── components/
│   ├── features/                        # Feature-specific components
│   ├── layout/
│   │   ├── navbar.tsx                   # Navigation bar
│   │   └── footer.tsx                   # Footer
│   ├── providers.tsx                    # Auth provider wrapper
│   └── ui/                              # UI components (button, card, etc.)
├── lib/
│   ├── auth.ts                          # NextAuth configuration
│   ├── openai.ts                        # OpenAI service
│   ├── places.ts                        # Google Places service
│   ├── prisma.ts                        # Prisma client
│   └── utils.ts                         # Utility functions
├── prisma/
│   └── schema.prisma                    # Database schema
├── types/
│   └── index.ts                         # TypeScript types
├── .env.local                           # Environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠 Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon account (https://neon.tech) OR Vercel with Postgres

### 2. Clone & Install

```bash
# Navigate to project
cd care360-nextjs

# Install dependencies
npm install
```

### 3. Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project named "care360"
3. Copy your connection string (looks like `postgresql://...`)
4. Update `.env.local`:

```env
DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 4. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```env
NEXTAUTH_SECRET="your-generated-secret"
```

### 5. Push Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon/Postgres connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for JWT signing | ✅ |
| `NEXTAUTH_URL` | App URL (http://localhost:3000) | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for AI features | ✅ |
| `GOOGLE_PLACES_API_KEY` | Google Places API for locations | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth (optional) | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) | ❌ |

---

## 🎨 Features

### ✅ Implemented

- [x] **Landing Page** — Hero, features, how it works, CTA
- [x] **User Authentication** — Sign up, login, logout with NextAuth
- [x] **Dashboard** — Personalized greeting, quick actions, activity history
- [x] **Symptom Checker** — Multi-step symptom input with AI analysis
- [x] **Results Page** — Urgency levels, recommendations, OTC suggestions
- [x] **Find Care** — Search pharmacies, doctors, urgent care
- [x] **AI Chat** — Interactive health advisor chat
- [x] **Responsive Design** — Mobile + desktop optimized
- [x] **Database** — User data, symptom checks, saved locations

### 🔜 Future Enhancements

- [ ] Google Maps integration for Find Care
- [ ] Email verification
- [ ] Password reset flow
- [ ] Push notifications
- [ ] Health history export
- [ ] Apple/Google OAuth
- [ ] PWA support

---

## 🚀 Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/care360-ai.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel URL)
   - `OPENAI_API_KEY`
   - `GOOGLE_PLACES_API_KEY`
4. Deploy!

### 3. Run Prisma Migration

After deployment, run:
```bash
npx prisma db push
```

---

## 📱 Pages & Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | ❌ |
| `/login` | Sign in | ❌ |
| `/signup` | Create account | ❌ |
| `/dashboard` | User dashboard | ✅ |
| `/symptoms` | Symptom checker | ❌ |
| `/results` | Analysis results | ❌ |
| `/find-care` | Find pharmacy/doctor | ❌ |
| `/chat` | AI health advisor | ❌ |

---

## 🔌 API Endpoints

### POST `/api/auth/register`
Create new user account
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

### POST `/api/symptoms`
Analyze symptoms with AI
```json
{
  "symptoms": ["headache", "fatigue"],
  "duration": "1-3 days",
  "severity": "moderate"
}
```

### POST `/api/chat`
Chat with AI advisor
```json
{
  "messages": [
    { "role": "user", "content": "What helps with headaches?" }
  ]
}
```

### GET `/api/places?type=pharmacy&lat=38.9&lng=-77.1`
Search nearby places

### POST `/api/places/saved`
Save a location
```json
{
  "placeId": "ChIJ...",
  "name": "CVS Pharmacy",
  "address": "123 Main St",
  "type": "pharmacy",
  "latitude": 38.9,
  "longitude": -77.1
}
```

---

## 🎨 Design System

Care360 uses a clinical, trustworthy design language:

- **Primary Color:** Teal `#0D9488`
- **Navy (footer):** `#0F2140`
- **Background:** Cool slate `#F8FAFC`
- **Font:** DM Sans
- **Border Radius:** 12px (cards), 8px (buttons)

See `care360-brand-system.md` for full design guide.

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt
- API routes are protected where needed
- Environment variables are server-side only
- No sensitive data in client bundles
- HTTPS enforced in production

---

## 📄 License

MIT License — A Hoshmand AI Product

---

## 🤝 Support

For questions or issues:
- Email: support@hoshmand.ai
- GitHub Issues: [Create an issue](https://github.com/hoshmand-ai/care360/issues)
