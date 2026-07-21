"use client";

import { useEffect } from "react";
import { ensurePromiseWithResolvers } from "@/lib/promiseWithResolversPolyfill";

/** Install browser polyfills as early as possible on the client. */
export default function ClientPolyfills() {
  useEffect(() => {
    ensurePromiseWithResolvers();
  }, []);

  // Also run during module init for the first paint of client components.
  if (typeof window !== "undefined") {
    ensurePromiseWithResolvers();
  }

  return null;
}
