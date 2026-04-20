"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

export function Spotlight({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0%, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0%, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0%, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", () => setIsHovered(true));
    el.addEventListener("mouseleave", () => setIsHovered(false));
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", () => setIsHovered(true));
      el.removeEventListener("mouseleave", () => setIsHovered(false));
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      animate={{
        opacity: 1,
      }}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Main spotlight */}
      <motion.div
        animate={
          isHovered
            ? { x: pos.x - width / 2, y: pos.y - height / 2, opacity: 1 }
            : { x: "30%", y: translateY, opacity: 1 }
        }
        transition={{ duration: duration, ease: "easeOut" }}
        style={{
          width,
          height,
          background: gradientFirst,
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      {/* Secondary spotlight */}
      <motion.div
        animate={
          isHovered
            ? { x: pos.x - smallWidth / 2, y: pos.y - height / 2, opacity: 1 }
            : { x: "25%", y: translateY + 100, opacity: 1 }
        }
        transition={{ duration: duration, ease: "easeOut" }}
        style={{
          width: smallWidth,
          height,
          background: gradientSecond,
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />
      {/* Tertiary spotlight */}
      <motion.div
        animate={
          isHovered
            ? { x: pos.x - width / 2 + xOffset, y: pos.y - height / 2, opacity: 1 }
            : { x: "55%", y: translateY, opacity: 1 }
        }
        transition={{ duration: duration + 1, ease: "easeOut" }}
        style={{
          width,
          height,
          background: gradientThird,
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
    </motion.div>
  );
}
