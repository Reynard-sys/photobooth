"use client";

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import PhotoStripComposite3 from "../../components/photostrip3";
import PhotoStripComposite4 from "../../components/photostrip4";
import Border from "../../components/border";
import Image from "next/image";
import "instagram.css";
import Link from "next/link";

export default function DownloadPage() {
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
      <DownloadContent />
    </Suspense>
  );
}

function DownloadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripRef = useRef(null);

  const [shots, setShots] = useState([]);
  const [template, setTemplate] = useState("Frame1");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [machineScale, setMachineScale] = useState(1);
  const [stripScale, setStripScale] = useState(1);
  const [stripPosition, setStripPosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const [email, setEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const [generatedImage, setGeneratedImage] = useState(null);

  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    const imagesToPreload = [
      "/machine.png",
      "/top_machine.png",
      "/download.png",
      "/hover_download.png",
      "/edit.png",
      "/hover_edit.png",
      "/reset.png",
      "/hover_reset.png",
      "/email.png",
      "/hover_email.png",
      "/sending.png",
      "/credits.png",
    ];

    Promise.all(
      imagesToPreload.map((src) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        });
      }),
    ).then(() => {
      setAssetsReady(true);
    });
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("shots");
    if (stored) {
      setShots(JSON.parse(stored));
    }

    const templateParam = searchParams.get("template");
    const filterParam = searchParams.get("filter");

    if (templateParam) setTemplate(templateParam);
    if (filterParam) setSelectedFilter(filterParam);
  }, [searchParams]);

  // Scale for machine and strip
  useEffect(() => {
    const calculateScale = () => {
      if (typeof window === "undefined") return;

      const canvasHeight = 3600;
      const maxWidth = window.innerWidth - 64;
      const maxHeight = window.innerHeight * 0.7;

      // Machine scale
      const scaleW = maxWidth / 1200;
      const scaleH = maxHeight / canvasHeight;
      const machineScaleValue = Math.min(scaleW, scaleH, 2);
      setMachineScale(machineScaleValue);

      // Strip scale 70%
      const maxStripWidth = Math.min(900, maxWidth * 0.7);
      const stripScaleW = maxStripWidth / 1200;
      const stripScaleH = (maxHeight * 0.7) / canvasHeight;
      setStripScale(Math.min(stripScaleW, stripScaleH, 0.7));
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [shots.length]);

  // Animation effect
  useEffect(() => {
    if (!isAnimating) return;

    const duration = 5000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      const easeProgress = 1 - Math.pow(1 - progress / 100, 3);

      const revealAmount = shots.length === 4 ? 135 : 135;

      setStripPosition(easeProgress * revealAmount);

      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isAnimating, shots.length]);

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

  // Filter calculation. Used AI to get filter calculation (╥﹏╥)
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

  const generatePhotoStripImage = async () => {
    if (!stripRef.current || shots.length === 0) return null;

    try {
      const canvasHeight = shots.length === 4 ? 3600 : 2800;

      let filteredShots = shots;
      if (selectedFilter !== "none") {
        filteredShots = await Promise.all(
          shots.map((shot) => loadAndFilterImage(shot, selectedFilter)),
        );
      }

      const images = stripRef.current.querySelectorAll("img[alt^='Shot']");
      const originalSrcs = [];
      images.forEach((img, i) => {
        originalSrcs[i] = img.src;
        if (filteredShots[i]) {
          img.src = filteredShots[i];
        }
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

      images.forEach((img, i) => {
        img.src = originalSrcs[i];
        if (selectedFilter !== "none") {
          img.className += ` ${getFilterClass()}`;
        }
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      return dataUrl;
    } catch (error) {
      console.error("Image generation error:", error);
      return null;
    }
  };

  const downloadPhotoStrip = async () => {
    if (!stripRef.current || shots.length === 0) return;

    try {
      let dataUrl = generatedImage;
      if (!dataUrl) {
        dataUrl = await generatePhotoStripImage();
        setGeneratedImage(dataUrl);
      }

      if (!dataUrl) {
        alert("Could not generate image. Try again.");
        return;
      }

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
    } catch (error) {
      console.error("Download Error:", error);
      alert("Could not generate image. Try a different browser or clear tabs.");
    }
  };

  const sendEmailWithImage = async () => {
    if (!email || !stripRef.current || shots.length === 0) return;

    if (!email.includes("@")) {
      setEmailStatus("error");
      setTimeout(() => setEmailStatus(null), 3000);
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      let dataUrl = generatedImage;
      if (!dataUrl) {
        dataUrl = await generatePhotoStripImage();
        setGeneratedImage(dataUrl);
      }

      if (!dataUrl) {
        setEmailStatus("error");
        setTimeout(() => setEmailStatus(null), 3000);
        return;
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          imageData: dataUrl,
          filename: `photostrip-${Date.now()}.png`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailStatus("success");
        setEmail("");
        setTimeout(() => setEmailStatus(null), 5000);
      } else {
        setEmailStatus("error");
        setTimeout(() => setEmailStatus(null), 5000);
      }
    } catch (error) {
      console.error("Email Error:", error);
      setEmailStatus("error");
      setTimeout(() => setEmailStatus(null), 5000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const canvasHeight = 3600;
  const stripTranslateY =
    -(canvasHeight * stripScale) * (1 - stripPosition / 100);

  // Center the strip horizontally in the machine
  const machineWidth = 1200 * machineScale;
  const largeMachineWidth = machineWidth * 1.2;
  const stripWidth = 1200 * stripScale;
  const largeStripWidth = stripWidth * 1.2;
  const stripLeftOffset = (machineWidth - stripWidth) / 2;
  const largeStripLeftOffset = (largeMachineWidth - largeStripWidth) / 2;

  return (
    <>
      <div className="h-dvh overflow-hidden bg-[#FDFDF5]">
        <Border />
        <div className="flex flex-col h-full overflow-y-auto lg:overflow-hidden xl:overflow-hidden overscroll-none bg-[#FDFDF5] items-center py-10 px-4">
          {/* Small Screen Size */}
          <div className="w-full lg:hidden max-w-6xl flex flex-col items-center">
            {/* Photo Booth Machine */}
            <div className="relative" style={{ width: `${machineWidth}px` }}>
              {/* Machine Base */}
              <Image
                src="/machine.png"
                alt="Photo Booth Machine"
                width={1200}
                height={400}
                className="relative z-0 "
                style={{
                  width: `${machineWidth}px`,
                  height: "auto",
                }}
              />

              {/* Photo Strip */}
              <div
                className="absolute"
                style={{
                  top: 0,
                  left: `${stripLeftOffset}px`,
                  width: `${stripWidth}px`,
                  height: "auto",
                  maxHeight: 1000,
                  zIndex: 15,
                  overflow: "visible",
                  clipPath: `inset(0 0 -9999px 0)`,
                }}
              >
                <div
                  style={{
                    transform: `translateY(${stripTranslateY}px) scale(${stripScale})`,
                    transformOrigin: "top left",
                    transition: "none",
                  }}
                >
                  {shots.length === 4 ? (
                    <PhotoStripComposite4
                      ref={stripRef}
                      shots={shots}
                      template={template}
                      filterClass={getFilterClass()}
                    />
                  ) : (
                    <PhotoStripComposite3
                      ref={stripRef}
                      shots={shots}
                      template={template}
                      filterClass={getFilterClass()}
                    />
                  )}
                </div>
              </div>

              {/* Machine Cover Part */}
              <Image
                src="/top_machine.png"
                alt="Machine Top"
                width={1200}
                height={200}
                className="absolute top-0 left-0 z-20"
                style={{
                  width: `${machineWidth}px`,
                  height: "auto",
                }}
              />
            </div>

            {/* Download Button */}
            {!isAnimating && (
              <div className="mt-30 flex flex-col items-center gap-6 relative z-30">
                <button
                  onClick={downloadPhotoStrip}
                  className="relative inline-block group"
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

                <Link href="/edit" className="relative inline-block group">
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                  <div
                    className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]
                                   w-[60vw] h-[12vw]
                                   md:w-[35vw] md:h-[7vw]
                                   py-1 max-w-90 max-h-40 sm:max-h-18"
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image
                        src="/edit.png"
                        alt="Back to Edit Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                      />
                      <Image
                        src="/hover_edit.png"
                        alt="Hovered Back to Edit Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                      />
                    </div>
                  </div>
                </Link>

                <Link href="/" className="relative inline-block group">
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                  <div
                    className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]
                                    w-[60vw] h-[12vw]
                                    md:w-[35vw] md:h-[7vw]
                                    py-1 max-w-90 max-h-40 sm:max-h-18"
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image
                        src="/reset.png"
                        alt="Reset Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                      />
                      <Image
                        src="/hover_reset.png"
                        alt="Hovered Reset Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                      />
                    </div>
                  </div>
                </Link>
                {/* Email Section */}
                <div className="flex flex-col items-center gap-4 w-full">
                  {/* Email Input */}
                  <div className="w-[60vw] md:w-[35vw] lg:w-[15vw] xl:w-[12vw]">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border-2 border-[#3D568F] rounded-xl bg-[#FDFDF5] text-[#3D568F] placeholder-[#3D568F]/50 focus:outline-none focus:ring-2 focus:ring-[#F2AEBD] text-center font-medium"
                    />
                  </div>

                  {/* Send Email Button */}
                  <button
                    onClick={sendEmailWithImage}
                    disabled={!email || isSendingEmail}
                    className="group relative cursor-pointer"
                  >
                    <div
                      className={`absolute inset-0 rounded-xl translate-x-2 translate-y-2 transition-colors ${
                        isSendingEmail
                          ? "bg-[#F2AEBD]"
                          : "bg-[#3D568F] group-active:bg-[#F2AEBD] lg:group-hover:bg-[#F2AEBD]"
                      }`}
                    ></div>
                    <div
                      className={`relative border-2 sm:border-2 rounded-xl w-[60vw] h-[12vw]
                                    md:w-[35vw] md:h-[7vw]
                                    py-3 max-w-90 max-h-40 sm:max-h-18 ${
                                      isSendingEmail
                                        ? "bg-[#3D568F] border-[#F2AEBD]"
                                        : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] lg:group-hover:bg-[#3D568F] lg:group-hover:border-[#F2AEBD]"
                                    }`}
                    >
                      {isSendingEmail ? (
                        <Image
                          src={`/sending.png`}
                          alt="Sending"
                          width={200}
                          height={15}
                          priority
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <>
                          <Image
                            src="/email.png"
                            alt="Email Button"
                            width={200}
                            height={15}
                            priority
                            className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                          />
                          <Image
                            src="/hover_email.png"
                            alt="Hovered Email Button"
                            width={200}
                            height={15}
                            priority
                            className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Status Message */}
                  {emailStatus && (
                    <div
                      className={`text-center font-medium ${emailStatus === "success" ? "text-[#3E5D93]" : "text-[#F2AEBD]"}`}
                    >
                      {emailStatus === "success"
                        ? "Email sent successfully!"
                        : "Failed to send email"}
                    </div>
                  )}

                  {/* Reset Link */}
                  <Link href="/" className="relative inline-block group mt-4">
                    <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                    <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[60vw] h-[12vw] md:w-[35vw] md:h-[7vw] lg:w-[15vw] lg:h-[5vw] xl:w-[12vw] xl:h-[4vw] py-1 max-w-90 max-h-40 sm:max-h-18">
                      <div className="relative w-full h-full flex items-center justify-center p-2">
                        <Image
                          src="/reset.png"
                          alt="Reset Button"
                          width={200}
                          height={15}
                          priority
                          className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                        />
                        <Image
                          src="/hover_reset.png"
                          alt="Hovered Reset Button"
                          width={200}
                          height={15}
                          priority
                          className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="z-10 w-[30vw] pointer-events-none">
                  <Image
                    src="/credits.png"
                    alt="Bottom Left Decoration"
                    width={500}
                    height={500}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Large Screen Size */}
          <div className="hidden lg:flex w-full items-center justify-between mt-15 2xl:mt-15">
            <div className="flex flex-col items-center justify-center shrink-0 ml-70 mb-0 xl:mb-10 2xl:mb-0">
              {/* Photo Booth Machine */}
              <div
                className="relative"
                style={{ width: `${largeMachineWidth}px` }}
              >
                {/* Machine Base */}
                <Image
                  src="/machine.png"
                  alt="Photo Booth Machine"
                  width={1200}
                  height={400}
                  className="relative z-0 "
                  style={{
                    width: `${largeMachineWidth}px`,
                    height: "auto",
                  }}
                />

                {/* Photo Strip */}
                <div
                  className="absolute"
                  style={{
                    top: 0,
                    left: `${largeStripLeftOffset}px`,
                    width: `${largeStripWidth}px`,
                    height: "auto",
                    maxHeight: "none",
                    zIndex: 15,
                    overflow: "visible",
                    clipPath: `inset(0 0 -9999px 0)`,
                  }}
                >
                  <div
                    style={{
                      transform: `translateY(${stripTranslateY}px) scale(${stripScale * 1.2})`,
                      transformOrigin: "top left",
                      transition: "none",
                    }}
                  >
                    {shots.length === 4 ? (
                      <PhotoStripComposite4
                        ref={stripRef}
                        shots={shots}
                        template={template}
                        filterClass={getFilterClass()}
                      />
                    ) : (
                      <PhotoStripComposite3
                        ref={stripRef}
                        shots={shots}
                        template={template}
                        filterClass={getFilterClass()}
                      />
                    )}
                  </div>
                </div>

                {/* Machine Cover Part */}
                <Image
                  src="/top_machine.png"
                  alt="Machine Top"
                  width={1200}
                  height={200}
                  className="absolute top-0 left-0 z-20"
                  style={{
                    width: `${largeMachineWidth}px`,
                    height: "auto",
                  }}
                />
              </div>
            </div>
            {/* Buttons */}
            {!isAnimating && (
              <div className="flex flex-col items-center justify-center gap-10 ml-8 xl:ml-16 mr-60 xl:mr-60 2xl:mr-100">
                <button
                  onClick={downloadPhotoStrip}
                  className="relative inline-block group"
                >
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                  <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[50vw] h-[10vw] sm:w-[40vw] sm:h-[8vw] md:w-[20vw] md:h-[6vw] lg:w-[15vw] lg:h-[5vw] xl:w-[12vw] xl:h-[4vw] py-1">
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

                <Link href="/edit" className="relative inline-block group">
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                  <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[50vw] h-[10vw] sm:w-[40vw] sm:h-[8vw] md:w-[20vw] md:h-[6vw] lg:w-[15vw] lg:h-[5vw] xl:w-[12vw] xl:h-[4vw] py-1">
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image
                        src="/edit.png"
                        alt="Back to Edit Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                      />
                      <Image
                        src="/hover_edit.png"
                        alt="Hovered Back to Edit Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                      />
                    </div>
                  </div>
                </Link>

                <Link href="/" className="relative inline-block group">
                  <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                  <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[50vw] h-[10vw] sm:w-[40vw] sm:h-[8vw] md:w-[20vw] md:h-[6vw] lg:w-[15vw] lg:h-[5vw] xl:w-[12vw] xl:h-[4vw] py-1">
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image
                        src="/reset.png"
                        alt="Back to Edit Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                      />
                      <Image
                        src="/hover_reset.png"
                        alt="Hovered Back to Edit Button"
                        width={200}
                        height={15}
                        priority
                        className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                      />
                    </div>
                  </div>
                </Link>
                {/* Email Section */}
                <div className="flex flex-col items-center gap-4 w-full">
                  {/* Email Input */}
                  <div className="w-[60vw] md:w-[35vw] lg:w-[15vw] xl:w-[12vw]">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border-2 border-[#3D568F] rounded-xl bg-[#FDFDF5] text-[#3D568F] placeholder-[#3D568F]/50 focus:outline-none focus:ring-2 focus:ring-[#F2AEBD] text-center font-medium"
                    />
                  </div>

                  {/* Send Email Button */}
                  <button
                    onClick={sendEmailWithImage}
                    disabled={!email || isSendingEmail}
                    className="group relative cursor-pointer"
                  >
                    <div
                      className={`absolute inset-0 rounded-xl translate-x-2 translate-y-2 transition-colors ${
                        isSendingEmail
                          ? "bg-[#F2AEBD]"
                          : "bg-[#3D568F] group-active:bg-[#F2AEBD] lg:group-hover:bg-[#F2AEBD]"
                      }`}
                    ></div>
                    <div
                      className={`relative border-2 sm:border-2 rounded-xl w-[50vw] h-[10vw] sm:w-[40vw] sm:h-[8vw] md:w-[20vw] md:h-[6vw] lg:w-[15vw] lg:h-[5vw] xl:w-[12vw] xl:h-[4vw] py-4 ${
                        isSendingEmail
                          ? "bg-[#3D568F] border-[#F2AEBD]"
                          : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] lg:group-hover:bg-[#3D568F] lg:group-hover:border-[#F2AEBD]"
                      }`}
                    >
                      {isSendingEmail ? (
                        <Image
                          src={`/sending.png`}
                          alt="Sending"
                          width={200}
                          height={15}
                          priority
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <>
                          <Image
                            src="/email.png"
                            alt="Email Button"
                            width={200}
                            height={15}
                            priority
                            className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                          />
                          <Image
                            src="/hover_email.png"
                            alt="Hovered Email Button"
                            width={200}
                            height={15}
                            priority
                            className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block"
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Status Message */}
                  {emailStatus && (
                    <div
                      className={`text-center font-bold ${emailStatus === "success" ? "text-[#3E5D93]" : "text-[#F2AEBD]"}`}
                    >
                      {emailStatus === "success"
                        ? "Email sent successfully!"
                        : "Failed to send email"}
                    </div>
                  )}

                  {/* Reset Link */}
                  <Link href="/" className="relative inline-block group mt-4">
                    <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors"></div>
                    <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] w-[60vw] h-[12vw] md:w-[35vw] md:h-[7vw] lg:w-[15vw] lg:h-[5vw] xl:w-[12vw] xl:h-[4vw] py-1 max-w-90 max-h-40 sm:max-h-18">
                      <div className="relative w-full h-full flex items-center justify-center p-2">
                        <Image
                          src="/reset.png"
                          alt="Reset Button"
                          width={200}
                          height={15}
                          priority
                          className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden"
                        />
                        <Image
                          src="/hover_reset.png"
                          alt="Hovered Reset Button"
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
            )}
            <div className="absolute bottom-10 right-10 z-10 w-[30vw] md:w-[20vw] lg:w-[15vw] pointer-events-none">
              <Image
                src="/credits.png"
                alt="Bottom Left Decoration"
                width={500}
                height={500}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
