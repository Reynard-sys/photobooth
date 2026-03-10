"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import PhotoStrip from "../../components/photostrip";
import StripSelect from "../../components/stripSelect";
import Border from "../../components/border";
import Image from "next/image";
import Link from "next/link";
import "instagram.css";
import FilterSelect from "../../components/filterSelect";
import { getFilterClass, applyCSSFilterToCanvas, loadAndFilterImage } from "@/lib/utils/filters";
import { usePreloadImages } from "@/lib/hooks/usePreloadImages";
import { PRELOADS } from "@/lib/constants";

export default function FinalExportPage() {
  const stripRef = useRef(null);
  const [shots,           setShots]           = useState([]);
  const [isExporting,     setIsExporting]     = useState(false);
  const [template,        setTemplate]        = useState("Frame1");
  const [selectedFilter,  setSelectedFilter]  = useState("none");
  const [currentScale,    setCurrentScale]    = useState(1);

  // Preload download-page assets while user edits
  usePreloadImages(PRELOADS.edit);

  useEffect(() => {
    const stored = sessionStorage.getItem("shots");
    if (stored) setShots(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const calculateScale = () => {
      if (typeof window === "undefined") return;
      const canvasHeight = shots.length === 4 ? 3600 : 2800;
      const maxWidth  = window.innerWidth  - 64;
      const maxHeight = window.innerHeight * 0.7;
      setCurrentScale(Math.min(maxWidth / 1200, maxHeight / canvasHeight, 1));
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [shots.length]);

  const canvasHeight = shots.length === 4 ? 3600 : 2800;

  return (
    <>
      <div className="h-dvh overflow-hidden bg-[#FDFDF5]">
        <Border />
        <div className="flex flex-col h-full overflow-y-auto lg:overflow-hidden xl:overflow-hidden overscroll-none bg-[#FDFDF5] items-center py-10 px-4">

          {/* Small Screen Size */}
          <div className="w-full lg:hidden max-w-6xl flex flex-col items-center">
            <Image src="/images/ui/strips_title.webp" alt="Strips" width={200} height={60} className="w-0.5vw" />
            <StripSelect selectedStrip={template} onSelectStrip={setTemplate} />
            <Image src="/images/ui/filters_title.webp" alt="Filters" width={200} height={60} className="w-0.5vw mt-5" />
            <div className="w-full">
              <FilterSelect selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
            </div>

            {/* Preview */}
            <div className="w-full flex flex-col items-center mt-8">
              <div
                className="relative overflow-hidden bg-white"
                style={{
                  width:  isExporting ? "1200px" : `${1200 * currentScale}px`,
                  height: isExporting ? `${canvasHeight}px` : `${canvasHeight * currentScale}px`,
                }}
              >
                <div style={{ transform: isExporting ? "none" : `scale(${currentScale})`, transformOrigin: "top left" }}>
                  <PhotoStrip ref={stripRef} shots={shots} template={template} isExporting={isExporting} filterClass={getFilterClass(selectedFilter)} />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 mb-20 flex flex-col items-center gap-6">
              <Link href={`/download?template=${template}&filter=${selectedFilter}`} className="relative inline-block group">
                <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors" />
                <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[60vw] h-[12vw] md:w-[35vw] md:h-[7vw] py-1 max-w-90 max-h-40 sm:max-h-18">
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image src="/images/ui/next_button.webp"  alt="Next"        width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
                    <Image src="/images/ui/hover_next.webp"   alt="Next (hover)" width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
                  </div>
                </div>
              </Link>
              <Link href="/check" className="relative inline-block group mt-5 mb-5">
                <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors" />
                <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[60vw] h-[12vw] md:w-[35vw] md:h-[7vw] py-1 max-w-90 max-h-40 sm:max-h-18">
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image src="/images/ui/retake_button.webp"        alt="Retake"        width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
                    <Image src="/images/ui/hover_retake_button.webp"  alt="Retake (hover)" width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Medium and Large Screen Size */}
          <div className="hidden lg:flex w-full items-center justify-between">
            {/* Preview — Left Side */}
            <div className="flex flex-col items-center justify-center shrink-0 ml-70 lg:ml-40 xl:ml-50 mb-0 lg:mb-15 xl:mb-10 2xl:mb-0">
              <div
                className="relative overflow-hidden bg-white"
                style={{
                  width:  isExporting ? "1200px" : `${1200 * currentScale}px`,
                  height: isExporting ? `${canvasHeight}px` : `${canvasHeight * currentScale}px`,
                }}
              >
                <div style={{ transform: isExporting ? "none" : `scale(${currentScale})`, transformOrigin: "top left" }}>
                  <PhotoStrip ref={stripRef} shots={shots} template={template} isExporting={isExporting} filterClass={getFilterClass(selectedFilter)} />
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-center justify-center ml-8 xl:ml-16 mr-0 xl:mr-20 2xl:mr-30">
              <Image src="/images/ui/strips_title.webp"  alt="Strips"  width={240} height={60} className="w-47 lg:w-30 xl:w-47 mt-0 2xl:mt-10" />
              <StripSelect selectedStrip={template} onSelectStrip={setTemplate} />
              <Image src="/images/ui/filters_title.webp" alt="Filters" width={300} height={60} className="w-50 lg:w-30 xl:w-47 mt-10 lg:mt-2 xl:mt-0 2xl:mt-10" />
              <div className="mt-6 lg:mt-0 xl:mt-0 w-full">
                <FilterSelect selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
              </div>

              <div className="mt-10 lg:mt-5 xl:mt-6 2xl:mt-10 mb-20 flex flex-col items-center gap-6 lg:gap-4 xl:gap-6">
                <Link href={`/download?template=${template}&filter=${selectedFilter}`} className="relative inline-block group">
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors" />
                  <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[35vw] h-[7vw] lg:w-[22vw] lg:h-[3.2vw] xl:w-[26vw] xl:h-[4vw] 2xl:w-[20vw] 2xl:h-[4vw] py-4.5 lg:py-0 xl:py-2">
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image src="/images/ui/next_button.webp"  alt="Next"         width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
                      <Image src="/images/ui/hover_next.webp"   alt="Next (hover)"  width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
                    </div>
                  </div>
                </Link>
                <Link href="/check" className="relative inline-block group mt-0 mb-5">
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors" />
                  <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[35vw] h-[7vw] lg:w-[22vw] lg:h-[3.2vw] xl:w-[26vw] xl:h-[4vw] 2xl:w-[20vw] 2xl:h-[4vw] py-4.5 lg:py-0 xl:py-2">
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image src="/images/ui/retake_button.webp"       alt="Retake"        width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
                      <Image src="/images/ui/hover_retake_button.webp" alt="Retake (hover)" width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
