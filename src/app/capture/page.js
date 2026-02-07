"use client";

import Border from "../../components/border";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CameraCapture from "../../components/camera";
import { Suspense } from "react";

export default function CapturePage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-[#FDFDF5]">
          <p className="text-[#3D568F] font-bold animate-pulse">
            Initializing Camera...
          </p>
        </div>
      }
    >
      <CaptureContent />
    </Suspense>
  );
}
function CaptureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timerParam = Number(searchParams.get("t"));
  const shotParam = Number(searchParams.get("s"));

  const cooldown = useMemo(() => {
    return [3, 5, 10].includes(timerParam) ? timerParam : 5;
  }, [timerParam]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [shotIndex, setShotIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [shots, setShots] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const handleCameraStateChange = ({ isMobile, currentCameraIndex }) => {
    setIsMobile(isMobile);
    setCurrentCameraIndex(currentCameraIndex);
  };

  // Function to start/switch camera
  async function startCamera(deviceId = null) {
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const constraints = {
        video: deviceId
          ? {
              deviceId: { exact: deviceId },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            }
          : {
              facingMode: "user",
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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

  // Start camera on mount
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      startCamera();
    }

    return () => {
      isMounted = false;

      // stop tracks
      const stream = streamRef.current;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  // Handle camera switch
  const handleCameraSwitch = (deviceId) => {
    setCurrentCameraId(deviceId);
    startCamera(deviceId);
  };

  // Capture a single frame -> returns blob URL
  function captureFrameUrl() {
    const video = videoRef.current;
    if (!video) return null;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;

    // Always 16:9 aspect ratio
    const targetAspect = 16 / 9;
    const currentAspect = w / h;

    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = w;
    let sourceHeight = h;

    // Crop top and bottom if camera is in portrait
    if (currentAspect < targetAspect) {
      sourceHeight = w / targetAspect;
      sourceY = (h - sourceHeight) / 2;
    } else if (currentAspect > targetAspect) {
      sourceWidth = h * targetAspect;
      sourceX = (w - sourceWidth) / 2;
    }

    // Create canvas with 16:9 aspect ratio
    const canvasWidth = 1920;
    const canvasHeight = 1080;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // mirror selfie so output matches preview
    if (!(isMobile && currentCameraIndex === 1)) {
      ctx.translate(canvasWidth, 0);
      ctx.scale(-1, 1);
    }

    // Draw the cropped portion of the video
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

  // Countdown helper
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

  async function startSession() {
    if (isRunning) return;
    setError(null);
    setIsRunning(true);

    // clear old shots
    shots.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setShots([]);
    setShotIndex(0);

    const captured = [];

    for (let i = 0; i < shotParam; i++) {
      setShotIndex(i);

      await runCountdown(cooldown);

      const dataUrl = await captureFrameUrl();
      if (!dataUrl) {
        setError("Failed to capture. Camera may not be ready.");
        setIsRunning(false);
        return;
      }

      captured.push(dataUrl);

      await new Promise((r) => setTimeout(r, 250));
    }

    sessionStorage.setItem("shots", JSON.stringify(captured));
    sessionStorage.setItem("cooldown", String(cooldown));

    setIsRunning(false);

    router.push("/check");
  }

  function resetAll() {
    shots.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
    setShots([]);
    setShotIndex(0);
    setCountdown(null);
    setIsRunning(false);
  }

  return (
    <>
      <div className="h-dvh overflow-hidden bg-[#FDFDF5]">
        <Border />
        <main className="flex flex-col overflow-y-auto lg:overflow-hidden xl:overflow-hidden overscroll-none justify-start h-full items-center p-10 sm:p-10 md:p-12 lg:p-24 pt-4 sm:pt-6 md:pt-0 lg:pt-30 bg-[#FDFDF5]">
          <div className="flex mt-15 lg:-mt-20 mb-5 text-center">
            <Image
              src="/smile_title.png"
              alt="Smile"
              width={240}
              height={60}
              className="mx-auto w-40"
            />
          </div>
          <CameraCapture
            videoRef={videoRef}
            countdown={countdown}
            shots={shots}
            shotParam={shotParam}
            shotIndex={shotIndex}
            cooldown={cooldown}
            isRunning={isRunning}
            error={error}
            onStartSession={startSession}
            onReset={resetAll}
            onCameraSwitch={handleCameraSwitch}
            onCameraStateChange={handleCameraStateChange}
          />
        </main>
      </div>
    </>
  );
}
