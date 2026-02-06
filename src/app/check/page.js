"use client";

import Border from "../../components/border";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function RetakePage() {
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
          <div className="flex mt-5 md:mt-40 lg:mt-5 xl:mt-0 mb-2 text-center">
            <Image
              src="/retake_asset.png"
              alt="Smile"
              width={240}
              height={60}
              className="mx-auto w-5wv"
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
                  className={`relative overflow-hidden rounded border-4 border-[#F2AEBD] w-10vw h-auto sm:w-2vw md:w-9vw xl:w-150 max-w-70 sm:max-w-120 md:max-w-120 xl:max-w-130 ${shotParam === 3 && index === 2 ? "md:w-46 md:h-46" : ""}`}
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
                    className="absolute top-2 right-2 z-20"
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
            href={`/stripSelect?s=${shotParam}`}
            className="relative inline-block group mt-5 mb-5"
          >
            <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 xl:translate-x-3 translate-y-2 xl:translate-y-3 group-active:bg-[#F2AEBD] transition-colors"></div>
            <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-3 xl:py-10 px-10 xl:px-40 group-active:bg-[#3D568F] group-active:border-[#F2AEBD] transition-colors">
              <Image
                src="/next_button.png"
                alt="Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[10vw] max-w-15 xl:max-w-30 h-auto group-active:hidden"
              />
              <Image
                src="/hover_next.png"
                alt="Hovered Next Button"
                width={200}
                height={15}
                priority
                className="pointer-events-none w-[10vw] max-w-15 xl:max-w-30 h-auto hidden group-active:block"
              />
            </div>
          </Link>
        </main>
      </div>
    </>
  );
}
