import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-indigo-500">
            PROOF v0.1
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Tamper-evident video proof with cryptographic verification.
          </h1>
          <p className="text-base text-slate-600">
            Record a video and create an immutable cryptographic proof of its bytes.
            Anyone can publicly verify that the stored media has not been altered.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Create a proof
            </Link>
            <Link
              href="/verify"
              className="rounded-lg border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700"
            >
              Verify a proof
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm font-semibold text-slate-800">Capture</p>
            <p className="text-xs text-slate-600">
              Record a short, mobile-first clip with your camera.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm font-semibold text-slate-800">Seal</p>
            <p className="text-xs text-slate-600">
              Client + server SHA-256 verification creates immutable proof.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm font-semibold text-slate-800">Verify</p>
            <p className="text-xs text-slate-600">
              Public verification confirms byte-level integrity without login.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
