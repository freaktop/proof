import { NextResponse } from "next/server";

import { adminAuth, adminDB, adminStorageBucket } from "@/lib/firebaseAdmin";
import { sha256Hex } from "@/lib/crypto";

export const runtime = "nodejs";

type SealPayload = {
  proofId: string;
  storagePath: string;
  clientHash: string;
  signals?: {
    device_fingerprint?: string;
    client_time_iso?: string;
  };
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : "";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const body = (await request.json()) as SealPayload;

    if (!body?.proofId || !body?.storagePath || !body?.clientHash) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const expectedPath = `proofs/${decoded.uid}/${body.proofId}.webm`;
    if (body.storagePath !== expectedPath) {
      return NextResponse.json({ error: "Invalid storage path" }, { status: 400 });
    }

    const file = adminStorageBucket.file(body.storagePath);
    const [buffer] = await file.download();
    const serverHash = await sha256Hex(buffer);

    if (serverHash !== body.clientHash) {
      return NextResponse.json({ error: "Hash mismatch" }, { status: 400 });
    }

    const createdAt = new Date().toISOString();
    const proofDoc = {
      proofId: body.proofId,
      uid: decoded.uid,
      storagePath: body.storagePath,
      mediaHash: serverHash,
      createdAt,
      clientHash: body.clientHash,
      verifiedAtSeal: true,
      verificationScore: 60,
    };

    const proofRef = adminDB.collection("proofs").doc(body.proofId);
    await proofRef.create(proofDoc);

    const signalsRef = proofRef.collection("signals");
    const signalEntries = Object.entries(body.signals || {}).filter(
      ([, value]) => Boolean(value)
    );

    await Promise.all(
      signalEntries.map(([type, value]) =>
        signalsRef.doc().set({
          type,
          value,
          createdAt,
        })
      )
    );

    return NextResponse.json({ proofId: body.proofId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seal proof" }, { status: 500 });
  }
}
