# 🚀 Pre-Deployment Checklist

## ✅ Security & Secrets
- [x] `.env` file is in `.gitignore` (contains API keys - **NEVER commit this!**)
- [x] No hardcoded API keys or secrets in code
- [x] All sensitive data uses environment variables

## ✅ Build & Dependencies
- [x] `npm run build` completes successfully
- [x] All dependencies are in `package.json`
- [x] `node_modules` is in `.gitignore`
- [x] `dist` folder is in `.gitignore` (build output)

## ✅ Files to Commit
- [x] Source code (`client/`, `server/`, `shared/`)
- [x] Configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`, etc.)
- [x] `README.md` with setup instructions
- [x] `vercel.json` for Vercel deployment
- [x] `.gitignore` properly configured
- [x] `favicon.svg` in `client/public/`

## ✅ Files NOT to Commit
- [x] `.env` (contains your Resend API key)
- [x] `node_modules/`
- [x] `dist/` (build output)
- [x] `.DS_Store`, `Thumbs.db` (OS files)
- [x] Log files

## ✅ Vercel Configuration
- [x] `vercel.json` configured
- [x] Build command: `npm run build`
- [x] Output directory: `dist/public`
- [x] API routes configured for serverless functions

## 📋 Environment Variables for Vercel

**IMPORTANT:** Add these in Vercel Dashboard → Project Settings → Environment Variables:

1. `NODE_ENV` = `production`
2. `RESEND_API_KEY` = `re_YxNQ8BXc_5Tj5bZu2fPSxN3GWbWmZSuZh`
3. `CONTACT_EMAIL` = `luckyverma.ara2005@gmail.com`

## 🎯 GitHub Push Steps

1. **Initialize Git (if not already):**
   ```bash
   git init
   ```

2. **Add all files:**
   ```bash
   git add .
   ```

3. **Verify .env is NOT included:**
   ```bash
   git status
   # Make sure .env is NOT listed!
   ```

4. **Commit:**
   ```bash
   git commit -m "Initial commit: Portfolio project ready for Vercel deployment"
   ```

5. **Add remote and push:**
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

## 🌐 Vercel Deployment Steps

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. **Add Environment Variables** (see above)
5. Vercel will auto-detect build settings from `vercel.json`
6. Click "Deploy"
7. Wait for deployment to complete
8. Your site will be live at `https://your-project.vercel.app`

## ⚠️ Important Notes

- **Never commit `.env` file** - it contains your API keys
- Add environment variables in Vercel dashboard, not in code
- The contact form will work once `RESEND_API_KEY` is set in Vercel
- If deployment fails, check Vercel build logs

## 🐛 Troubleshooting

**Build fails on Vercel:**
- Check that all dependencies are in `package.json`
- Verify Node.js version (should be 18+)
- Check build logs in Vercel dashboard

**API routes not working:**
- Verify environment variables are set in Vercel
- Check that `api/index.ts` is properly configured
- Review Vercel function logs

**Contact form not sending emails:**
- Verify `RESEND_API_KEY` is set in Vercel environment variables
- Check `CONTACT_EMAIL` is set correctly
- Review server logs in Vercel dashboard

