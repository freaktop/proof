"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { ref, uploadBytesResumable } from "firebase/storage";

import { firebaseStorage } from "@/lib/firebaseClient";
import { sha256Hex } from "@/lib/crypto";
import { getDeviceFingerprint } from "@/lib/fingerprint";

type SealResponse = {
  proofId: string;
};

type Props = {
  user: User;
};

export default function VideoProofRecorder({ user }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<string>("Ready");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [clientHash, setClientHash] = useState<string | null>(null);
  const [proofId, setProofId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [verifyLink, setVerifyLink] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [stream, previewUrl]);

  const startCamera = async () => {
    setError(null);
    setStatus("Requesting camera...");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStatus("Camera ready");
    } catch (err) {
      setError("Camera access denied or unavailable.");
      setStatus("Error");
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) {
      setError("Start the camera first.");
      return;
    }
    if (!window.MediaRecorder) {
      setError("MediaRecorder is not supported on this device.");
      return;
    }

    setError(null);
    setStatus("Recording...");
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      setStatus("Processing...");
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const nextPreviewUrl = URL.createObjectURL(blob);
      setPreviewUrl(nextPreviewUrl);

      const buffer = await blob.arrayBuffer();
      const hash = await sha256Hex(buffer);
      setClientHash(hash);

      await uploadAndSeal(blob, hash);
    };

    recorder.start();
    setIsRecording(true);
    setTimeout(() => {
      if (recorder.state !== "inactive") {
        recorder.stop();
        setIsRecording(false);
      }
    }, 10_000);
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAndSeal = async (blob: Blob, hash: string) => {
    setStatus("Uploading...");
    setUploadProgress(0);
    setVerifyLink(null);

    const nextProofId = crypto.randomUUID();
    const storagePath = `proofs/${user.uid}/${nextProofId}.webm`;
    setProofId(nextProofId);

    try {
      const storageRef = ref(firebaseStorage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, blob, {
        contentType: "video/webm",
      });

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (err) => reject(err),
          () => resolve()
        );
      });

      setStatus("Sealing proof...");
      const idToken = await user.getIdToken();
      const deviceFingerprint = await getDeviceFingerprint();
      const clientTimeIso = new Date().toISOString();

      const response = await fetch("/api/proofs/seal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          proofId: nextProofId,
          storagePath,
          clientHash: hash,
          signals: {
            device_fingerprint: deviceFingerprint,
            client_time_iso: clientTimeIso,
          },
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Seal request failed.");
      }

      const data = (await response.json()) as SealResponse;
      setVerifyLink(`/verify/${data.proofId}`);
      setStatus("Proof sealed");
    } catch (err) {
      setError("Failed to seal proof. Please try again.");
      setStatus("Error");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="rounded-xl bg-white shadow p-4 space-y-3">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-lg bg-black aspect-video"
        />
        {previewUrl ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Preview</p>
            <video
              src={previewUrl}
              controls
              className="w-full rounded-lg bg-black aspect-video"
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-xl bg-white shadow p-4 space-y-3">
        <p className="text-sm text-gray-600">Status: {status}</p>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {clientHash ? (
          <p className="text-xs text-gray-500 break-all">
            Client hash: {clientHash}
          </p>
        ) : null}
        {uploadProgress > 0 && uploadProgress < 100 ? (
          <p className="text-sm text-gray-600">
            Uploading: {uploadProgress}%
          </p>
        ) : null}
        {verifyLink ? (
          <a
            href={verifyLink}
            className="block text-center text-sm font-semibold text-indigo-600 underline"
          >
            View proof verification
          </a>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={startCamera}
            className="rounded-lg bg-indigo-600 text-white py-2 text-sm font-semibold"
          >
            Start Camera
          </button>
          <button
            type="button"
            onClick={stopStream}
            className="rounded-lg bg-gray-200 text-gray-800 py-2 text-sm font-semibold"
          >
            Stop Camera
          </button>
          <button
            type="button"
            onClick={startRecording}
            disabled={isRecording}
            className="rounded-lg bg-emerald-600 text-white py-2 text-sm font-semibold disabled:opacity-50"
          >
            Record 10s
          </button>
          <button
            type="button"
            onClick={stopRecording}
            disabled={!isRecording}
            className="rounded-lg bg-red-600 text-white py-2 text-sm font-semibold disabled:opacity-50"
          >
            Stop
          </button>
        </div>
        {proofId ? (
          <p className="text-xs text-gray-500">Proof ID: {proofId}</p>
        ) : null}
      </div>
    </div>
  );
}
