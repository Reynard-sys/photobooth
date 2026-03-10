"use client";

import { Suspense } from "react";
import Border from "../../components/border";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CameraRetake from "../../components/retakeCamera";
import Link from "next/link";
import { useCamera } from "@/lib/hooks/useCamera";

export default function RetakePage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-[#FDFDF5]">
          <p className="text-[#3D568F] font-bold animate-pulse">Loading shots...</p>
        </div>
      }
    >
      <RetakeContent />
    </Suspense>
  );
}

function RetakeContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const indexParam   = Number(searchParams.get("i"));

  const [cooldown,     setCooldown]     = useState(5);
  const [countdown,    setCountdown]    = useState(null);
  const [isRunning,    setIsRunning]    = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);
  const [cameraIndex,  setCameraIndex]  = useState(0);

  const { videoRef, startCamera, captureFrameUrl, error, setError } = useCamera();

  const index = useMemo(
    () => (Number.isFinite(indexParam) ? indexParam : -1),
    [indexParam],
  );

  useEffect(() => {
    const t = Number(sessionStorage.getItem("cooldown"));
    if ([3, 5, 10].includes(t)) setCooldown(t);
  }, []);

  const handleCameraSwitch       = (deviceId) => startCamera(deviceId);
  const handleCameraStateChange  = ({ isMobile: mob, currentCameraIndex: idx }) => {
    setIsMobile(mob);
    setCameraIndex(idx);
  };

  function runCountdown(seconds) {
    return new Promise((resolve) => {
      setCountdown(seconds);
      let t = seconds;
      const id = setInterval(() => {
        t -= 1;
        if (t <= 0) { clearInterval(id); setCountdown(null); resolve(); }
        else { setCountdown(t); }
      }, 1000);
    });
  }

  async function saveRetake() {
    setError(null);
    if (isRunning) return;
    setIsRunning(true);

    await runCountdown(cooldown);

    const dataUrl = captureFrameUrl({ isMobile, cameraIndex });
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
          <CameraRetake
            videoRef={videoRef}
            countdown={countdown}
            shotIndex={index}
            cooldown={cooldown}
            isRunning={isRunning}
            error={error}
            onCapture={saveRetake}
            onCancel={() => router.push("/check")}
            onCameraSwitch={handleCameraSwitch}
            onCameraStateChange={handleCameraStateChange}
          />
          <Link href="/check">
            <div className="absolute top-10 left-10 lg:top-15 lg:left-15 z-10 w-[5vw] lg:w-[3vw]">
              <Image src="/images/ui/back_page.webp" alt="Back" width={500} height={500} className="w-full h-auto object-contain" />
            </div>
          </Link>
        </main>
      </div>
    </>
  );
}
