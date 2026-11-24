"use client";

import { useEffect } from "react";

export function InputModality() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.modality = "pointer";

    const onPointer = () => {
      root.dataset.modality = "pointer";
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key.startsWith("Arrow")) {
        root.dataset.modality = "keyboard";
      }
    };

    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
