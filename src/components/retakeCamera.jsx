"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function CameraRetake({
  videoRef,
  countdown,
  shotIndex,
  cooldown,
  isRunning,
  error,
  onCapture,
  onCancel,
  onCameraSwitch,
  onCameraStateChange,
}) {
  const [availableCameras, setAvailableCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );
        setAvailableCameras(videoDevices);
      } catch (err) {
        console.error("Error getting cameras:", err);
      }
    };

    getCameras();
  }, []);

  useEffect(() => {
    if (onCameraStateChange) {
      onCameraStateChange({ isMobile, currentCameraIndex });
    }
  }, [isMobile, currentCameraIndex, onCameraStateChange]);

  const handleCameraSwitch = () => {
    if (availableCameras.length <= 1) return;

    let nextIndex;
    if (isMobile) {
      nextIndex = currentCameraIndex === 0 ? 1 : 0;
    } else {
      nextIndex = (currentCameraIndex + 1) % availableCameras.length;
    }

    setCurrentCameraIndex(nextIndex);

    if (onCameraSwitch) {
      onCameraSwitch(availableCameras[nextIndex].deviceId);
    }
  };

  const getCameraButtonText = () => {
    if (isMobile) {
      return currentCameraIndex === 0 ? "Front Cam" : "Back Cam";
    }
    return `Camera ${currentCameraIndex + 1}`;
  };

  return (
    <>
      <div className="flex flex-col max-w-6xl lg:max-w-4xl xl:max-w-4xl w-full">
        {/* Video container */}
        <div className="border-10 border-[#F2AEBD] rounded-md p-6 sm:p-10 md:p-12 lg:p-20 xl:p-10 mt-0 bg-[#F2DDDC] w-full relative aspect-video overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            style={
              isMobile && currentCameraIndex === 1
                ? {}
                : { transform: "scaleX(-1)" }
            }
            autoPlay
            playsInline
            muted
          />

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
              <div className="text-white text-7xl font-extrabold">
                {countdown}
              </div>
            </div>
          )}
        </div>

        {/* Shot info */}

        {/* Bottom info bar - Shot progress (left) and Camera switch (right) */}
        <div className="mt-2 flex justify-between items-center">
          {/* Shot progress - Left */}
          <div className="bg-[#F2AEBD] text-white text-sm px-2 py-1 rounded">
            Retaking Shot {shotIndex + 1}
            {" • "}
            Timer: {cooldown}s
          </div>

          {/* Camera Switch Button - Right */}
          {availableCameras.length > 1 && (
            <button
              onClick={handleCameraSwitch}
              disabled={isRunning}
              className="bg-[#F2AEBD] hover:bg-[#F2AEBD] active:bg-[#F2AEBD] text-white px-3 py-1 rounded font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getCameraButtonText()}
            </button>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-5 mt-5">
        {/* Capture Button */}
        <button
          className="group relative"
          onClick={onCapture}
          disabled={isRunning}
        >
          <div
            className={`absolute inset-0 rounded-xl translate-x-1 sm:translate-x-2 lg:translate-x-2 translate-y-1 sm:translate-y-2 lg:translate-y-2 transition-colors ${
              isRunning
                ? "bg-[#F2AEBD]"
                : "bg-[#3D568F] group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD]"
            }`}
          ></div>
          <div
            className={`relative border-2 rounded-xl py-3 sm:py-5 md:py-5 xl:py-6 px-20 sm:px-20 md:px-20 lg:px-20 xl:px-20 transition-colors flex items-center justify-center ${
              isRunning
                ? "bg-[#3D568F] border-[#F2AEBD]"
                : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]"
            }`}
          >
            {isRunning ? (
              <Image
                src="/capturing_asset.png"
                alt="Capturing"
                width={200}
                height={15}
                className="w-[30vw] sm:w-[30vw] md:w-[20vw] lg:w-[10vw] xl:w-[10vw] h-auto"
              />
            ) : (
              <>
                <Image
                  src="/retake_button.png"
                  alt="Capture Retake"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none w-[15vw] sm:w-[10vw] md:w-[10vw] lg:w-[10vw] xl:w-[8vw] h-auto group-active:hidden xl:group-hover:hidden"
                />
                <Image
                  src="/hover_retake_button.png"
                  alt="Hovered Retake Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none w-[15vw] sm:w-[10vw] md:w-[10vw] lg:w-[10vw] xl:w-[8vw] h-auto hidden group-active:block xl:group-hover:block"
                />
              </>
            )}
          </div>
        </button>
      </div>
    </>
  );
}
