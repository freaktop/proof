"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type VerifyResponse = {
  proofId: string;
  valid: boolean;
  createdAt: string;
  mediaHash: string;
  currentHash: string;
  signals?: Array<{ type: string; value: string }>;
};

export default function VerifyPage() {
  const params = useParams();
  const proofId = params.id as string;
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!proofId) return;

    const verify = async () => {
      try {
        const response = await fetch(`/api/proofs/${proofId}/verify`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Unable to verify this proof.");
        }
        const payload = (await response.json()) as VerifyResponse;
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify this proof.");
      }
    };

    verify();
  }, [proofId]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-indigo-500">
            Public Verification
          </p>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-slate-900">
              Proof ID
            </h1>
            <p className="text-sm font-mono text-slate-600 break-all">
              {proofId}
            </p>
          </div>
          <Link href="/" className="text-xs text-indigo-600 underline">
            Back to home
          </Link>
        </header>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!data && !error ? (
          <p className="text-sm text-slate-600">Verifying...</p>
        ) : null}

        {data ? (
          <div className="rounded-xl bg-white p-6 shadow space-y-4">
            <div
              className={`rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                data.valid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
              }`}
            >
              {data.valid ? "Integrity verified" : "Integrity check failed"}
            </div>
            {data.valid ? (
              <p className="text-xs text-slate-600 leading-relaxed">
                The stored media bytes exactly match the cryptographic hash sealed at creation.
                No tampering has been detected since this proof was created.
              </p>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                The stored media does not match the sealed hash.
                This proof may have been altered.
              </p>
            )}
            <div className="text-sm text-slate-600 space-y-3">
              <p>
                <span className="font-semibold text-slate-800">Created:</span>{" "}
                {data.createdAt}
              </p>
              <div className="space-y-2">
                <p className="break-all">
                  <span className="font-semibold text-slate-800">Media hash:</span>{" "}
                  {data.mediaHash}
                </p>
                <p className="break-all">
                  <span className="font-semibold text-slate-800">Current hash:</span>{" "}
                  {data.currentHash}
                </p>
                <p className="text-xs text-slate-500 italic">
                  These hashes are cryptographic fingerprints of the media file.
                  Any change to the file will cause the hashes to differ.
                </p>
              </div>
            </div>
            {data.signals?.length ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Signals</p>
                <p className="text-xs text-slate-500 italic mb-2">
                  Signals increase confidence but do not assert identity or event context.
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {data.signals.map((signal, index) => (
                    <li key={`${signal.type}-${index}`} className="break-all">
                      {signal.type}: {signal.value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
