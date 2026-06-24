"use client";

import { useEffect, useState, useCallback } from "react";

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  const onMouse = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (!visible) setVisible(true);
  }, [visible]);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    window.addEventListener("mousemove", onMouse);
    document.documentElement.style.cursor = "none";

    const handleOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor-hover], input, textarea, select")) {
        setHover(true);
      } else {
        setHover(false);
      }
    };

    window.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.style.cursor = "";
    };
  }, [onMouse]);

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] hidden transition-[width,height] duration-300 sm:block"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`rounded-full transition-all duration-300 ${
            hover ? "h-8 w-8 bg-glass-accent/20" : "h-3 w-3 bg-glass-accent/70"
          }`}
          style={{
            boxShadow: hover
              ? "0 0 30px rgba(220,38,38,0.25)"
              : "0 0 10px rgba(220,38,38,0.4)",
          }}
        />
      </div>
      <div
        className="pointer-events-none fixed z-[9998] hidden rounded-full bg-glass-accent/5 sm:block"
        style={{
          left: pos.x,
          top: pos.y,
          width: hover ? 60 : 40,
          height: hover ? 60 : 40,
          transform: "translate(-50%, -50%)",
          transition: "width 0.4s ease, height 0.4s ease, opacity 0.4s ease",
        }}
      />
    </>
  );
}
