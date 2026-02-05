"use client";

import Border from "../../components/border";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CameraRetake from "../../components/retakeCamera";

export default function RetakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const indexParam = Number(searchParams.get("i"));

  const [cooldown, setCooldown] = useState(5);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const index = useMemo(
    () => (Number.isFinite(indexParam) ? indexParam : -1),
    [indexParam],
  );

  useEffect(() => {
    const t = Number(sessionStorage.getItem("cooldown"));
    if ([3, 5, 10].includes(t)) setCooldown(t);
  }, []);

  // Start camera on mount
  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      try {
        const constraints = {
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!isMounted) return;

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        setError(
          e?.name === "NotAllowedError"
            ? "Camera permission denied. Please allow camera access in your browser settings."
            : `Camera error: ${e?.message || String(e)}`,
        );
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      const stream = streamRef.current;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function runCountdown(seconds) {
    return new Promise((resolve) => {
      setCountdown(seconds);
      let t = seconds;

      const id = setInterval(() => {
        t -= 1;
        if (t <= 0) {
          clearInterval(id);
          setCountdown(null);
          resolve();
        } else {
          setCountdown(t);
        }
      }, 1000);
    });
  }

  function captureFrameUrl() {
    const video = videoRef.current;
    if (!video) return null;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;

    const targetAspect = 16 / 9;
    const currentAspect = w / h;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = w;
    let sourceHeight = h;

    if (currentAspect < targetAspect) {
      sourceHeight = w / targetAspect;
      sourceY = (h - sourceHeight) / 2;
    } else if (currentAspect > targetAspect) {
      sourceWidth = h * targetAspect;
      sourceX = (w - sourceWidth) / 2;
    }

    const canvasWidth = 1920;
    const canvasHeight = 1080;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.translate(canvasWidth, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(
      video,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvasWidth,
      canvasHeight,
    );

    return canvas.toDataURL("image/jpeg", 0.95);
  }

  async function saveRetake() {
    setError(null);
    if (isRunning) return;
    setIsRunning(true);

    await runCountdown(cooldown);

    const dataUrl = captureFrameUrl();
    if (!dataUrl) {
      setError("Failed to capture. Camera may not be ready.");
      setIsRunning(false);
      return;
    }

    const shots = JSON.parse(sessionStorage.getItem("shots") || "[]");
    if (!shots || index < 0 || index >= shots.length) {
      router.push("/check");
      return;
    }
    shots[index] = dataUrl;
    sessionStorage.setItem("shots", JSON.stringify(shots));

    setIsRunning(false);
    router.push("/check");
  }

  return (
    <>
      <Border />
      <main className="flex flex-col justify-start min-h-screen items-center p-10 sm:p-10 md:p-12 lg:p-24 pt-4 sm:pt-6 md:pt-0 lg:pt-30 bg-[#FDFDF5]">
        <div className="flex mt-15 lg:-mt-15 mb-5 text-center">
          <Image
            src="/smile_title.png"
            alt="Smile"
            width={240}
            height={60}
            className="mx-auto"
          />
        </div>
        <CameraRetake
          videoRef={videoRef}
          countdown={countdown}
          shotIndex={index}
          cooldown={cooldown}
          isRunning={isRunning}
          error={error}
          onCapture={saveRetake}
          onCancel={() => router.push("/check")}
        />
      </main>
    </>
  );
}
