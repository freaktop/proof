"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

import { firebaseAuth } from "@/lib/firebaseClient";
import VideoProofRecorder from "@/components/VideoProofRecorder";

export default function AppPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (err) {
      setError("Sign-in failed. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await signOut(firebaseAuth);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-indigo-500">
            PROOF v0.1
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Create a Proof Artifact
          </h1>
          <p className="text-sm text-slate-600">
            Record a short video and create a tamper-evident cryptographic proof.
            The stored media bytes can be publicly verified for integrity.
          </p>
          <Link href="/" className="text-xs text-indigo-600 underline">
            Back to home
          </Link>
        </header>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!user ? (
          <div className="rounded-xl bg-white p-6 shadow space-y-3">
            <p className="text-sm text-slate-700">
              Sign in to start recording and sealing proofs.
            </p>
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white"
            >
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow">
              <div>
                <p className="text-xs text-slate-500">Signed in</p>
                <p className="text-sm font-semibold text-slate-900">
                  {user.email || user.uid}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-semibold text-slate-600 underline"
              >
                Sign out
              </button>
            </div>
            <VideoProofRecorder user={user} />
          </div>
        )}
      </div>
    </main>
  );
}
