"use client";

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import PhotoStrip from "../../components/photostrip";
import Border from "../../components/border";
import Image from "next/image";
import "instagram.css";
import Link from "next/link";
import { getFilterClass, applyCSSFilterToCanvas, loadAndFilterImage } from "@/lib/utils/filters";

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-[#FDFDF5]">
          <p className="text-[#3D568F] font-bold animate-pulse">Loading shots...</p>
        </div>
      }
    >
      <DownloadContent />
    </Suspense>
  );
}

function DownloadContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const stripRef     = useRef(null);

  const [shots,          setShots]          = useState([]);
  const [template,       setTemplate]       = useState("Frame1");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [machineScale,   setMachineScale]   = useState(1);
  const [stripScale,     setStripScale]     = useState(1);
  const [stripPosition,  setStripPosition]  = useState(0);
  const [isAnimating,    setIsAnimating]    = useState(true);

  const [email,          setEmail]          = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus,    setEmailStatus]    = useState(null); // null | "success" | "error" | string message
  const [generatedImage, setGeneratedImage] = useState(null);

  // Load shots and URL params
  useEffect(() => {
    const stored = sessionStorage.getItem("shots");
    if (stored) setShots(JSON.parse(stored));
    const tpl = searchParams.get("template");
    const fil = searchParams.get("filter");
    if (tpl) setTemplate(tpl);
    if (fil) setSelectedFilter(fil);
  }, [searchParams]);

  // Scale calculation
  useEffect(() => {
    const calculateScale = () => {
      if (typeof window === "undefined") return;
      const canvasHeight = 3600;
      const maxWidth  = window.innerWidth  - 64;
      const maxHeight = window.innerHeight * 0.7;
      const scaleW = maxWidth  / 1200;
      const scaleH = maxHeight / canvasHeight;
      const ms = Math.min(scaleW, scaleH, 2);
      setMachineScale(ms);
      const maxStripWidth = Math.min(900, maxWidth * 0.7);
      setStripScale(Math.min(maxStripWidth / 1200, (maxHeight * 0.7) / canvasHeight, 0.7));
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [shots.length]);

  // Strip ejection animation
  useEffect(() => {
    if (!isAnimating) return;
    const duration  = 5000;
    const startTime = Date.now();
    const revealAmount = 135;
    const animate = () => {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setStripPosition((1 - Math.pow(1 - progress / 100, 3)) * revealAmount);
      if (progress < 100) requestAnimationFrame(animate);
      else setIsAnimating(false);
    };
    requestAnimationFrame(animate);
  }, [isAnimating]);

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------
  const canvasHeight = 3600;
  const stripTranslateY = -(canvasHeight * stripScale) * (1 - stripPosition / 100);

  const machineWidth       = 1200 * machineScale;
  const largeMachineWidth  = machineWidth * 1.2;
  const stripWidth         = 1200 * stripScale;
  const largeStripWidth    = stripWidth * 1.2;
  const stripLeftOffset    = (machineWidth      - stripWidth)      / 2;
  const largeStripLeftOffset = (largeMachineWidth - largeStripWidth) / 2;

  const filterClass = getFilterClass(selectedFilter);

  const generatePhotoStripImage = async () => {
    if (!stripRef.current || shots.length === 0) return null;
    try {
      const stripCanvasHeight = shots.length === 4 ? 3600 : 2800;

      let filteredShots = shots;
      if (selectedFilter !== "none") {
        filteredShots = await Promise.all(shots.map((s) => loadAndFilterImage(s, selectedFilter)));
      }

      const images = stripRef.current.querySelectorAll("img[alt^='Shot']");
      const originalSrcs = [];
      images.forEach((img, i) => {
        originalSrcs[i] = img.src;
        if (filteredShots[i]) img.src = filteredShots[i];
        img.className = img.className.replace(/filter-\w+/g, "").trim();
      });

      const clone = stripRef.current.cloneNode(true);
      clone.style.position  = "absolute";
      clone.style.left      = "-9999px";
      clone.style.top       = "-9999px";
      clone.style.width     = "1200px";
      clone.style.height    = `${stripCanvasHeight}px`;
      clone.style.transform = "none";
      document.body.appendChild(clone);
      await new Promise((r) => setTimeout(r, 300));

      const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        allowTaint: true,
        width: 1200,
        height: stripCanvasHeight,
        removeContainer: true,
      });
      document.body.removeChild(clone);

      images.forEach((img, i) => {
        img.src = originalSrcs[i];
        if (selectedFilter !== "none") img.className += ` ${filterClass}`;
      });

      return canvas.toDataURL("image/png", 1.0);
    } catch (err) {
      console.error("Image generation error:", err);
      return null;
    }
  };

  const downloadPhotoStrip = async () => {
    if (!stripRef.current || shots.length === 0) return;
    try {
      let dataUrl = generatedImage || await generatePhotoStripImage();
      setGeneratedImage(dataUrl);
      if (!dataUrl) { alert("Could not generate image. Try again."); return; }

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isIOS    = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isSafari || isIOS) {
        const tab = window.open();
        tab.document.body.innerHTML = `<img src="${dataUrl}" style="width:100%" />`;
        tab.document.title = "Save your Photo Strip";
      } else {
        const link = document.createElement("a");
        link.download = `photostrip-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Download Error:", err);
      alert("Could not generate image. Try a different browser or clear tabs.");
    }
  };

  const sendEmailWithImage = async () => {
    if (!email || !stripRef.current || shots.length === 0) return;

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(email)) {
      setEmailStatus("Invalid email address.");
      setTimeout(() => setEmailStatus(null), 4000);
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    try {
      const dataUrl = generatedImage || await generatePhotoStripImage();
      setGeneratedImage(dataUrl);
      if (!dataUrl) {
        setEmailStatus("Could not generate image. Please try again.");
        setTimeout(() => setEmailStatus(null), 5000);
        setIsSendingEmail(false);
        return;
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, imageData: dataUrl, filename: `photostrip-${Date.now()}.png` }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailStatus("success");
        setEmail("");
        setTimeout(() => setEmailStatus(null), 5000);
      } else {
        // Show the server's specific message when available
        setEmailStatus(result.error || "Failed to send email.");
        setTimeout(() => setEmailStatus(null), 6000);
      }
    } catch (err) {
      console.error("Email Error:", err);
      setEmailStatus("Network error. Please check your connection and try again.");
      setTimeout(() => setEmailStatus(null), 6000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // -------------------------------------------------------------------------
  // Shared button / email section sub-renders to avoid repetition
  // -------------------------------------------------------------------------
  const ActionButtons = ({ sizeClasses }) => (
    <>
      <button onClick={downloadPhotoStrip} className="relative inline-block group">
        <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors" />
        <div className={`relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] py-1 p-2 xl:p-3 ${sizeClasses}`}>
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <Image src="/images/ui/download.webp"       alt="Download"       width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
            <Image src="/images/ui/hover_download.webp" alt="Download (hover)" width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
          </div>
        </div>
      </button>

      <Link href="/edit" className="relative inline-block group">
        <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors" />
        <div className={`relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] py-1 p-2 xl:p-3 ${sizeClasses}`}>
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <Image src="/images/ui/edit.webp"       alt="Back to Edit"       width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
            <Image src="/images/ui/hover_edit.webp" alt="Back to Edit (hover)" width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
          </div>
        </div>
      </Link>

      <Link href="/" className="relative inline-block group">
        <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD] transition-colors" />
        <div className={`relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl transition-colors flex items-center justify-center group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD] py-1 p-2 xl:p-3 ${sizeClasses}`}>
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <Image src="/images/ui/reset.webp"       alt="Start Over"       width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
            <Image src="/images/ui/hover_reset.webp" alt="Start Over (hover)" width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
          </div>
        </div>
      </Link>
    </>
  );

  const EmailSection = ({ inputWidthClass, buttonSizeClasses }) => (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={inputWidthClass}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border-2 border-[#3D568F] rounded-xl bg-[#FDFDF5] text-[#3D568F] placeholder-[#3D568F]/50 focus:outline-none focus:ring-2 focus:ring-[#F2AEBD] text-center font-medium"
        />
      </div>
      <button
        onClick={sendEmailWithImage}
        disabled={!email || isSendingEmail}
        className="group relative cursor-pointer"
      >
        <div className={`absolute inset-0 rounded-xl translate-x-2 translate-y-2 transition-colors ${isSendingEmail ? "bg-[#F2AEBD]" : "bg-[#3D568F] group-active:bg-[#F2AEBD] lg:group-hover:bg-[#F2AEBD]"}`} />
        <div className={`relative border-2 sm:border-2 rounded-xl py-3 ${buttonSizeClasses} ${isSendingEmail ? "bg-[#3D568F] border-[#F2AEBD]" : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] lg:group-hover:bg-[#3D568F] lg:group-hover:border-[#F2AEBD]"}`}>
          {isSendingEmail ? (
            <Image src="/images/ui/sending.webp" alt="Sending" width={200} height={15} priority className="w-full h-full object-contain" />
          ) : (
            <>
              <Image src="/images/ui/email.webp"       alt="Send Email"       width={200} height={15} priority className="pointer-events-none object-contain w-full h-full group-active:hidden xl:group-hover:hidden" />
              <Image src="/images/ui/hover_email.webp" alt="Send Email (hover)" width={200} height={15} className="pointer-events-none object-contain w-full h-full hidden group-active:block xl:group-hover:block" />
            </>
          )}
        </div>
      </button>
      {emailStatus && (
        <div className={`text-center font-medium ${emailStatus === "success" ? "text-[#3E5D93]" : "text-[#F2AEBD]"}`}>
          {emailStatus === "success" ? "Email sent successfully! 🎉" : emailStatus}
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // Shared strip + machine render (reused for both small and large layouts)
  // -------------------------------------------------------------------------
  const StripMachine = ({ mw, sw, leftOffset }) => (
    <div className="relative" style={{ width: `${mw}px` }}>
      <Image src="/images/booth/machine.webp" alt="Photo Booth Machine" width={1200} height={400} className="relative z-0" style={{ width: `${mw}px`, height: "auto" }} />
      <div className="absolute" style={{ top: 0, left: `${leftOffset}px`, width: `${sw}px`, height: "auto", maxHeight: mw === machineWidth ? 1000 : "none", zIndex: 15, overflow: "visible", clipPath: "inset(0 0 -9999px 0)" }}>
        <div style={{ transform: `translateY(${stripTranslateY}px) scale(${mw === machineWidth ? stripScale : stripScale * 1.2})`, transformOrigin: "top left", transition: "none" }}>
          <PhotoStrip ref={stripRef} shots={shots} template={template} filterClass={filterClass} />
        </div>
      </div>
      <Image src="/images/booth/top_machine.webp" alt="Machine Top" width={1200} height={200} className="absolute top-0 left-0 z-20" style={{ width: `${mw}px`, height: "auto" }} />
    </div>
  );

  return (
    <>
      <div className="h-dvh overflow-hidden bg-[#FDFDF5]">
        <Border />
        <div className="flex flex-col h-full overflow-y-auto lg:overflow-hidden xl:overflow-hidden overscroll-none bg-[#FDFDF5] items-center py-10 px-4">

          {/* ── Small Screen ── */}
          <div className="w-full lg:hidden max-w-6xl flex flex-col items-center">
            <StripMachine mw={machineWidth} sw={stripWidth} leftOffset={stripLeftOffset} />
            {!isAnimating && (
              <div className="mt-30 flex flex-col items-center gap-6 relative z-30">
                <ActionButtons sizeClasses="w-[60vw] h-[12vw] md:w-[35vw] md:h-[7vw] max-w-90 max-h-40 sm:max-h-18" />
                <EmailSection inputWidthClass="w-[60vw] md:w-[35vw] lg:w-[15vw] xl:w-[12vw]" buttonSizeClasses="w-[60vw] h-[12vw] md:w-[35vw] md:h-[7vw] max-w-90 max-h-40 sm:max-h-18" />
                <div className="z-10 w-[30vw] pointer-events-none">
                  <Image src="/images/ui/credits.webp" alt="Credits" width={500} height={500} className="w-full h-auto object-contain" />
                </div>
              </div>
            )}
          </div>

          {/* ── Large Screen ── */}
          <div className="hidden lg:flex w-full items-center justify-between mt-15 lg:mt-10 xl:mt-15 2xl:mt-30">
            <div className="flex flex-col items-center justify-center shrink-0 ml-70 lg:ml-50 xl:ml-70 mb-0 xl:mb-10 2xl:mb-0">
              <StripMachine mw={largeMachineWidth} sw={largeStripWidth} leftOffset={largeStripLeftOffset} />
            </div>
            {!isAnimating && (
              <div className="flex flex-col items-center justify-center gap-10 lg:gap-5 xl:gap-10 ml-8 xl:ml-16 mr-60 xl:mr-60 2xl:mr-100">
                <ActionButtons sizeClasses="w-[50vw] h-[10vw] sm:w-[40vw] sm:h-[8vw] md:w-[20vw] md:h-[6vw] lg:w-[15vw] lg:h-[4vw] xl:w-[12vw] xl:h-[4vw]" />
                <EmailSection inputWidthClass="w-[60vw] md:w-[35vw] lg:w-[15vw] xl:w-[12vw]" buttonSizeClasses="w-[50vw] h-[10vw] lg:w-[15vw] lg:h-[3.9vw] xl:w-[12vw] xl:h-[3.8vw] p-0 xl:p-5" />
              </div>
            )}
            <div className="absolute bottom-10 right-10 z-10 w-[30vw] md:w-[20vw] lg:w-[15vw] pointer-events-none">
              <Image src="/images/ui/credits.webp" alt="Credits" width={500} height={500} className="w-full h-auto object-contain" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
