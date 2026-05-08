# Bahafit - Caribbean Fitness Community Platform

Bahafit is a comprehensive fitness platform connecting Caribbean residents with fitness events, gyms, coaches, wellness centers, and community resources.

## Features

- **Multi-role Authentication System** - Support for regular users, business owners, event organizers, and administrators
- **Admin Dashboard** - Complete admin panel for managing users, events, listings, and registrations
- **Event Management** - Create and manage various fitness events (races, expos, challenges, competitions)
- **Business Listings** - Manage gyms, wellness centers, coaches, and fitness equipment/apparel
- **User Management** - Role-based access control with user profiles
- **Sanity CMS Integration** - Content management for events and listings

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **NextAuth.js v5** - Authentication with multiple providers

### Backend
- **MongoDB** - User data, registrations, and transactional data
- **Sanity.io** - Headless CMS for events and listings content
- **Next.js API Routes** - RESTful API endpoints

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- Sanity account and project

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd bahafit
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and update the following required variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/bahafit
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bahafit
MONGODB_DB=bahafit

# Sanity CMS (get these from sanity.io)
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

**Optional OAuth providers:**
```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

4. **Generate NextAuth Secret**

Generate a secure secret for NextAuth:
```bash
openssl rand -base64 32
```
Copy the output and set it as your `NEXTAUTH_SECRET` in `.env.local`.

5. **Set up MongoDB**

If using local MongoDB:
```bash
# Start MongoDB
mongod
```

If using MongoDB Atlas, create a cluster and get your connection string.

6. **Set up Sanity**

If you haven't already, initialize Sanity:
```bash
# The Sanity project is already configured
# To access Sanity Studio, run the dev server and go to /studio
```

7. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Time Setup

1. **Create an admin user**

Since there's no admin UI for creating the first admin, you'll need to create one directly in MongoDB:

```javascript
// In MongoDB shell or Compass
use bahafit

db.users.insertOne({
  name: "Admin User",
  email: "admin@bahafit.com",
  password: "$2a$10$<your-hashed-password>", // Use bcrypt to hash
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use the registration API and then manually update the role in MongoDB:

```bash
# Register via API
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@bahafit.com",
    "password": "SecurePassword123"
  }'

# Then in MongoDB, update the role:
db.users.updateOne(
  { email: "admin@bahafit.com" },
  { $set: { role: "admin" } }
)
```

2. **Access the admin dashboard**

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with your admin credentials.

3. **Configure Sanity Studio**

Go to [http://localhost:3000/studio](http://localhost:3000/studio) to access the Sanity Studio CMS.

## Project Structure

```
bahafit/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── layout.tsx       # Admin layout with sidebar
│   │   │   ├── page.tsx         # Dashboard overview
│   │   │   ├── users/           # User management
│   │   │   └── registrations/   # Registration management
│   │   ├── auth/                # Authentication pages
│   │   │   ├── signin/          # Sign in page
│   │   │   ├── signup/          # Sign up page
│   │   │   └── error/           # Auth error page
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # NextAuth & registration
│   │   │   └── admin/           # Admin API endpoints
│   │   └── studio/              # Sanity Studio
│   ├── components/              # React components
│   │   ├── admin/               # Admin components
│   │   └── providers/           # Context providers
│   ├── lib/                     # Utility functions
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── utils.ts             # Helper functions
│   │   └── db/                  # Database utilities
│   │       ├── mongodb.ts       # MongoDB connection
│   │       └── models/          # Database models
│   ├── sanity/                  # Sanity CMS config
│   │   └── schemaTypes/         # Content schemas
│   └── types/                   # TypeScript types
└── public/                      # Static files
```

## User Roles

### User (Regular)
- Browse events and listings
- Register for events
- Create reviews
- Manage own profile

### Business Owner
- All user permissions
- Create and manage listings
- View listing analytics
- Respond to reviews

### Event Organizer
- All user permissions
- Create and manage events
- View event registrations
- Check-in attendees

### Admin
- Full system access
- Approve/reject content
- Manage all users
- View analytics
- System configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### Admin - Users
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user by ID
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Payment Processing

Paid event checkouts are processed by [Fygaro](https://www.fygaro.com/) using signed payment buttons (HMAC-SHA256 / JWT) so the amount and reference cannot be tampered with by the customer.

The flow:

1. The user submits the checkout form. `POST /api/registrations` creates a `pending` registration and signs a JWT carrying the registration id, amount, and currency.
2. The user is redirected to the hosted Fygaro payment page with the signed JWT attached.
3. Fygaro processes the card and posts a signed delivery to `POST /api/webhooks/fygaro`.
4. The webhook handler verifies the `Fygaro-Signature` HMAC against the raw body and a 300-second timestamp window, then marks the registration `paid` / `confirmed`.
5. The user is returned to `/events/<slug>/checkout/confirmation`, which renders the receipt as soon as the webhook lands.

### Environment variables

These must be **server-only** — never prefixed with `NEXT_PUBLIC_`.

- `FYGARO_API_KEY` — JWT `kid` value, identifies which credential signed the token.
- `FYGARO_API_SECRET` — HMAC-SHA256 signing key.
- `FYGARO_PAYMENT_BUTTON_URL` — the public payment-button URL configured in your Fygaro dashboard.
- `FYGARO_WEBHOOK_SECRET` — optional override for verifying inbound webhooks; defaults to `FYGARO_API_SECRET`.
- `NEXT_PUBLIC_APP_URL` — the canonical site URL, used to build `return_url` and `cancel_url` parameters.

### Fygaro dashboard configuration

For each payment button you use:

1. **Advanced Settings → JWT** — enable JWT signing using the same key/secret pair you set in environment variables.
2. **Advanced Settings → Webhook** — point the webhook to `https://<your-domain>/api/webhooks/fygaro`.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your production environment, especially:
- `NEXTAUTH_SECRET` - Generate a new one for production
- `NEXTAUTH_URL` - Your production URL
- `MONGODB_URI` - Production MongoDB connection string

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

[Your License Here]

## Support

For support, email support@bahafit.com or join our Slack channel.
