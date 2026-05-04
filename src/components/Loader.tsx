"use client";

import { useEffect, useRef } from "react";

interface LoaderProps {
  size?: number; // الحجم بالبيكسل
  className?: string;
}

export function RoseLoader({ size = 64, className }: LoaderProps) {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const config = {
      particleCount: 40, // تقليل العدد للأداء الأفضل
      trailSpan: 0.25,
      durationMs: 3000,
      roseA: 9.2,
      roseABoost: 0.6,
      roseBreathBase: 0.72,
      roseBreathBoost: 0.28,
      roseScale: 2.5,
    };

    const group = groupRef.current;
    const path = pathRef.current;
    if (!group || !path) return;

    // تهيئة الجزيئات (Particles)
    const particles = Array.from({ length: config.particleCount }, () => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("fill", "currentColor");
      group.appendChild(circle);
      return circle;
    });

    const startedAt = performance.now();

    function render(now: number) {
      const time = now - startedAt;
      const progress = (time % config.durationMs) / config.durationMs;
      const detailScale = 0.8; // ثابت للحركة السلسة

      // تحديث المسار والجزيئات
      const steps = 100;
      const d = Array.from({ length: steps + 1 }, (_, i) => {
        const t = (i / steps) * Math.PI * 2;
        const a = config.roseA + detailScale * config.roseABoost;
        const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(3 * t);
        const x = 50 + Math.cos(t) * r * config.roseScale;
        const y = 50 + Math.sin(t) * r * config.roseScale;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }).join(" ");
      path!.setAttribute("d", d);

      particles.forEach((node, i) => {
        const tail = i / config.particleCount;
        const t = ((progress - tail * config.trailSpan) % 1 + 1) % 1 * Math.PI * 2;
        const r = (config.roseA) * (config.roseBreathBase) * Math.cos(3 * t);
        const x = 50 + Math.cos(t) * r * config.roseScale;
        const y = 50 + Math.sin(t) * r * config.roseScale;
        
        node.setAttribute("cx", x.toFixed(1));
        node.setAttribute("cy", y.toFixed(1));
        node.setAttribute("r", (1.5).toString());
        node.setAttribute("opacity", (1 - tail).toString());
      });

      requestAnimationFrame(render);
    }
    const id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="text-primary animate-spin-slow"
      >
        <g ref={groupRef}>
          <path ref={pathRef} stroke="currentColor" strokeWidth="2" opacity="0.2" fill="none" />
        </g>
      </svg>
    </div>
  );
}