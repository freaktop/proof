# DEPLOYMENT GUIDE

## Option 1: Vercel (Recommended)

### 1. Install Vercel CLI
\\\ash
npm i -g vercel
\\\

### 2. Login to Vercel
\\\ash
vercel login
\\\

### 3. Deploy
\\\ash
vercel --prod
\\\

### 4. Set Environment Variables in Vercel Dashboard
Go to your Vercel project → Settings → Environment Variables and add:

**Firebase Client (NEXT_PUBLIC_*)**
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

**Firebase Admin (Server)**
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

## Option 2: Netlify

### 1. Install Netlify CLI
\\\ash
npm i -g netlify-cli
\\\

### 2. Build and Deploy
\\\ash
npm run build
netlify deploy --prod --dir=.next
\\\

### 3. Set Environment Variables
Configure in Netlify dashboard under Site settings → Build & deploy → Environment

## Production Checklist
- [ ] Firebase Storage rules allow authenticated uploads
- [ ] Firebase OAuth domains include production URL
- [ ] All environment variables set in production
- [ ] Test video upload and verification flow
- [ ] Test on mobile devices
