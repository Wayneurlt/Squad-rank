# SquadRank - Squad Leaderboard

A modern, visually striking Nuxt 3 application for tracking and ranking squad members across various categories. Features beautiful public leaderboards with engaging animations and a secure admin panel for managing data.

## Features

- 🏆 **Beautiful Leaderboards** - Modern, responsive leaderboards with smooth animations and glassmorphism effects
- ⭐ **Category Rankings** - Track performance across multiple categories with weighted scoring systems
- 🔐 **Admin Panel** - Secure admin interface for managing profiles, categories, and scores
- 🎨 **Modern Design** - Glassmorphism effects, gradient backgrounds, and smooth animations
- 📱 **Responsive** - Mobile-first design with elegant desktop adaptation
- 🎭 **Animations** - GSAP and AOS animations throughout the user experience

## Tech Stack

- **Framework**: Nuxt 3 + Vue 3 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Iconify (@iconify/vue)
- **Animations**: AOS (Animate On Scroll) + GSAP
- **Database**: Neon Postgres via Prisma ORM
- **UI Components**: Nuxt UI

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@neon-hostname:port/dbname?sslmode=require"

# Admin Authentication
ADMIN_SECRET="your-super-secure-random-secret-here"

# Site Configuration
SITE_NAME="SquadRank"

# Environment
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with demo data
npm run prisma:seed
```

### 4. Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Database Schema

The application uses three main models:

- **Profile**: Squad member information (name, nickname, photo, bio)
- **Category**: Ranking categories (name, slug, description, weight)
- **Score**: Individual scores linking profiles to categories (1-5 scale)

## API Endpoints

### Public Endpoints
- `GET /api/leaderboard` - Returns overall and category rankings
- `GET /api/profiles` - List all profiles with basic info
- `GET /api/categories` - List all active categories

### Admin Endpoints (require authentication)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/session` - Session validation
- `POST /api/admin/profile` - Create/update profiles
- `POST /api/admin/category` - Create/update categories
- `POST /api/admin/score` - Set scores for profile-category pairs
- `POST /api/admin/seed` - Development seed endpoint

## Admin Access

1. Navigate to `/admin/login`
2. Enter your admin secret (set in `ADMIN_SECRET` environment variable)
3. Access the admin dashboard to manage data

## Pages

- `/` - Landing page with features and stats
- `/leaderboard` - Main leaderboard with filtering and animations
- `/admin/login` - Admin authentication
- `/admin` - Admin dashboard overview
- `/admin/profiles` - Profile management
- `/admin/categories` - Category management
- `/admin/scores` - Score management grid

## Customization

### Adding New Categories

1. Go to Admin Panel → Categories
2. Click "Add Category"
3. Set name, slug, description, and weight
4. Save to automatically create scores for all profiles

### Managing Scores

1. Go to Admin Panel → Scores
2. Use the 5-star rating system to update scores
3. Click "Save All Changes" to persist updates

### Styling

The app uses Tailwind CSS with custom components:
- `.glass-card` - Glassmorphism card effect
- `.gradient-bg` - Primary gradient background
- `.gradient-text` - Gradient text effect
- `.floating` - Floating animation for top rankings

## Production Deployment

1. Set up your Neon Postgres database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

## License

MIT License - see LICENSE file for details.