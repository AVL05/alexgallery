"use client";

import {
  getPhotoMotionRuntimeOptions,
  type PhotoMotionRuntimeOptions,
} from "@/lib/motion/photo-motion";
import { useEffect, useState } from "react";

export function usePhotoMotionRuntime() {
  const [options, setOptions] = useState<PhotoMotionRuntimeOptions>(() =>
    getPhotoMotionRuntimeOptions(),
  );

  useEffect(() => {
    setOptions(getPhotoMotionRuntimeOptions(window.location.search));
  }, []);

  return options;
}
