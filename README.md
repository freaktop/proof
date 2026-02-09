# PROOF v0.1 — Truth-validated, tamper-evident MVP

Mobile-first web app that creates tamper-evident video proofs. Records video, computes SHA-256 hash, stores immutably, and provides public verification of byte-level integrity.

## Features

- Record 5–10 second video on mobile
- Client-side SHA-256 hash (WebCrypto)
- Server-side SHA-256 verification before sealing
- Firestore proof records are write-once
- Public verification endpoint (no auth)
- Minimal device fingerprint signal stored alongside proof

## Tech Stack

- Next.js (App Router) + Tailwind CSS
- Firebase Auth + Storage (client SDK)
- Firebase Admin SDK (server routes)
- Firestore

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create a Firebase project.
2. Enable Firebase Auth (Google provider recommended).
3. Create a Firestore database.
4. Create a Storage bucket.
5. Generate a service account key (JSON) and copy values to env vars.

### 3. Configure Environment Variables
Create `.env.local` in the project root:
```env
# Firebase Web (client)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (server)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Firestore Security Rules (write-once)
```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /proofs/{proofId} {
      allow read: if true;
      allow create: if false;
      allow update, delete: if false;

      match /signals/{signalId} {
        allow read: if true;
        allow create: if false;
        allow update, delete: if false;
      }
    }
  }
}
```

> The app writes proofs via the Admin SDK, which bypasses rules. Client writes are intentionally blocked.

### 5. Storage Rules (no overwrite)
```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /proofs/{uid}/{fileName} {
      allow read: if false;
      allow write: if request.auth != null
        && request.auth.uid == uid
        && resource == null;
    }
  }
}
```

### 6. Run Development Server
```bash
npm run dev
```

Open `http://localhost:3000`.

## API Contract

### POST `/api/proofs/seal`
Body:
```json
{
  "proofId": "uuid",
  "storagePath": "proofs/{uid}/{proofId}.webm",
  "clientHash": "sha256",
  "signals": {
    "device_fingerprint": "sha256",
    "client_time_iso": "2026-01-22T00:00:00.000Z"
  }
}
```
Headers:
```
Authorization: Bearer <firebaseIdToken>
```
Response:
```json
{ "proofId": "uuid" }
```

### GET `/api/proofs/:id/verify`
Response:
```json
{
  "proofId": "uuid",
  "valid": true,
  "createdAt": "2026-01-22T00:00:00.000Z",
  "mediaHash": "sha256",
  "currentHash": "sha256"
}
```

## Routes

- `/` Marketing
- `/app` Authenticated proof creation
- `/verify/[id]` Public verification

## Tamper Detection Behavior

### What happens if someone attempts to tamper with a proof:

**a) File overwrite attempt:**
- **Blocked by Storage rules**: Firebase Storage rules prevent overwriting existing files (`resource == null`)
- Files are write-once by design
- Cannot replace an existing proof video

**b) File byte alteration:**
- **Detected via hash mismatch**: Any change to file bytes alters the SHA-256 hash
- Verification shows "Integrity check failed"
- Current hash ≠ sealed hash, proving tampering occurred

**c) Hash replay with different bytes:**
- **Detected during verification**: Server recomputes hash from stored file bytes on every request
- Cannot spoof hash verification since actual file bytes are used
- Hash comparison ensures byte-level integrity

### Security Guarantees:
- **Cryptographic integrity**: SHA-256 hash of file bytes
- **Immutable storage**: Files cannot be overwritten
- **Write-once records**: Firestore proofs are immutable
- **Real-time verification**: Hash recomputed on each verification request
