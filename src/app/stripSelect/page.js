"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import PhotoStripComposite3 from "../../components/photostrip3";
import PhotoStripComposite4 from "../../components/photostrip4";
import StripSelect from "../../components/stripSelect";
import Border from "../../components/border";
import Image from "next/image";
import Link from "next/link";
import "instagram.css";
import FilterSelect from "../../components/filterSelect";

const getInitialScale = (shotsLength = 3) => {
  if (typeof window === "undefined") return 1;

  const canvasHeight = shotsLength === 4 ? 3600 : 2800;

  const maxWidth = window.innerWidth - 64;
  const maxHeight = window.innerHeight * 0.7;
  const scaleW = maxWidth / 1200;
  const scaleH = maxHeight / canvasHeight;
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
      const canvasHeight = shots.length === 4 ? 3600 : 2800;
      const maxWidth = window.innerWidth - 64;
      const maxHeight = window.innerHeight * 0.7;
      const scaleW = maxWidth / 1200;
      const scaleH = maxHeight / canvasHeight;
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

  // Helper function to load an image and apply filter
  const applyCSSFilterToCanvas = (ctx, canvas, filterType) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (filterType) {
      case "inkwell":
        // brightness(1.25) contrast(.85) grayscale(1)
        for (let i = 0; i < data.length; i += 4) {
          // Grayscale
          const gray =
            0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

          // Brightness 1.25
          let r = gray * 1.25;
          let g = gray * 1.25;
          let b = gray * 1.25;

          // Contrast 0.85
          const contrastFactor = 0.85;
          r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
          g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
          b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
        break;

      case "aden":
        // sepia(.2) brightness(1.15) saturate(1.4) + overlay
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i],
            g = data[i + 1],
            b = data[i + 2];

          // Sepia 0.2
          const sr = r * 0.393 + g * 0.769 + b * 0.189;
          const sg = r * 0.349 + g * 0.686 + b * 0.168;
          const sb = r * 0.272 + g * 0.534 + b * 0.131;
          r = r * 0.8 + sr * 0.2;
          g = g * 0.8 + sg * 0.2;
          b = b * 0.8 + sb * 0.2;

          // Brightness 1.15
          r *= 1.15;
          g *= 1.15;
          b *= 1.15;

          // Saturate 1.4
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = gray + (r - gray) * 1.4;
          g = gray + (g - gray) * 1.4;
          b = gray + (b - gray) * 1.4;

          // Overlay rgba(125, 105, 24, .1) multiply
          r = r * (1 - 0.1) + ((r * 125) / 255) * 0.1;
          g = g * (1 - 0.1) + ((g * 105) / 255) * 0.1;
          b = b * (1 - 0.1) + ((b * 24) / 255) * 0.1;

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
        break;

      case "perpetua":
        // contrast(1.1) brightness(1.25) saturate(1.1) + gradient overlay
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i],
            g = data[i + 1],
            b = data[i + 2];

          // Brightness 1.25
          r *= 1.25;
          g *= 1.25;
          b *= 1.25;

          // Saturate 1.1
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = gray + (r - gray) * 1.1;
          g = gray + (g - gray) * 1.1;
          b = gray + (b - gray) * 1.1;

          // Contrast 1.1
          r = ((r / 255 - 0.5) * 1.1 + 0.5) * 255;
          g = ((g / 255 - 0.5) * 1.1 + 0.5) * 255;
          b = ((b / 255 - 0.5) * 1.1 + 0.5) * 255;

          // Gradient overlay (simplified - just apply blue-ish tint)
          const y = Math.floor(i / 4 / canvas.width);
          const gradientMix = (y / canvas.height) * 0.25;
          r = r * (1 - gradientMix) + ((r * 0) / 255) * gradientMix;
          g = g * (1 - gradientMix) + ((g * 91) / 255) * gradientMix;
          b = b * (1 - gradientMix) + ((b * 154) / 255) * gradientMix;

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
        break;

      case "crema":
        // sepia(.5) contrast(1.25) brightness(1.15) saturate(.9) hue-rotate(-2deg) + overlay
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i],
            g = data[i + 1],
            b = data[i + 2];

          // Sepia 0.5
          const sr = r * 0.393 + g * 0.769 + b * 0.189;
          const sg = r * 0.349 + g * 0.686 + b * 0.168;
          const sb = r * 0.272 + g * 0.534 + b * 0.131;
          r = r * 0.5 + sr * 0.5;
          g = g * 0.5 + sg * 0.5;
          b = b * 0.5 + sb * 0.5;

          // Brightness 1.15
          r *= 1.15;
          g *= 1.15;
          b *= 1.15;

          // Saturate 0.9
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = gray + (r - gray) * 0.9;
          g = gray + (g - gray) * 0.9;
          b = gray + (b - gray) * 0.9;

          // Contrast 1.25
          r = ((r / 255 - 0.5) * 1.25 + 0.5) * 255;
          g = ((g / 255 - 0.5) * 1.25 + 0.5) * 255;
          b = ((b / 255 - 0.5) * 1.25 + 0.5) * 255;

          // Overlay rgba(125, 105, 24, .2) multiply
          r = r * (1 - 0.2) + ((r * 125) / 255) * 0.2;
          g = g * (1 - 0.2) + ((g * 105) / 255) * 0.2;
          b = b * (1 - 0.2) + ((b * 24) / 255) * 0.2;

          data[i] = Math.min(255, Math.max(0, r));
          data[i + 1] = Math.min(255, Math.max(0, g));
          data[i + 2] = Math.min(255, Math.max(0, b));
        }
        break;

      case "sutro":
        // sepia(.4) contrast(1.2) brightness(.9) saturate(1.4) hue-rotate(-10deg) + vignette
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            let r = data[i],
              g = data[i + 1],
              b = data[i + 2];

            // Sepia 0.4
            const sr = r * 0.393 + g * 0.769 + b * 0.189;
            const sg = r * 0.349 + g * 0.686 + b * 0.168;
            const sb = r * 0.272 + g * 0.534 + b * 0.131;
            r = r * 0.6 + sr * 0.4;
            g = g * 0.6 + sg * 0.4;
            b = b * 0.6 + sb * 0.4;

            // Brightness 0.9
            r *= 0.9;
            g *= 0.9;
            b *= 0.9;

            // Saturate 1.4
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = gray + (r - gray) * 1.4;
            g = gray + (g - gray) * 1.4;
            b = gray + (b - gray) * 1.4;

            // Contrast 1.2
            r = ((r / 255 - 0.5) * 1.2 + 0.5) * 255;
            g = ((g / 255 - 0.5) * 1.2 + 0.5) * 255;
            b = ((b / 255 - 0.5) * 1.2 + 0.5) * 255;

            // Radial gradient vignette (darken edges)
            const dx = x - centerX;
            const dy = y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const distRatio = dist / maxDist;

            if (distRatio > 0.5) {
              const vignette = 1 - Math.min(1, ((distRatio - 0.5) / 0.4) * 0.5);
              r = Math.min(r, r * vignette);
              g = Math.min(g, g * vignette);
              b = Math.min(b, b * vignette);
            }

            data[i] = Math.min(255, Math.max(0, r));
            data[i + 1] = Math.min(255, Math.max(0, g));
            data[i + 2] = Math.min(255, Math.max(0, b));
          }
        }
        break;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Helper function to load an image and apply filter
  const loadAndFilterImage = async (src, filterType) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        if (filterType !== "none") {
          applyCSSFilterToCanvas(ctx, canvas, filterType);
        }

        resolve(canvas.toDataURL());
      };
      img.src = src;
    });
  };

  const downloadPhotoStrip = async () => {
    if (!stripRef.current || shots.length === 0) return;

    try {
      const canvasHeight = shots.length === 4 ? 3600 : 2800;

      // Apply filters to shots if needed
      let filteredShots = shots;
      if (selectedFilter !== "none") {
        filteredShots = await Promise.all(
          shots.map((shot) => loadAndFilterImage(shot, selectedFilter)),
        );
      }

      // Temporarily replace the shots in the component
      const images = stripRef.current.querySelectorAll("img[alt^='Shot']");
      const originalSrcs = [];
      images.forEach((img, i) => {
        originalSrcs[i] = img.src;
        if (filteredShots[i]) {
          img.src = filteredShots[i];
        }
        // Remove filter class
        img.className = img.className.replace(/filter-\w+/g, "").trim();
      });

      const original = stripRef.current;
      const clone = original.cloneNode(true);

      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "-9999px";
      clone.style.width = "1200px";
      clone.style.height = `${canvasHeight}px`;
      clone.style.transform = "none";

      document.body.appendChild(clone);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: canvasHeight,
        removeContainer: true,
      });

      document.body.removeChild(clone);

      // Restore original images and classes
      images.forEach((img, i) => {
        img.src = originalSrcs[i];
        if (selectedFilter !== "none") {
          img.className += ` ${getFilterClass()}`;
        }
      });

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
      console.error("Download Error:", error);
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

      await fetch(DRIVE_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      console.log("Successfully backed up to Drive");
    } catch (error) {
      console.error("Drive backup failed:", error);
    }
  };

  const canvasHeight = shots.length === 4 ? 3600 : 2800;

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
                  height: isExporting
                    ? `${canvasHeight}px`
                    : `${canvasHeight * currentScale}px`,
                }}
              >
                <div
                  style={{
                    transform: isExporting ? "none" : `scale(${currentScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {shots.length === 4 ? (
                    <PhotoStripComposite4
                      ref={stripRef}
                      shots={shots}
                      template={template}
                      isExporting={isExporting}
                      filterClass={getFilterClass()}
                    />
                  ) : (
                    <PhotoStripComposite3
                      ref={stripRef}
                      shots={shots}
                      template={template}
                      isExporting={isExporting}
                      filterClass={getFilterClass()}
                    />
                  )}
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
                  py-1 max-w-90 max-h-40 sm:max-h-18"
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
                  py-1 max-w-90 max-h-40 sm:max-h-18"
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
          <div className="hidden lg:flex w-full max-w-[95vw] 2xl:max-w-450 items-center justify-between">
            {/* Preview Area - Left Side */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div
                className="relative overflow-hidden bg-white"
                style={{
                  width: isExporting ? "1200px" : `${1200 * currentScale}px`,
                  height: isExporting
                    ? `${canvasHeight}px`
                    : `${canvasHeight * currentScale}px`,
                }}
              >
                <div
                  style={{
                    transform: isExporting ? "none" : `scale(${currentScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {shots.length === 4 ? (
                    <PhotoStripComposite4
                      ref={stripRef}
                      shots={shots}
                      template={template}
                      isExporting={isExporting}
                      filterClass={getFilterClass()}
                    />
                  ) : (
                    <PhotoStripComposite3
                      ref={stripRef}
                      shots={shots}
                      template={template}
                      isExporting={isExporting}
                      filterClass={getFilterClass()}
                    />
                  )}
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
                className="w-1vw mt-0 2xl:mt-10"
              />
              {/* Strip Selection Buttons */}
              <StripSelect
                selectedStrip={template}
                onSelectStrip={handleSelectStrip}
              />

              <Image
                src="/filters_title.png"
                alt="Smile"
                width={300}
                height={60}
                className="w-0.5vw 2xl:w-10vw mt-10"
              />

              {/* Filter Selection Buttons */}
              <div className="mt-6 w-full">
                <FilterSelect
                  selectedFilter={selectedFilter}
                  onSelectFilter={handleSelectFilter}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-30 mb-20 flex flex-col items-center gap-6">
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
