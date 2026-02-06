"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import PhotoStripComposite from "../../components/photostrip3";
import StripSelect from "../../components/stripSelect";
import Border from "../../components/border";
import Image from "next/image";
import Link from "next/link";
import "instagram.css";
import FilterSelect from "../../components/filterSelect";

const getInitialScale = () => {
  if (typeof window === "undefined") return 1;

  const maxWidth = window.innerWidth - 64;
  const maxHeight = window.innerHeight * 0.7;
  const scaleW = maxWidth / 1200;
  const scaleH = maxHeight / 2800;
  return Math.min(scaleW, scaleH, 1);
};

export default function FinalExportPage() {
  const stripRef = useRef(null);
  const [shots, setShots] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [template, setTemplate] = useState("Frame1");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [currentScale, setCurrentScale] = useState(getInitialScale());

  // 1. Sync photos and calculate the preview scale
  useEffect(() => {
    const stored = sessionStorage.getItem("shots");
    if (stored) setShots(JSON.parse(stored));

    const updateScale = () => {
      const maxWidth = window.innerWidth - 64;
      const maxHeight = window.innerHeight * 0.7;
      const scaleW = maxWidth / 1200;
      const scaleH = maxHeight / 2800;
      setCurrentScale(Math.min(scaleW, scaleH, 1));
    };

    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Handler for strip selection
  const handleSelectStrip = (stripId) => {
    setTemplate(stripId);
  };

  const handleSelectFilter = (filterId) => {
    setSelectedFilter(filterId);
  };

  const getFilterClass = () => {
    switch (selectedFilter) {
      case "aden":
        return "filter-aden";
      case "inkwell":
        return "filter-inkwell";
      case "perpetua":
        return "filter-perpetua";
      case "crema":
        return "filter-crema";
      case "sutro":
        return "filter-sutro";
      default:
        return "";
    }
  };

  // 2. High-Resolution Download Logic
  const downloadPhotoStrip = async () => {
    if (!stripRef.current || shots.length === 0) return;

    try {
      // Clone the element to capture it off-screen without affecting the visible one
      const original = stripRef.current;
      const clone = original.cloneNode(true);

      // Position clone off-screen at full size
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "-9999px";
      clone.style.width = "1200px";
      clone.style.height = "2800px";
      clone.style.transform = "none";

      document.body.appendChild(clone);

      // Wait for images to load in the clone
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: 2800,
        removeContainer: true,
      });

      // Remove clone immediately after capture
      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL("image/png", 1.0);

      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent,
      );
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isSafari || isIOS) {
        const newTab = window.open();
        newTab.document.body.innerHTML = `<img src="${dataUrl}" style="width:100%" />`;
        newTab.document.title = "Save your Photo Strip";
      } else {
        const link = document.createElement("a");
        link.download = `photostrip-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      await uploadToDrive(dataUrl);
    } catch (error) {
      console.error("Safari Download Error:", error);
      alert("Could not generate image. Try a different browser or clear tabs.");
    }
  };

  const uploadToDrive = async (dataUrl) => {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `photostrip-${Date.now()}.png`, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("file", file);

      const DRIVE_UPLOAD_URL =
        "https://drive.google.com/drive/folders/1VErtKAEBXAgWeieZQzHwyyfHfLSlJCft?usp=sharing";

      await fetch(DRIVE_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      console.log("Successfully backed up to Drive");
    } catch (error) {
      console.error("Drive backup failed:", error);
    }
  };

  return (
    <>
      <div className="h-dvh overflow-hidden bg-[#FDFDF5]">
        <Border />
        <div className="flex flex-col h-full overflow-y-auto lg:overflow-hidden xl:overflow-hidden overscroll-none bg-[#FDFDF5] items-center py-10 px-4">
          {/* Small Screen Size */}
          <div className="w-full lg:hidden max-w-6xl flex flex-col items-center">
            <Image
              src="/strips_title.png"
              alt="Smile"
              width={200}
              height={60}
              className="w-0.5vw"
            />
            {/* Strip Selection Buttons */}
            <StripSelect
              selectedStrip={template}
              onSelectStrip={handleSelectStrip}
            />
            <Image
              src="/filters_title.png"
              alt="Smile"
              width={200}
              height={60}
              className="w-0.5vw mt-5"
            />
            {/* Filter Selection Buttons */}
            <div className="w-full">
              <FilterSelect
                selectedFilter={selectedFilter}
                onSelectFilter={handleSelectFilter}
              />
            </div>

            {/* Preview Area */}
            <div className="w-full flex flex-col items-center mt-8">
              <div
                className="relative overflow-hidden bg-white"
                style={{
                  width: isExporting ? "1200px" : `${1200 * currentScale}px`,
                  height: isExporting ? "2800px" : `${2800 * currentScale}px`,
                }}
              >
                <div
                  style={{
                    transform: isExporting ? "none" : `scale(${currentScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <PhotoStripComposite
                    ref={stripRef}
                    shots={shots}
                    template={template}
                    isExporting={isExporting}
                    filterClass={getFilterClass()}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 mb-20 flex flex-col items-center gap-6">
              <button
                onClick={downloadPhotoStrip}
                disabled={shots.length === 0 || isExporting}
                className="relative inline-block group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                <div
                  className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]
                  w-[60vw] h-[12vw]
                  md:w-[35vw] md:h-[7vw]
                  py-1 max-w-80 max-h-40 sm:max-h-15"
                >
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image
                      src="/download.png"
                      alt="Download Button"
                      width={200}
                      height={15}
                      priority
                      className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                    />
                    <Image
                      src="/hover_download.png"
                      alt="Hovered Download Button"
                      width={200}
                      height={15}
                      priority
                      className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                    />
                  </div>
                </div>
              </button>

              <Link
                href="/check"
                className="relative inline-block group mt-5 mb-5"
              >
                <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                <div
                  className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]
                  w-[60vw] h-[12vw]
                  md:w-[35vw] md:h-[7vw]
                  py-1 max-w-80 max-h-40 sm:max-h-15"
                >
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image
                      src="/retake_button.png"
                      alt="Next Button"
                      width={200}
                      height={15}
                      priority
                      className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                    />
                    <Image
                      src="/hover_retake_button.png"
                      alt="Hovered Next Button"
                      width={200}
                      height={15}
                      priority
                      className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Medium and Large Screen Size */}
          <div className="hidden lg:flex w-full max-w-[95vw] 2xl:max-w-450 items-center justify-between px-8 xl:px-16">
            {/* Preview Area - Left Side */}
            <div className="flex flex-col items-center shrink-0 mt-25 2xl:mt-40">
              <div
                className="relative overflow-hidden bg-white"
                style={{
                  width: isExporting ? "1200px" : `${1200 * currentScale}px`,
                  height: isExporting ? "2800px" : `${2800 * currentScale}px`,
                }}
              >
                <div
                  style={{
                    transform: isExporting ? "none" : `scale(${currentScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <PhotoStripComposite
                    ref={stripRef}
                    shots={shots}
                    template={template}
                    isExporting={isExporting}
                    filterClass={getFilterClass()}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Strip Selection & Buttons */}
            <div className="flex flex-col items-center justify-center ml-8 xl:ml-16 2xl:ml-24">
              <Image
                src="/strips_title.png"
                alt="Smile"
                width={240}
                height={60}
                className="w-1vw"
              />
              {/* Strip Selection Buttons */}
              <StripSelect
                selectedStrip={template}
                onSelectStrip={handleSelectStrip}
              />

              <Image
                src="/filters_title.png"
                alt="Smile"
                width={200}
                height={60}
                className="w-0.5vw"
              />

              {/* Filter Selection Buttons */}
              <div className="mt-6 w-full">
                <FilterSelect
                  selectedFilter={selectedFilter}
                  onSelectFilter={handleSelectFilter}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-10 mb-20 flex flex-col items-center gap-6">
                <button
                  onClick={downloadPhotoStrip}
                  disabled={shots.length === 0 || isExporting}
                  className="relative inline-block group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                  <div
                    className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]
                    w-[35vw] h-[7vw]
                    xl:w-[12vw] xl:h-[4vw]
                    2xl:w-[20vw] 2xl:h-[4vw]
                    py-4.5"
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image
                        src="/download.png"
                        alt="Download Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                      />
                      <Image
                        src="/hover_download.png"
                        alt="Hovered Download Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                      />
                    </div>
                  </div>
                </button>

                <Link
                  href="/check"
                  className="relative inline-block group mt-5 mb-5"
                >
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                  <div
                    className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]
                  w-[35vw] h-[7vw]
                  xl:w-[12vw] xl:h-[4vw]
                  2xl:w-[20vw] 2xl:h-[4vw]
                  py-4.5"
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image
                        src="/retake_button.png"
                        alt="Next Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                      />
                      <Image
                        src="/hover_retake_button.png"
                        alt="Hovered Next Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                      />
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
