"use client";

import { useState } from "react";
import Link from "next/link";

export default function VerifyLanding() {
  const [proofId, setProofId] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-indigo-500">
            Public Verification
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Verify Proof Integrity
          </h1>
          <p className="text-sm text-slate-600">
            Enter a proof ID to verify that the stored media bytes have not been altered.
          </p>
          <Link href="/" className="text-xs text-indigo-600 underline">
            Back to home
          </Link>
        </header>

        <div className="rounded-xl bg-white p-6 shadow space-y-4">
          <div className="space-y-2">
            <label htmlFor="proofId" className="block text-sm font-semibold text-slate-800">
              Proof ID
            </label>
            <input
              id="proofId"
              type="text"
              value={proofId}
              onChange={(e) => setProofId(e.target.value)}
              placeholder="Enter proof ID (e.g., 425f9991-f701-4a88-89a2-68cb531b4e54)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {proofId ? (
            <Link
              href={`/verify/${proofId.trim()}`}
              className="block w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Verify Proof
            </Link>
          ) : (
            <button
              disabled
              className="block w-full rounded-lg bg-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-500 cursor-not-allowed"
            >
              Enter Proof ID
            </button>
          )}
        </div>

        <div className="rounded-xl bg-slate-100 p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-700">How to find a Proof ID:</p>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li>Copy the verification link after creating a proof</li>
            <li>Proof ID is the UUID in the URL: /verify/[PROOF-ID]</li>
            <li>Proof IDs are 36 characters with hyphens</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
