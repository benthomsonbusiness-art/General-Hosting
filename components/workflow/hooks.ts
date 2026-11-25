"use client";

import { useSyncExternalStore } from "react";

const KEY = "valentini-motion";
const CHANGED = "valentini-motion-change";

function readMotion(): boolean {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "on") return true;
    if (saved === "off") return false;
  } catch {
    // Storage can be blocked. The system setting still applies.
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  window.addEventListener(CHANGED, notify);
  return () => {
    media.removeEventListener("change", notify);
    window.removeEventListener(CHANGED, notify);
  };
}

/** Follows the system setting until the visitor uses the switch. */
export function useMotion(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, readMotion, () => false);
  return [
    on,
    (next) => {
      try {
        window.localStorage.setItem(KEY, next ? "on" : "off");
      } catch {
        return;
      }
      window.dispatchEvent(new Event(CHANGED));
    },
  ];
}
