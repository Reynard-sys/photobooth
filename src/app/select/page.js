"use client";

import Border from "../../components/border";
import Image from "next/image";
import TimerButton from "../../components/timerSelect";
import ShotButton from "../../components/shotSelect";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePhotoboothStore } from "../../lib/store";
import { useEffect } from "react";

export default function SelectPage() {
  const router = useRouter();
  const { timer, shotCount, setTimer, setShotCount } = usePhotoboothStore();

  const canProceed = timer !== null && shotCount !== null;

  const handleNext = () => {
    if (!canProceed) return;
    router.push("/capture");
  };

  return (
    <>
      <Border />
      <main className="flex min-h-screen flex-col items-center p-15 sm:p-18 md:p-12 lg:p-24 pt-15 sm:pt-0 md:pt-0 lg:pt-30 bg-[#FDFDF5]">
        {/* Small Screen Size */}
        <div className="flex lg:hidden inset-0 items-center justify-center pointer-event-none z-10 mt-[5vw] mb-8">
          <Image
            src="/webp-cute-booth.webp"
            alt="Photobooth Small"
            width={600}
            height={300.948}
            priority
            className="pointer-events-auto w-[50vw] max-w-70 h-auto"
          />
        </div>
        <div className="lg:hidden flex flex-col items-center gap-3">
          {/* Timer Column */}
          <div>
            <Image
              src="/webp-timer-asset.webp"
              alt="Select Title"
              width={400}
              height={100}
              priority
              className="pointer-events-auto w-[40vw] max-w-60 h-auto"
            />
          </div>
          {/* Timer Buttons */}
          <div className="flex gap-4">
            <TimerButton
              seconds={3}
              isSelected={timer === 3}
              onClick={() => setTimer(3)}
            />
            <TimerButton
              seconds={5}
              isSelected={timer === 5}
              onClick={() => setTimer(5)}
            />
            <TimerButton
              seconds={10}
              isSelected={timer === 10}
              onClick={() => setTimer(10)}
            />
          </div>

          {/* Shots Column */}
          <div>
            <Image
              src="/webp-shots-asset.webp"
              alt="Select Title"
              width={400}
              height={100}
              priority
              className="pointer-events-auto w-[30vw] max-w-40 h-auto mt-2"
            />
          </div>
          <div className="flex gap-4">
            <ShotButton
              shots={3}
              isSelected={shotCount === 3}
              onClick={() => setShotCount(3)}
            />
            <ShotButton
              shots={4}
              isSelected={shotCount === 4}
              onClick={() => setShotCount(4)}
            />
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="relative inline-block group mt-5 disabled:opacity-40"
          >
            <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] transition-colors"></div>
            <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-4 px-10 group-active:bg-[#3D568F] group-active:border-[#F2AEBD] transition-colors">
              <Image
                src="/webp-next-button.webp"
                alt="Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[8vw] max-w-15 h-auto group-active:hidden"
              />
              <Image
                src="/webp-hover-next.webp"
                alt="Hovered Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[8vw] max-w-15 h-auto hidden group-active:block"
              />
            </div>
          </button>
        </div>

        {/* Medium Screen Size */}
        <div className="hidden lg:flex xl:hidden fixed inset-y-0 left-35 items-center justify-center pointer-events-none z-10">
          <div className="lg:flex flex flex-col items-center gap-2 pointer-events-auto">
            {/* Timer Column */}
            <div>
              <Image
                src="/webp-timer-asset.webp"
                alt="Select Title"
                width={400}
                height={100}
                priority
                className="pointer-events-auto w-[20vw] max-w-200 h-auto"
              />
            </div>
            {/* Timer Buttons */}
            <div className="flex gap-7">
              <TimerButton
                seconds={3}
                isSelected={timer === 3}
                onClick={() => setTimer(3)}
              />
              <TimerButton
                seconds={5}
                isSelected={timer === 5}
                onClick={() => setTimer(5)}
              />
              <TimerButton
                seconds={10}
                isSelected={timer === 10}
                onClick={() => setTimer(10)}
              />
            </div>

            {/* Shots Column */}
            <div>
              <Image
                src="/webp-shots-asset.webp"
                alt="Select Title"
                width={400}
                height={100}
                priority
                className="pointer-events-auto w-[13vw] max-w-90 h-auto mt-5"
              />
            </div>
            <div className="flex gap-8">
              <ShotButton
                shots={3}
                isSelected={shotCount === 3}
                onClick={() => setShotCount(3)}
              />
              <ShotButton
                shots={4}
                isSelected={shotCount === 4}
                onClick={() => setShotCount(4)}
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className="relative inline-block group mt-10 disabled:opacity-40"
            >
              <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-hover:bg-[#F2AEBD] transition-colors"></div>
              <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-5 px-13 group-hover:bg-[#3D568F] group-hover:border-[#F2AEBD] transition-colors">
                <Image
                  src="/webp-next-button.webp"
                  alt="Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none w-[4vw] h-auto group-hover:hidden"
                />
                <Image
                  src="/webp-hover-next.webp"
                  alt="Hovered Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto w-[4vw] h-auto hidden group-hover:block"
                />
              </div>
            </button>
          </div>
        </div>
        <div className="hidden lg:flex xl:hidden fixed inset-y-0 right-[calc(5vw+5rem)] items-center justify-center pointer-events-none z-10">
          <Image
            src="/webp-cute-booth.webp"
            alt="Photobooth Large"
            width={554.039}
            height={621.22}
            priority
            className="pointer-events-auto w-[30vw] max-w-120 h-auto"
          />
        </div>

        {/* Large Screen Size */}
        <div className="hidden xl:flex fixed top-[5vh] bottom-[9vh] left-30 xl:left-[calc(7vw+2rem)] items-center justify-center pointer-events-none z-10">
          <div
            className="flex flex-col items-center pointer-events-auto"
            style={{ gap: "clamp(0.5rem, 1vh, 2rem)" }}
          >
            {/* Timer Column */}
            <div>
              <Image
                src="/webp-timer-asset.webp"
                alt="Select Title"
                width={400}
                height={100}
                priority
                className="pointer-events-auto h-auto"
                style={{ width: "clamp(8rem, 35vw, 35rem)" }}
              />
            </div>
            {/* Timer Buttons */}
            <div className="flex gap-5">
              <TimerButton
                seconds={3}
                isSelected={timer === 3}
                onClick={() => setTimer(3)}
              />
              <TimerButton
                seconds={5}
                isSelected={timer === 5}
                onClick={() => setTimer(5)}
              />
              <TimerButton
                seconds={10}
                isSelected={timer === 10}
                onClick={() => setTimer(10)}
              />
            </div>

            {/* Shots Column */}
            <div>
              <Image
                src="/webp-shots-asset.webp"
                alt="Select Title"
                width={400}
                height={100}
                priority
                className="pointer-events-auto h-auto"
                style={{ width: "clamp(6rem, 25vw, 23.75rem)" }}
              />
            </div>
            <div className="flex gap-5">
              <ShotButton
                shots={3}
                isSelected={shotCount === 3}
                onClick={() => setShotCount(3)}
              />
              <ShotButton
                shots={4}
                isSelected={shotCount === 4}
                onClick={() => setShotCount(4)}
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed}
              className="relative inline-block group disabled:opacity-40"
              style={{ marginTop: "clamp(2rem, 4vh, 5rem)" }}
            >
              <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-hover:bg-[#F2AEBD] transition-colors"></div>
              <div className="relative px-12 py-5 bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl group-hover:bg-[#3D568F] group-hover:border-[#F2AEBD] transition-colors">
                <Image
                  src="/webp-next-button.webp"
                  alt="Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none h-auto group-hover:hidden"
                  style={{ width: "clamp(4rem, 5vw, 10rem)" }}
                />
                <Image
                  src="/webp-hover-next.webp"
                  alt="Hovered Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto h-auto hidden group-hover:block"
                  style={{ width: "clamp(4rem, 5vw, 10rem)" }}
                />
              </div>
            </button>
          </div>
        </div>
        <div className="hidden xl:flex fixed top-[5vh] bottom-[5vh] right-[calc(7vw+2rem)] items-center justify-center pointer-events-none z-10">
          <Image
            src="/webp-cute-booth.webp"
            alt="Photobooth Large"
            width={554.039}
            height={621.22}
            priority
            className="pointer-events-auto w-auto max-h-[68vh]"
          />
        </div>
        <Link href="/">
          <div className="absolute top-10 left-10 lg:top-15 lg:left-15 z-10 w-[5vw] lg:w-[3vw]">
            <Image
              src="/webp-back-page.webp"
              alt="Bottom Left Decoration"
              width={500}
              height={500}
              className="w-full h-auto object-contain"
            />
          </div>
        </Link>
      </main>
    </>
  );
}
