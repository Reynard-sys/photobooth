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
        <div className="flex lg:hidden inset-0 items-center justify-center pointer-event-none z-10 mt-[5vw] mb-8">
          <Image
            src="/cute_booth.png"
            alt="Photobooth Small"
            width={600}
            height={300.948}
            priority
            className="pointer-events-auto w-[50vw] max-w-70 h-auto"
          />
        </div>
        <div className="lg:hidden flex flex-col items-center gap-5">
          {/* Timer Column */}
          <div>
            <Image
              src="/timer_asset.png"
              alt="Select Title"
              width={400}
              height={100}
              priority
              className="pointer-events-auto w-[40vw] max-w-60 h-auto"
            />
          </div>
          {/* Timer Buttons */}
          <div className="flex gap-6">
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
              className="pointer-events-auto w-[30vw] max-w-40 h-auto"
            />
          </div>
          <div className="flex gap-6">
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
            href={`/capture?t=${selectedTimer}&s=${selectedShot}`}
            className="relative inline-block group mt-10"
          >
            <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] transition-colors"></div>
            <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-3 px-10 group-active:bg-[#3D568F] group-active:border-[#F2AEBD] transition-colors">
              <Image
                src="/next_button.png"
                alt="Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[10vw] max-w-15 h-auto group-active:hidden"
              />
              <Image
                src="/hover_next.png"
                alt="Hovered Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[13vw] h-auto hidden group-active:block"
              />
            </div>
          </Link>
        </div>

        {/* Medium Screen Size */}
        <div className="hidden lg:flex xl:hidden fixed inset-y-0 left-25 items-center justify-center pointer-events-none z-10">
          <div className="lg:flex flex flex-col items-center gap-5 pointer-events-auto">
            {/* Timer Column */}
            <div>
              <Image
                src="/timer_asset.png"
                alt="Select Title"
                width={400}
                height={100}
                priority
                className="pointer-events-auto w-[35vw] max-w-200 h-auto"
              />
            </div>
            {/* Timer Buttons */}
            <div className="flex gap-7">
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
                className="pointer-events-auto w-[25vw] max-w-90 h-auto mt-15"
              />
            </div>
            <div className="flex gap-8">
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
            <Link href={`/capture?t=${selectedTimer}&s=${selectedShot}`} className="relative inline-block group mt-15">
              <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] transition-colors"></div>
              <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-7 px-18 group-active:bg-[#3D568F] group-active:border-[#F2AEBD] transition-colors">
                <Image
                  src="/next_button.png"
                  alt="Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none w-[6vw] h-auto group-hover:hidden"
                />
                <Image
                  src="/hover_next.png"
                  alt="Hovered Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto w-[6vw] h-auto hidden group-hover:block"
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex xl:hidden fixed inset-y-0 right-[calc(4.5vw+1rem)] items-center justify-center pointer-events-none z-10">
          <Image
            src="/cute_booth.png"
            alt="Photobooth Large"
            width={554.039}
            height={621.22}
            priority
            className="pointer-events-auto w-[40vw] max-w-120 h-auto"
          />
        </div>

        {/* Large Screen Size */}
        <div className="hidden xl:flex fixed inset-y-0 left-30 xl:left-[calc(7vw+2rem)] items-center justify-center pointer-events-none z-10">
          <div className="flex flex-col items-center gap-2 pointer-events-auto">
            {/* Timer Column */}
            <div>
              <Image
                src="/timer_asset.png"
                alt="Select Title"
                width={400}
                height={100}
                priority
                className="pointer-events-auto w-[35vw] max-w-140 h-auto"
              />
            </div>
            {/* Timer Buttons */}
            <div className="flex gap-9">
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
                className="pointer-events-auto w-[25vw] max-w-95 h-auto mt-15"
              />
            </div>
            <div className="flex gap-9">
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
            <Link href={`/capture?t=${selectedTimer}&s=${selectedShot}`} className="relative inline-block group mt-20">
              <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-hover:bg-[#F2AEBD] transition-colors"></div>
              <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-7 px-20 group-hover:bg-[#3D568F] group-hover:border-[#F2AEBD] transition-colors">
                <Image
                  src="/next_button.png"
                  alt="Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-none w-[6vw] h-auto group-hover:hidden"
                />
                <Image
                  src="/hover_next.png"
                  alt="Hovered Next Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto w-[6vw] h-auto hidden group-hover:block"
                />
              </div>
            </Link>
          </div>
        </div>
        <div className="hidden xl:flex fixed inset-y-0 right-[calc(7vw+2rem)] items-center justify-center pointer-events-none z-10">
          <Image
            src="/cute_booth.png"
            alt="Photobooth Large"
            width={554.039}
            height={621.22}
            priority
            className="pointer-events-auto w-[40vw] max-w-[calc(20vw+15rem)] h-auto"
          />
        </div>
      </main>
    </>
  );
}
