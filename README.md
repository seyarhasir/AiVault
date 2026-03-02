<div align="center">
<img width="1200" height="475" alt="AiVault Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AiVault - AI Tools Directory

A curated directory for discovering, comparing, and sharing the best AI tools across every category. Built with Next.js, Convex, and Clerk authentication.

## ✨ Features

- 🔍 **Discover AI Tools** - Browse 40+ curated AI tools across categories like Writing, Image, Video, Coding, Productivity, Audio, and Design
- 💾 **Bookmark Tools** - Save your favorite tools to your personal dashboard
- ➕ **Submit Tools** - Share new AI tools with the community (admin approval required)
- 🎨 **Dark/Light Mode** - Beautiful theme toggle with system preference support
- 📱 **Responsive Design** - Fully responsive UI that works on all devices
- 🔐 **User Authentication** - Secure sign-in/sign-up with Clerk
- ⚡ **Real-time Updates** - Live data with Convex backend

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend:** [Convex](https://convex.dev/) (serverless database & functions)
- **Auth:** [Clerk](https://clerk.com/) (authentication & user management)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aivault.git
   cd aivault
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
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.com)
   - `CLERK_SECRET_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.com)
   - `NEXT_PUBLIC_CONVEX_URL` - Get from [Convex Dashboard](https://dashboard.convex.dev)
   - `CONVEX_DEPLOY_KEY` - Get from [Convex Dashboard](https://dashboard.convex.dev)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

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

## 🔑 Admin Access

The admin dashboard (`/admin`) allows approving or rejecting tool submissions. Currently, any authenticated user can access it. To restrict access:

1. Add admin user IDs to your Convex database
2. Update the admin page to check for admin role

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, Convex, and Clerk.
