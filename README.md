# AiVault

A curated directory for discovering, comparing, and sharing the best AI tools across every category.

## Features

- **Discover AI Tools** - Browse 40+ curated AI tools across categories like Writing, Image, Video, Coding, Productivity, Audio, and Design
- **Bookmark Tools** - Save your favorite tools to your personal dashboard
- **Submit Tools** - Share new AI tools with the community (admin approval required)
- **Dark/Light Mode** - Beautiful theme toggle with system preference support
- **Responsive Design** - Fully responsive UI that works on all devices
- **User Authentication** - Secure sign-in/sign-up with Clerk
- **Real-time Updates** - Live data with Convex backend

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Convex (serverless database & functions)
- **Auth:** Clerk (authentication & user management)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/seyarhasir/AiVault2.git
   cd AiVault2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your keys:
   
   ```bash
   cp .env.example .env.local
   ```
   
   Required environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from Clerk Dashboard
   - `CLERK_SECRET_KEY` - Get from Clerk Dashboard
   - `NEXT_PUBLIC_CONVEX_URL` - Get from Convex Dashboard
   - `CONVEX_DEPLOY_KEY` - Get from Convex Dashboard

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
aivault/
├── app/                    # Next.js app router
│   ├── admin/              # Admin dashboard (tool approvals)
│   ├── dashboard/          # User dashboard (bookmarks & submissions)
│   ├── submit/             # Submit new tool form
│   ├── tools/              # Tools listing & detail pages
│   ├── sign-in/            # Clerk sign-in
│   └── sign-up/            # Clerk sign-up
├── components/             # React components
│   ├── home/               # Homepage sections
│   └── ui/                 # shadcn/ui components
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   ├── tools.ts            # Tool queries & mutations
│   ├── bookmarks.ts        # Bookmark functionality
│   └── reviews.ts          # Review system
├── lib/                    # Utility functions
├── hooks/                  # Custom React hooks
└── public/                 # Static assets
```

## Admin Access

The admin dashboard (`/admin`) allows approving or rejecting tool submissions. Currently, any authenticated user can access it. To restrict access, add admin user IDs to your Convex database and update the admin page to check for admin role.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
