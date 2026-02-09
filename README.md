# PROOF v0.1

Tamper-evident video proof system with cryptographic verification.

## What It Does

Creates immutable video proofs that can be publicly verified for integrity.

- Record video → Compute SHA-256 hash → Store immutably → Verify publicly
- If media changes, verification fails
- No claims about truth, identity, or context

## Quick Start

1. Clone and install: `npm install`
2. Configure Firebase (see below)
3. Run: `npm run dev`
4. Open: `http://localhost:3000`

## Firebase Setup

### Client SDK
Create `.env.local` with:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Admin SDK
Add to `.env.local`:
```env
FIREBASE_PROJECT_ID=your_project
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
```

### Firebase Console
- **Authentication**: Enable Google sign-in
- **Storage**: Rules allow authenticated uploads
- **OAuth domains**: Add localhost and production URL

## Deployment

Deploy to Vercel from GitHub repository.

## Security

- **Storage**: Files are write-once
- **Database**: Records are immutable  
- **Verification**: Real-time hash recomputation
- **Tampering**: Detected via hash mismatch
