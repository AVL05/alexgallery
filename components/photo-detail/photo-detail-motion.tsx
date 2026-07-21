"use client";

import { PhotoMotionGroup } from "@/components/motion/photo-reveal";

export function PhotoDetailMotion({ photoId, children }: { photoId: number; children: React.ReactNode }) {
  return (
    <PhotoMotionGroup
      as="article"
      mode="mount"
      editorial
      groupKey={`photo-detail-${photoId}`}
    >
      {children}
    </PhotoMotionGroup>
  );
}
