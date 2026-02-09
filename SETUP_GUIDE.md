# PAP Setup Guide 

A comprehensive guide to installing and running the Prediction Accountability Platform locally and in production.

---

## Table of Contents

1. [Local Development Setup](#-local-development-setup)
2. [Environment Configuration](#-environment-configuration)
3. [AI Features Setup](#-ai-features-setup)
4. [Database Setup](#-database-setup)
5. [Testing Environment](#-testing-environment)
6. [Production Deployment](#-production-deployment)
7. [Docker Setup](#-docker-setup)
8. [Troubleshooting](#-troubleshooting)

---

## 🔨 Local Development Setup

### Prerequisites Check

Verify you have the required tools:

```bash
# Check Node.js version (need 18.x or higher)
node --version
# Output should be something like: v18.17.0 or higher

# Check npm version
npm --version
# Output should be v9+ 

# Check git
git --version
```

If you don't have these:
- **Node.js**: Download from [nodejs.org](https://nodejs.org/) (LTS version)
- **npm**: Comes with Node.js, but upgrade if needed: `npm install -g npm`
- **git**: Download from [git-scm.com](https://git-scm.com/)

### Clone the Repository

```bash
# Clone via HTTPS (recommended for beginners)
git clone https://github.com/yourusername/prediction-accountability-platform.git
cd prediction-accountability-platform

# OR clone via SSH (if you have SSH keys set up)
git clone git@github.com:yourusername/prediction-accountability-platform.git
cd prediction-accountability-platform
```

### Install Dependencies

```bash
# Install all required packages
npm install

# Verify installation
npm list | head -20
# Should show installed packages

# Check for any vulnerabilities
npm audit
# Fix if needed: npm audit fix
```

### Run Development Server

```bash
# Start the development server with hot-reload
npm run dev

# Output should show:
# VITE v4.x.x  ready in XXX ms
# 
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

Open your browser to [http://localhost:5173](http://localhost:5173). You should see the PAP dashboard!

### Verify Everything Works

- ✅ Home page loads without errors
- ✅ Can navigate between tabs (Claims, Dashboard, Claimants, Manifesto)
- ✅ Can add a test claim (without AI features initially)
- ✅ Browser console shows no critical errors (F12 → Console tab)

---

## ⚙️ Environment Configuration

### Create Environment File

PAP uses Vite environment variables. Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit it with your favorite editor
nano .env.local
# or
code .env.local  # VS Code
# or
vim .env.local   # Vim
```

### Available Environment Variables

```bash
# Gemini AI API Key (for advanced features)
# Get free key from https://ai.google.dev/
VITE_API_KEY=your_gemini_api_key_here

# Firebase Configuration (optional, for production)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# App Configuration
VITE_APP_NAME=Prediction Accountability Platform
VITE_APP_VERSION=1.0.0

# API Configuration (for backend)
VITE_API_URL=http://localhost:5173/api
VITE_API_TIMEOUT=30000  # milliseconds
```

### Development vs Production

The `.env.local` is for development. For production, set environment variables in your deployment platform:

**Vercel:**
- Navigate to Project Settings → Environment Variables
- Add each variable
- Redeploy

**Docker/Self-Hosted:**
- Set in `.env` file
- Or pass via `docker run -e VITE_API_KEY=...`

---

## 🤖 AI Features Setup

### Option 1: With Gemini AI (Recommended)

Best for advanced features (vagueness analysis, claim verification, etc.)

#### Get a Gemini API Key

1. Go to [ai.google.dev](https://ai.google.dev/)
2. Click **"Get API Key"** (blue button)
3. Select or create a Google Cloud project
4. Enable the Generative AI API
5. Copy the API key

#### Configure in PAP

```bash
# Edit .env.local
VITE_API_KEY=AIzaSy_D_u... (your key here)

# Restart dev server
npm run dev

# Test it
# Open browser console (F12 → Console)
# Should log: "✓ Gemini API Key configured"
```

#### Verify AI Features Work

1. Go to "Record New Claim" (blue button)
2. Enter a test claim: *"Nepal's GDP will grow by 5% in 2025"*
3. Click **"Analyze with AI"**
4. Should see:
   - ✅ Vagueness score calculated
   - ✅ Verification parameters listed
   - ✅ No pink/red error boxes

### Option 2: Without AI (Local Heuristics)

PAP works fine without API key, using local algorithms:

```bash
# Leave VITE_API_KEY blank or empty
VITE_API_KEY=

# Development continues to work
npm run dev

# AI features use fallback heuristics:
# - Vagueness scoring based on keywords/length
# - Basic pattern matching instead of NLP
# - No auto news-monitoring for claim resolution
```

**Limitations without AI:**
- ❌ Vagueness scoring is less accurate (keyword-based)
- ❌ Can't auto-detect claimant background info
- ❌ Manifesto claim extraction is basic
- ❌ No AI suggestion for claim verification verdicts

**Still works:**
- ✅ Manual claim entry and verification
- ✅ Claimant profile creation
- ✅ Dashboard and analytics
- ✅ Local data persistence

---

## 💾 Database Setup

### Development Database (Local Storage)

Current setup uses **browser localStorage** for development (no server needed):

```bash
# Data stored in browser
# Access via browser DevTools:
# F12 → Application → Local Storage → http://localhost:5173

# Data keys:
# - pap_claims_v1      → Claims data
# - pap_claimants_v1   → Claimants data
# - pap_manifestos_v1  → Manifestos data
```

**Limitations:**
- 🔴 Only ~5MB storage per origin
- 🔴 Data lost if browser cache cleared
- 🔴 Not shared across devices/browsers
- 🟡 No backup mechanism

### Production Database (Firebase)

For production with syncing across devices:

#### Setup Firebase

1. Go to [firebase.google.com](https://firebase.google.com/)
2. Click **"Go to Console"** (top right)
3. Create a new project, name it "PAP"
4. Enable Firestore Database:
   - Click "Build" → "Firestore Database"
   - Choose "Test mode" (for now)
   - Select default location
5. Get config details:
   - Project Settings → Your Apps → Create Web App
   - Copy the Firebase config

#### Configure in `.env.local`

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=pap-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pap-xxxx
VITE_FIREBASE_STORAGE_BUCKET=pap-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

#### Update App Code

In `src/services/databaseService.ts`, enable Firebase sync:

```typescript
// Uncomment Firebase imports and initialization
// This requires modifying the service file
```

(Firebase integration is optional; app works fine with localStorage)

---

## 🧪 Testing Environment

### Unit Tests

```bash
# Run all tests
npm run test

# Run with watch mode (auto-rerun on file change)
npm run test -- --watch

# Run specific test file
npm run test -- ClaimCard.test.tsx

# Run with coverage report
npm run test -- --coverage
```

### E2E Tests (Recommended for Future)

```bash
# Install Playwright (for E2E testing)
npm install -D @playwright/test

# Create tests/example.spec.ts
# Run: npx playwright test
```

### Manual Testing Checklist

Before committing:

- [ ] Open http://localhost:5173
- [ ] Navigate all tabs (Claims, Dashboard, Claimants, Manifesto)
- [ ] Add a test claim: *"Test claim for verification"*
- [ ] Verify it appears in the list
- [ ] Edit the claim
- [ ] Delete the claim
- [ ] Open a claim detail view
- [ ] Verify claimant profile loads
- [ ] Check browser console (F12) for errors
- [ ] Test on mobile (DevTools → Toggle device toolbar)
- [ ] Test with AI key and without AI key

---

## 🚀 Production Deployment

### Option 1: Vercel (Recommended - Easiest)

Vercel works seamlessly with Vite + React.

#### Setup

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com/) and sign up
2. **Connect GitHub**: Click "Import Project" → Select your GitHub repo
3. **Configure Environment**:
   - Go to Project Settings → Environment Variables
   - Add `VITE_API_KEY`, Firebase keys, etc.
   - Save
4. **Deploy**: Click "Deploy"
   - Vercel auto-builds and deploys
   - Get live URL: `https://your-app-name.vercel.app`

#### Auto-Deploys

After setup, every push to `main` auto-deploys:
```bash
git push origin main
# → Vercel auto-builds and deploys in ~2-3 minutes
```

### Option 2: GitHub Pages (Free, Static)

Good for static export (limited functionality).

#### Setup

1. **Build for GitHub Pages**:
   ```bash
   npm run build
   # Creates dist/ folder

   # Update vite.config.ts:
   # base: '/prediction-accountability-platform/'
   ```

2. **Push to gh-pages branch**:
   ```bash
   npm install -D gh-pages
   npm run build
   npx gh-pages -d dist
   ```

3. **Enable GitHub Pages**:
   - Settings → Pages
   - Source: gh-pages branch
   - Save
   - URL: `https://yourusername.github.io/prediction-accountability-platform/`

### Option 3: Docker (Self-Hosted)

Good for custom hosting or private deployment.

See [Docker Setup](#-docker-setup) below.

### Post-Deployment Checklist

✅ Site loads and is fast  
✅ All features work (especially AI if key configured)  
✅ No console errors (F12)  
✅ Mobile responsive  
✅ SSL certificate valid (green lock)  
✅ Analytics tracking (if enabled)  

---

## 🐳 Docker Setup

### Local Docker Development

```bash
# Build Docker image
docker build -t pap:latest .

# Run container
docker run -p 3000:3000 pap:latest

# Access at http://localhost:3000
```

### Docker Compose (for multiple services)

```bash
# Create docker-compose.yaml (see provided file)

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Deployment

```bash
# Build for production
docker build -t myregistry/pap:1.0.0 .

# Push to Docker Hub or your registry
docker push myregistry/pap:1.0.0

# Deploy to cloud (AWS ECS, GCP Cloud Run, etc.)
# Instructions vary by provider
```

---

## 🔧 Troubleshooting

### Issue: `npm install` fails

**Symptom:**
```
npm ERR! code E404
npm ERR! 404 Not Found
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### Issue: `localhost:5173` shows blank page

**Symptoms:**
- Page loads but shows "Loading..." forever
- Or shows blank white screen

**Solutions:**

1. **Check console errors** (F12 → Console tab)
   - Copy error message
   - Search in GitHub Issues

2. **Clear browser cache**:
   ```bash
   # In DevTools (F12)
   # → Application → Storage → Clear Site Data
   # → Reload page
   ```

3. **Restart dev server**:
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

4. **Check Node version**:
   ```bash
   node --version
   # Should be 18.x or higher
   ```

---

### Issue: Gemini AI key not working

**Symptom:** "CRITICAL: Gemini API Key is missing" in console

**Solutions:**

1. **Verify key format**:
   ```bash
   # .env.local should have:
   VITE_API_KEY=AIzaSy_xxxxxxxxxx
   # Not: VITE_API_KEY="AIzaSy_xxxxxxxxxx" (no quotes)
   ```

2. **Restart dev server** after changing `.env.local`:
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

3. **Check key validity**:
   - Go to [ai.google.dev](https://ai.google.dev/)
   - Verify key is still active
   - Regenerate if old

4. **Check quota/billing**:
   - Gemini API has free tier limits
   - May need to add billing to Google Cloud project
   - Check [console.cloud.google.com](https://console.cloud.google.com)

---

### Issue: "Module not found" error

**Symptom:**
```
Error: Cannot find module './components/ClaimCard'
```

**Solutions:**

1. **Check file path** (case-sensitive):
   ```bash
   # Wrong
   import { ClaimCard } from './components/claimCard'
   
   # Correct
   import { ClaimCard } from './components/ClaimCard'
   ```

2. **Check file exists**:
   ```bash
   ls src/components/ClaimCard.tsx
   # Should exist
   ```

3. **Restart dev server**:
   ```bash
   # Ctrl+C then npm run dev
   ```

---

### Issue: Styling not applying (Tailwind CSS)

**Symptom:** Classes like `text-blue-600` don't apply color

**Solutions:**

1. **Check class names**:
   ```tsx
   // Correct
   <button className="px-4 py-2 bg-blue-600 text-white">
   
   // Wrong (brackets needed)
   <button className={px-4 py-2 bg-blue-600}>
   ```

2. **Verify Tailwind config**:
   ```bash
   # Check tailwind.config.js exists
   ls tailwind.config.js
   ```

3. **Rebuild CSS**:
   ```bash
   # Stop dev server
   # Start again
   npm run dev
   ```

---

### Issue: Can't push to GitHub

**Symptom:**
```
fatal: could not read Username for 'https://github.com'
```

**Solution - Use Personal Access Token (PAT):**

1. **Generate token** on GitHub:
   - Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Copy token

2. **Push with token**:
   ```bash
   git push
   # Paste token as password
   ```

   OR set credential helper:
   ```bash
   git config --global credential.helper store
   git push
   # Enter token once, it's remembered
   ```

---

### Issue: Port 5173 already in use

**Symptom:**
```
Error: listen EADDRINUSE :::5173
```

**Solution:**

Option 1: Use different port
```bash
npm run dev -- --port 3000
# Now opens http://localhost:3000
```

Option 2: Kill process using port
```bash
# On macOS/Linux
lsof -ti:5173 | xargs kill -9

# On Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

---

### Issue: Out of memory / slow performance

**Symptom:** Dev server becomes slow, "JavaScript heap out of memory"

**Solution:**

```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run dev

# Or set permanently in .env
NODE_OPTIONS=--max_old_space_size=4096
```

---

## 📚 Next Steps

- 📖 Read [README.md](./README.md) for feature overview
- 🤝 See [CONTRIBUTING.md](./CONTRIBUTING.md) to start contributing
- 💡 Check [ABOUT.md](./ABOUT.md) for project vision
- 🚀 Deploy to Vercel for live testing

---

## 🆘 Still Stuck?

1. **Check Discussions**: [GitHub Discussions](https://github.com/yourrepo/pap/discussions)
2. **Search Issues**: [GitHub Issues](https://github.com/yourrepo/pap/issues)
3. **Email us**: hello@predictionaccountability.org
4. **Join Discord**: [PAP Community](https://discord.gg/pap)

**Happy developing! 🚀**
