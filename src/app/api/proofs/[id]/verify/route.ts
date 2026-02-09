import { NextResponse } from "next/server";

import { adminDB, adminStorageBucket } from "@/lib/firebaseAdmin";
import { sha256Hex } from "@/lib/crypto";

export const runtime = "nodejs";

type Params = {
  id: string;
};

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { id: proofId } = await params;
    
    if (!proofId) {
      return NextResponse.json({ error: "Proof ID is required" }, { status: 400 });
    }
    const proofRef = adminDB.collection("proofs").doc(proofId);
    const snapshot = await proofRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: "Proof not found" }, { status: 404 });
    }

    const proof = snapshot.data() as {
      proofId: string;
      storagePath: string;
      mediaHash: string;
      createdAt: string;
    };

    // Download the stored file and recompute hash on every verification request
    // This ensures real-time integrity checking - no cached or assumed valid state
    const file = adminStorageBucket.file(proof.storagePath);
    const [buffer] = await file.download();
    const currentHash = await sha256Hex(buffer);
    const valid = currentHash === proof.mediaHash;

    const signalsSnapshot = await proofRef.collection("signals").get();
    const signals = signalsSnapshot.docs.map((doc) => doc.data());

    return NextResponse.json({
      proofId,
      valid,
      createdAt: proof.createdAt,
      mediaHash: proof.mediaHash,
      currentHash,
      signals,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ 
      error: "Unable to verify at this time"
    }, { status: 500 });
  }
}
