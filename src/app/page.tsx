import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black px-6 py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Hero */}
        <section>
          <h1 className="text-4xl font-bold">ProofCheck</h1>
          <p className="text-xl font-medium mt-2">
            Tamper-evident video proof. Verified in seconds.
          </p>
          <p className="text-gray-600 mt-4">
            Record a short video, seal its cryptographic fingerprint, and share a
            link that shows whether the media has been altered.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
            <Link
              href="/app"
              className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Create a Proof
            </Link>
            <Link
              href="/verify"
              className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Verify a Proof
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-5">
            Or{" "}
            <Link href="/app" className="underline hover:text-gray-700">
              skip directly to creating a proof
            </Link>
            .
          </p>
        </section>

        {/* What it does */}
        <section className="pt-16 text-left space-y-6">
          <h2 className="text-2xl font-semibold">
            What ProofCheck verifies
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>
              Whether a video file has been altered since it was created
            </li>
            <li>
              Whether the stored media still matches its sealed cryptographic
              hash
            </li>
          </ul>

          <h2 className="text-2xl font-semibold pt-6">
            What ProofCheck does not verify
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>What actually happened</li>
            <li>Who appears in the video</li>
            <li>Whether the content is true or accurate</li>
          </ul>
        </section>

        {/* How it works */}
        <section className="pt-16 text-left space-y-6">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <ol className="list-decimal pl-6 text-gray-700 space-y-4">
            <li>
              <strong>Capture</strong> — Record a short video (5–10 seconds).
            </li>
            <li>
              <strong>Seal</strong> — ProofCheck generates a cryptographic hash
              and seals it into an immutable record.
            </li>
            <li>
              <strong>Verify</strong> — Anyone can open the verification link.
              If the file changes, verification fails.
            </li>
          </ol>
        </section>

        {/* Why this exists */}
        <section className="pt-16 text-left">
          <h2 className="text-2xl font-semibold mb-4">Why this exists</h2>
          <p className="text-gray-700 leading-relaxed">
            AI can now generate or alter realistic media. ProofCheck restores one
            simple guarantee: if a file has been modified after sealing, the
            change is detectable. No more. No less.
          </p>
        </section>

        {/* Final CTA */}
        <section className="pt-16 text-center">
          <p className="text-lg text-gray-700 mb-6">
            Ready to seal your first proof?
          </p>
          <Link
            href="/app"
            className="inline-block px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Create a Proof
          </Link>
        </section>

        {/* Footer disclaimer */}
        <footer className="pt-16 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            ProofCheck is a tamper-evident integrity system. It does not
            determine truth, authenticity, or identity.
          </p>
        </footer>
      </div>
    </main>
  );
}
