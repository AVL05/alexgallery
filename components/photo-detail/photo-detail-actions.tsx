"use client";

import type { PhotoDetailDictionary } from "@/types/dictionary";
import { usePhotoDetailContext } from "@/components/photo-detail/photo-detail-context";
import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { useState } from "react";
import { getCleanShareUrl } from "@/lib/photo-detail/interaction";
import { Magnetic } from "@/components/interactions/magnetic";
import { useEffect, useRef } from "react";

export function PhotoDetailActions({ dictionary, imageHref }: { dictionary: PhotoDetailDictionary; imageHref: string }) {
  const { current } = usePhotoDetailContext();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const statusTimerRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (statusTimerRef.current !== null) window.clearTimeout(statusTimerRef.current);
  }, []);
  const showTemporaryStatus = (nextStatus: "copied" | "error") => {
    if (statusTimerRef.current !== null) window.clearTimeout(statusTimerRef.current);
    setStatus(nextStatus);
    statusTimerRef.current = window.setTimeout(() => {
      statusTimerRef.current = null;
      setStatus("idle");
    }, 1800);
  };
  const cleanUrl = () => getCleanShareUrl(window.location.origin, window.location.pathname);
  const copy = async () => {
    try {
      const value = cleanUrl();
      let copied = false;
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value);
          copied = true;
        } catch {
          copied = false;
        }
      }
      if (!copied) {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Clipboard unavailable");
      }
      showTemporaryStatus("copied");
    }
    catch { showTemporaryStatus("error"); }
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: current.title, text: current.description, url: cleanUrl() });
      else await copy();
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") showTemporaryStatus("error");
    }
  };
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-4">
      <Magnetic><button type="button" onClick={share} className="rv-editorial-link" data-press-feedback><span data-magnetic-content className="inline-flex items-center gap-[0.65rem]"><Share2 aria-hidden="true" className="size-4" />{dictionary.share}</span></button></Magnetic>
      <Magnetic><button type="button" onClick={copy} className="rv-editorial-link" data-press-feedback><span data-magnetic-content className="inline-flex items-center gap-[0.65rem]">{status === "copied" ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}{status === "copied" ? dictionary.linkCopied : dictionary.copyLink}</span></button></Magnetic>
      <Magnetic><a href={imageHref} target="_blank" rel="noreferrer" className="rv-editorial-link" data-press-feedback><span data-magnetic-content className="inline-flex items-center gap-[0.65rem]"><ExternalLink aria-hidden="true" className="size-4" />{dictionary.openImage}</span></a></Magnetic>
      <span className="sr-only" role="status" aria-live="polite">{status === "copied" ? dictionary.linkCopied : status === "error" ? dictionary.shareUnavailable : ""}</span>
    </div>
  );
}
