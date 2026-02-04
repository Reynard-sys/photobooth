"use client";

import Border from "../../components/border";
import Image from "next/image";
import TimerButton from "../../components/timerSelect";
import ShotButton from "../../components/shotSelect";
import { useState } from "react";
import Link from "next/link";

export default function SelectPage() {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [selectedShot, setSelectedShot] = useState(null);
  return (
    <>
      <Border />
      <main className="flex min-h-screen flex-col items-center p-15 sm:p-18 md:p-12 lg:p-24 pt-15 sm:pt-0 md:pt-0 lg:pt-30 bg-[#FDFDF5]">
        {/* Small Screen Size */}
        <div className="flex lg:hidden inset-0 items-center justify-center pointer-event-none z-10 mt-0 sm:mt-15 mb-8 md:mb-5">
          <Image
            src="/cute_booth.png"
            alt="Photobooth Small"
            width={600}
            height={300.948}
            priority
            className="pointer-events-auto w-[50vw] max-w-80 sm:max-w-70 md:max-w-80 h-auto"
          />
        </div>
        <div className="lg:hidden flex flex-col items-center gap-5 md:gap-3">
          {/* Timer Column */}
          <div>
            <Image
              src="/timer_asset.png"
              alt="Select Title"
              width={400}
              height={100}
              priority
              className="pointer-events-auto w-[35vw] sm:w-[40vw] max-w-80 sm:max-w-60 md:max-w-70 h-auto"
            />
          </div>
          {/* Timer Buttons */}
          <div className="flex flex-row gap-4">
            {/* 3 Seconds */}
            <TimerButton
              seconds={3}
              isSelected={selectedTimer === 3}
              onClick={() => setSelectedTimer(3)}
            />
            {/* 5 Seconds */}
            <TimerButton
              seconds={5}
              isSelected={selectedTimer === 5}
              onClick={() => setSelectedTimer(5)}
            />
            {/* 10 Seconds */}
            <TimerButton
              seconds={10}
              isSelected={selectedTimer === 10}
              onClick={() => setSelectedTimer(10)}
            />
          </div>

          {/* Shots Column */}
          <div>
            <Image
              src="/shots_asset.png"
              alt="Select Title"
              width={400}
              height={100}
              priority
              className="pointer-events-auto w-[25vw] sm:w-[30vw] max-w-60 sm:max-w-40 md:max-w-50 h-auto"
            />
          </div>
          <div className="flex flex-row gap-4">
            {/* 3 Shots */}
            <ShotButton
              shots={3}
              isSelected={selectedShot === 3}
              onClick={() => setSelectedShot(3)}
            />
            {/* 4 Shots */}
            <ShotButton
              shots={4}
              isSelected={selectedShot === 4}
              onClick={() => setSelectedShot(4)}
            />
          </div>

          {/* Next Button */}
          <Link
            href="/capture"
            className="relative inline-block group mt-5 sm:mt-10"
          >
            <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-1 sm:translate-x-2 translate-y-1 sm:translate-y-2 group-active:bg-[#F2AEBD] transition-colors"></div>
            <div className="relative bg-[#F2DDDC] border sm:border-2 border-[#3D568F] rounded-xl py-3 sm:py-3 md:py-4 px-8 sm:px-10 md:px-12 group-active:bg-[#3D568F] group-active:border-[#F2AEBD] transition-colors">
              <Image
                src="/next_button.png"
                alt="Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[15vw] sm:w-[14vw] md:w-[9vw] h-auto group-active:hidden"
              />
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
