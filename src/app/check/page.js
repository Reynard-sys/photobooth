"use client";

import { Suspense } from "react";
import Border from "../../components/border";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function RetakePage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-[#FDFDF5]">
          <p className="text-[#3D568F] font-bold animate-pulse">
            Loading shots...
          </p>
        </div>
      }
    >
      <RetakeContent />
    </Suspense>
  );
}

function RetakeContent() {
  const [shots, setShots] = useState([]);
  const searchParams = useSearchParams();
  const shotParam = Number(searchParams.get("s"));
  useEffect(() => {
    const stored = sessionStorage.getItem("shots");
    setShots(stored ? JSON.parse(stored) : []);
  }, []);
  return (
    <>
      <div className="h-dvh overflow-hidden bg-[#FDFDF5]">
        <Border />
        <main className="flex flex-col overflow-y-auto lg:overflow-hidden xl:overflow-hidden overscroll-none h-full justify-start w-full items-center p-10 sm:p-10 md:p-12 lg:p-24 pt-4 sm:pt-6 md:pt-0 lg:pt-30 xl:pt-20 bg-[#FDFDF5]">
          <div className="flex mt-5 md:mt-40 lg:-mt-15 xl:mt-0 mb-2 text-center">
            <Image
              src="/retake_asset.png"
              alt="Smile"
              width={240}
              height={60}
              className="mx-auto w-5vw lg:w-35 xl:w-70"
            />
          </div>
          <div
            className={`grid gap-4 ${
              shotParam === 3
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
            }`}
          >
            {shots.map((shot, index) => (
              <div
                key={index}
                className={`${
                  shotParam === 3 && index === 2
                    ? "md:col-span-2 flex justify-center xl:flex xl:justify-center lg:justify-center"
                    : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded border-4 border-[#F2AEBD] max-w-[calc(23vh*16/9)] lg:max-w-[calc(20vh*16/9)] xl:max-w-[calc(23vh*16/9)] ${shotParam === 3 && index === 2 ? "md:w-46 md:h-46" : ""}`}
                >
                  <img
                    className={`w-full ${
                      shotParam === 3 && index === 2 ? "md:w-1/2" : ""
                    }`}
                    src={shot}
                    alt={`Shot ${index + 1}`}
                  />
                  <Link
                    href={`/retake?i=${index}`}
                    className="absolute top-2 right-2 z-20 pointer-events-auto"
                  >
                    <Image
                      src="/redo_asset.png"
                      alt="Retake"
                      width={20}
                      height={20}
                      className="w-2vw"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/edit?s=${shotParam}`}
            className="relative inline-block group mt-5 mb-5"
          >
            <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-hover:bg-[#F2AEBD] transition-colors"></div>
            <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-3 lg:py-2 xl:py-5 px-30 xl:px-40 group-hover:bg-[#3D568F] group-hover:border-[#F2AEBD] transition-colors">
              <Image
                src="/next_button.png"
                alt="Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[10vw] max-w-15 lg:w-[4vw] xl:w-[3vw] h-auto group-hover:hidden"
              />
              <Image
                src="/hover_next.png"
                alt="Hovered Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[10vw] max-w-15 lg:w-[4vw] xl:w-[3vw] h-auto hidden group-hover:block"
              />
            </div>
          </Link>
        </main>
      </div>
    </>
  );
}
