"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Background() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-red-500 pointer-events-none z-0 flex flex-col items-center justify-center transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className="rounded-full overflow-hidden">
          <Image
            src="/don.png"
            alt="Don"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
        <h1 className="text-8xl uppercase font-bold text-neutral-900 mt-4">
          Datum Dons
        </h1>
        <h2 className="text-5xl font-slab uppercase text-neutral-800 mt-2">
          Community Code Review
        </h2>
      </div>
    </div>
  );
}
