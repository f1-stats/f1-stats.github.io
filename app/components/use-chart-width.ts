"use client";

import { useEffect, useRef, useState } from "react";

export function useChartWidth(initialWidth: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      if (nextWidth > 0) setWidth((current) => current === nextWidth ? current : nextWidth);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return [containerRef, width] as const;
}