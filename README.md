# Dark Galaxy Design - Portfolio Project

A modern 3D portfolio website built with React, Three.js, Express, and TypeScript.

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   HOST=0.0.0.0
   NODE_ENV=development
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   
   # Email Configuration (Resend)
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   CONTACT_EMAIL=your-email@example.com
   ```
   
   **Email Setup (Resend - Free):**
   - Sign up for a free account at [resend.com](https://resend.com)
   - Get your API key from the dashboard
   - Add `RESEND_API_KEY` to your `.env` file
   - Set `CONTACT_EMAIL` to the email address where you want to receive contact form submissions
   - **Free tier:** 3,000 emails/month
   
   Note: 
   - `DATABASE_URL` is only needed if you're using database features. The app uses in-memory storage by default.
   - Without `RESEND_API_KEY`, emails will only be logged to the console (for development).

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server (requires build first)
- `npm run check` - Type check the codebase
- `npm run db:push` - Push database schema changes (requires DATABASE_URL)

## 📦 Building for Production

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm run start
   ```

The build process will:
- Build the React client with Vite
- Bundle the Express server with esbuild
- Output everything to the `dist/` directory

## 🌐 Vercel Deployment

This project is configured for Vercel deployment. To deploy:

1. **Push your code to GitHub**

2. **Import your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure environment variables in Vercel dashboard:**
   - `NODE_ENV=production`
   - `RESEND_API_KEY` - Your Resend API key (for contact form emails)
   - `CONTACT_EMAIL` - Email address to receive contact form submissions
   - `DATABASE_URL` (if using a database)

4. **Deploy:**
   Vercel will automatically detect the build settings and deploy your app.

### Vercel Configuration

The project includes a `vercel.json` configuration file. For a full Express app on Vercel, you may need to:
- Use Vercel's Pro plan for better Node.js runtime support
- Or consider refactoring API routes to serverless functions

## 🛠️ Project Structure

```
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utilities and stores
│   └── public/         # Static assets
├── server/          # Express backend
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API routes
│   └── vite.ts      # Vite dev server setup
├── shared/          # Shared types and schemas
└── dist/            # Build output (generated)

```

## 📧 Contact Form Email Setup

The contact form uses **Resend** to send emails when visitors submit messages. 

### Quick Setup:
1. **Create a free Resend account:** [resend.com/signup](https://resend.com/signup)
2. **Get your API key:** Go to API Keys in the Resend dashboard
3. **Add to `.env` file:**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   CONTACT_EMAIL=your-email@example.com
   ```
4. **Restart your dev server**

### Features:
- ✅ **Free tier:** 3,000 emails/month
- ✅ Professional HTML email templates
- ✅ Reply-to set to sender's email
- ✅ Works in development and production
- ✅ Graceful fallback (logs to console if not configured)

## 📝 Notes

- The project was originally created on Replit and has been adapted for local development and Vercel deployment
- Port configuration: Defaults to 5000, can be changed via `PORT` environment variable
- Database: Uses in-memory storage by default. Set `DATABASE_URL` to use PostgreSQL
- All Replit-specific dependencies have been made optional or removed
- Contact form emails are sent via Resend (free tier available)

## 🐛 Troubleshooting

**Port already in use:**
- Change the `PORT` in your `.env` file or environment variables

**Build errors:**
- Make sure all dependencies are installed: `npm install`
- Check Node.js version (requires 18+)

**Vercel deployment issues:**
- Ensure `NODE_ENV=production` is set in Vercel environment variables
- Check that the build completes successfully locally first

