"use client";

import Border from "../../components/border";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CameraCapture from "../../components/camera";
import { Suspense } from "react";
import { useCamera } from "@/lib/hooks/useCamera";
import { usePreloadImages } from "@/lib/hooks/usePreloadImages";
import { PRELOADS } from "@/lib/constants";

export default function CapturePage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-[#FDFDF5]">
          <p className="text-[#3D568F] font-bold animate-pulse">Initializing Camera...</p>
        </div>
      }
    >
      <CaptureContent />
    </Suspense>
  );
}

function CaptureContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const timerParam = Number(searchParams.get("t"));
  const shotParam  = Number(searchParams.get("s"));

  const cooldown = useMemo(
    () => ([3, 5, 10].includes(timerParam) ? timerParam : 5),
    [timerParam],
  );

  const { videoRef, startCamera, captureFrameUrl, error, setError } = useCamera();

  const [countdown,  setCountdown]  = useState(null);
  const [shotIndex,  setShotIndex]  = useState(0);
  const [isRunning,  setIsRunning]  = useState(false);
  const [shots,      setShots]      = useState([]);
  const [isMobile,   setIsMobile]   = useState(false);
  const [cameraIndex, setCameraIndex] = useState(0);

  // Preload check-page assets while user is in the capture session
  usePreloadImages(PRELOADS.capture);

  const handleCameraStateChange = ({ isMobile: mob, currentCameraIndex: idx }) => {
    setIsMobile(mob);
    setCameraIndex(idx);
  };

  const handleCameraSwitch = (deviceId) => startCamera(deviceId);

  function runCountdown(seconds) {
    return new Promise((resolve) => {
      setCountdown(seconds);
      let t = seconds;
      const id = setInterval(() => {
        t -= 1;
        if (t <= 0) { clearInterval(id); setCountdown(null); resolve(); }
        else         { setCountdown(t); }
      }, 1000);
    });
  }

  async function startSession() {
    if (isRunning) return;
    setError(null);
    setIsRunning(true);
    shots.forEach((url) => { if (url.startsWith("blob:")) URL.revokeObjectURL(url); });
    setShots([]);
    setShotIndex(0);

    const captured = [];
    for (let i = 0; i < shotParam; i++) {
      setShotIndex(i);
      await runCountdown(cooldown);
      const dataUrl = captureFrameUrl({ isMobile, cameraIndex });
      if (!dataUrl) { setError("Failed to capture. Camera may not be ready."); setIsRunning(false); return; }
      captured.push(dataUrl);
      await new Promise((r) => setTimeout(r, 250));
    }

    sessionStorage.setItem("shots",   JSON.stringify(captured));
    sessionStorage.setItem("cooldown", String(cooldown));
    setIsRunning(false);
    router.push("/check");
  }

  function resetAll() {
    shots.forEach((url) => { if (url.startsWith("blob:")) URL.revokeObjectURL(url); });
    setShots([]); setShotIndex(0); setCountdown(null); setIsRunning(false);
  }

  return (
    <>
      <div className="h-dvh overflow-hidden bg-[#FDFDF5]">
        <Border />
        <main className="flex flex-col overflow-y-auto lg:overflow-hidden xl:overflow-hidden overscroll-none justify-start h-full items-center p-10 sm:p-10 md:p-12 lg:p-24 xl:p-10 pt-4 sm:pt-6 md:pt-0 lg:pt-30 bg-[#FDFDF5]">
          <div className="flex mt-15 lg:-mt-20 xl:mt-0 mb-5 lg:mb-0 xl:mb-5 text-center">
            <Image
              src="/images/ui/smile_title.webp"
              alt="Smile"
              width={240}
              height={60}
              priority
              className="mx-auto w-40 lg:w-30 xl:w-40"
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
          <Link href="/select">
            <div className="absolute top-10 left-10 lg:top-15 lg:left-15 z-10 w-[5vw] lg:w-[3vw]">
              <Image src="/images/ui/back_page.webp" alt="Back" width={500} height={500} className="w-full h-auto object-contain" />
            </div>
          </Link>
        </main>
      </div>
    </>
  );
}
