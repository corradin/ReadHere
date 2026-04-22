# ReadHere 📚

A modern, map-based venue discovery application that helps users find and review places perfect for reading—quiet, comfortable, and well-lit.

## 🎯 Purpose

ReadHere solves a simple problem: finding the perfect spot to read. Whether you're looking for a cozy cafe, a quiet library corner, or a peaceful bookstore nook, ReadHere helps you discover venues based on three key factors:

- **Quietness** - How peaceful is the environment?
- **Comfort** - Are the seats comfortable for extended reading?
- **Lighting** - Is there good natural or ambient lighting?

## 🛠️ Tech Stack

### Frontend
- **[Astro](https://astro.build/)** - Modern static site generator with hybrid rendering
- **[Svelte 5](https://svelte.dev/)** - Reactive UI components with runes
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[MapLibre GL JS](https://maplibre.org/)** - Interactive maps and geolocation (free, no API key required)

### Backend & Services
- **[Supabase](https://supabase.com/)** - PostgreSQL database with PostGIS, authentication, and storage
  - PostgreSQL with PostGIS for geospatial queries
  - Row Level Security (RLS) for data protection
  - Built-in authentication system

### Testing & Tools
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/)** - Component testing utilities

### Deployment
- **[Vercel](https://vercel.com/)** - Optimized for Astro with zero-config deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com/) account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd readhere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Where to find these:**
   - **Supabase credentials**: Project Settings → API in your [Supabase dashboard](https://supabase.com/dashboard)

4. **Set up the database** (optional for development)
   
   The application expects the following Supabase tables:
   
   ```sql
   -- Venues table
   CREATE TABLE venues (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     latitude DOUBLE PRECISION NOT NULL,
     longitude DOUBLE PRECISION NOT NULL,
     description TEXT,
     category TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Reviews table
   CREATE TABLE reviews (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     quietness INTEGER NOT NULL CHECK (quietness >= 1 AND quietness <= 5),
     comfort INTEGER NOT NULL CHECK (comfort >= 1 AND comfort <= 5),
     lighting INTEGER NOT NULL CHECK (lighting >= 1 AND lighting <= 5),
     text TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Bookmarks table
   CREATE TABLE bookmarks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, venue_id)
   );

   -- Enable PostGIS for geospatial queries (optional)
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

   *Note: The starter implementation uses mock data, so database setup is optional for initial development.*

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready static site |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |

## 🧪 Testing

The project uses Vitest with happy-dom for testing:

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

Test files are located next to the source files with `.test.ts` or `.spec.ts` extensions.

**Example tests included:**
- `src/lib/utils.test.ts` - Utility function tests
- `src/components/VenueCard.test.ts` - Svelte component tests

## 📁 Project Structure

```
readhere/
├── src/
│   ├── components/          # Svelte components
│   │   ├── AuthForm.svelte
│   │   ├── Map.svelte
│   │   ├── ReviewForm.svelte
│   │   ├── VenueCard.svelte
│   │   └── *.test.ts
│   ├── layouts/             # Astro layouts
│   │   └── Layout.astro
│   ├── lib/                 # Shared utilities
│   │   ├── api.ts          # Supabase data fetching
│   │   ├── auth.ts         # Authentication helpers
│   │   ├── mapbox.ts       # MapLibre configuration
│   │   ├── supabase.ts     # Supabase client setup
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # Helper functions
│   └── pages/              # Astro pages (file-based routing)
│       ├── auth/
│       │   ├── signin.astro
│       │   └── signup.astro
│       ├── venues/
│       │   └── [id].astro  # Dynamic venue detail pages
│       └── index.astro     # Home page
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── astro.config.mjs       # Astro configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts       # Vitest configuration
└── README.md
```

## 🌐 Deployment

### Deploy to Vercel

ReadHere is optimized for deployment on Vercel:

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Connect your repository**
   - Push your code to GitHub/GitLab/Bitbucket
   - Import the project in [Vercel Dashboard](https://vercel.com/new)

3. **Configure environment variables**
   
   Add the following environment variables in Vercel project settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Build Configuration

The project uses Astro's **hybrid rendering** mode:
- Static pages are pre-rendered at build time
- Dynamic pages (marked with `export const prerender = false`) are server-rendered on-demand
- This provides optimal performance while supporting dynamic features

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous key |

## 🎨 Features

### Current Implementation (Starter)

- ✅ Interactive map with venue markers (MapLibre GL JS)
- ✅ Venue detail pages with reviews
- ✅ Review submission form with rating sliders
- ✅ Authentication UI (signin/signup)
- ✅ Responsive design
- ✅ Mock data for development
- ✅ TypeScript type safety
- ✅ Unit testing setup

### Future Enhancements

- [ ] Real-time data from Supabase
- [ ] User authentication integration
- [ ] Bookmark/favorite functionality
- [ ] Search and filter venues
- [ ] User profiles
- [ ] Photo uploads for venues
- [ ] Geolocation-based venue discovery
- [ ] Social features (follow users, share reviews)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Astro](https://astro.build/) for the amazing framework
- [Svelte](https://svelte.dev/) for reactive components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [MapLibre GL JS](https://maplibre.org/) for beautiful, free maps
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [Vercel](https://vercel.com/) for seamless deployment
</text>


---

Built with ❤️ for readers everywhere
