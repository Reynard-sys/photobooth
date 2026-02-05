"use client";

import Link from "next/link";
import Image from "next/image";

export default function CameraCapture({
  videoRef,
  countdown,
  shots,
  shotParam,
  shotIndex,
  cooldown,
  isRunning,
  error,
  onStartSession,
  onReset,
}) {
  return (
    <>
      <div className="flex flex-col max-w-6xl lg:max-w-4xl xl:max-w-4xl w-full">
        {/* Video container */}
        <div className="border-10 border-[#F2AEBD] rounded-md p-6 sm:p-10 md:p-12 lg:p-20 xl:p-10 mt-0 bg-[#F2DDDC] w-full relative aspect-video overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
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

        {/* Shot progress */}
        <div className="mt-2 bg-[#F2AEBD] text-white text-sm px-2 py-1 rounded w-fit">
          {shotIndex < shotParam
            ? `Shot ${shotIndex + 1} of ${shotParam}`
            : `Done`}
          {" • "}
          Timer: {cooldown}s
        </div>
      </div>

      {/* Start Button */}
      <div className="flex flex-col gap-10 mt-10">
        <button
          className="group relative"
          onClick={onStartSession}
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
            className={`relative border-2 sm:border-2 rounded-xl py-3 sm:py-5 md:py-5 xl:py-6 px-8 sm:px-12 lg:px-12 md:px-12 transition-colors ${
              isRunning
                ? "bg-[#3D568F] border-[#F2AEBD]"
                : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]"
            }`}
          >
            {isRunning ? (
              <Image
                src={`/capturing_asset.png`}
                alt="Capturing"
                width={200}
                height={15}
                className="w-[30vw] sm:w-[30vw] md:w-[20vw] lg:w-[10vw] xl:w-[10vw] h-auto"
              />
            ) : (
              <>
                <Image
                  src={`/start_${shotParam}s.png`}
                  alt="Start Session"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none w-[50vw] sm:w-[50vw] md:w-[50vw] lg:w-[20vw] xl:w-[15vw] h-auto group-active:hidden xl:group-hover:hidden"
                />
                <Image
                  src={`/hover_start_${shotParam}s.png`}
                  alt={`Hovered ${shotParam} Seconds Button`}
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none w-[50vw] sm:w-[50vw] md:w-[50vw] lg:w-[2vw] xl:w-[15vw] h-auto hidden group-active:block xl:group-hover:block"
                />
              </>
            )}
          </div>
        </button>
      </div>

      {error && (
        <p className="max-w-md text-sm text-red-600 text-center">{error}</p>
      )}
    </>
  );
}
