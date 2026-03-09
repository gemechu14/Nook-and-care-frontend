# Nook and Care - Senior Housing Marketplace

A Next.js and TypeScript application for finding and booking senior housing facilities.

## Features

- 🔍 Search and filter senior housing facilities
- 📋 Detailed listing pages with amenities and services
- 📅 Tour booking system
- ⭐ Reviews and ratings
- 💼 Provider dashboard (coming soon)
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── listings/       # Listing detail pages
│   ├── search/         # Search page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/         # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SearchBar.tsx
│   ├── ListingCard.tsx
│   └── FeaturedListings.tsx
└── types/              # TypeScript types
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Ready for Vercel

## Next Steps

- [ ] Connect to backend API
- [ ] Implement authentication
- [ ] Add provider dashboard
- [ ] Implement tour booking functionality
- [ ] Add reviews and ratings system
- [ ] Add payment integration

## License

Private project - All rights reserved

