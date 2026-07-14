"use client";

import { useEffect, useState } from "react";

/** True after the first client paint — use to skip SSR for browser-only UI. */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
