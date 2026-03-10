"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Shared camera hook used by both the capture and retake pages.
 * Handles device enumeration, stream lifecycle, and camera switching.
 */
export function useCamera() {
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const [error, setError] = useState(null);

  async function startCamera(deviceId = null) {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { facingMode: "user",            width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setError(null);
    } catch (e) {
      setError(
        e?.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : `Camera error: ${e?.message || String(e)}`,
      );
    }
  }

  // Start camera on mount, stop stream on unmount
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Captures the current video frame as a 1920×1080 JPEG data URL.
   * Mirrors the image unless it's a mobile back camera (index 1).
   * @param {{ isMobile: boolean, cameraIndex: number }} opts
   * @returns {string | null}
   */
  function captureFrameUrl({ isMobile = false, cameraIndex = 0 } = {}) {
    const video = videoRef.current;
    if (!video) return null;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;

    const targetAspect = 16 / 9;
    const currentAspect = w / h;
    let sourceX = 0, sourceY = 0, sourceWidth = w, sourceHeight = h;

    if (currentAspect < targetAspect) {
      sourceHeight = w / targetAspect;
      sourceY = (h - sourceHeight) / 2;
    } else if (currentAspect > targetAspect) {
      sourceWidth = h * targetAspect;
      sourceX = (w - sourceWidth) / 2;
    }

    const cw = 1920, ch = 1080;
    const canvas = document.createElement("canvas");
    canvas.width  = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Mirror selfie — skip for mobile back camera
    if (!(isMobile && cameraIndex === 1)) {
      ctx.translate(cw, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, cw, ch);
    return canvas.toDataURL("image/jpeg", 0.95);
  }

  return { videoRef, streamRef, startCamera, captureFrameUrl, error, setError };
}
