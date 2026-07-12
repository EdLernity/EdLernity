"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ModalOverlayContextValue = {
  isModalOpen: boolean;
  registerModal: () => () => void;
};

const ModalOverlayContext = createContext<ModalOverlayContextValue | null>(null);

export function ModalOverlayProvider({ children }: { children: React.ReactNode }) {
  const [openCount, setOpenCount] = useState(0);

  const registerModal = useCallback(() => {
    setOpenCount((count) => count + 1);
    return () => setOpenCount((count) => Math.max(0, count - 1));
  }, []);

  const value = useMemo(
    () => ({
      isModalOpen: openCount > 0,
      registerModal,
    }),
    [openCount, registerModal]
  );

  return <ModalOverlayContext.Provider value={value}>{children}</ModalOverlayContext.Provider>;
}

export function useModalOverlay(active: boolean) {
  const context = useContext(ModalOverlayContext);

  React.useEffect(() => {
    if (!active || !context) return;
    return context.registerModal();
  }, [active, context]);
}

export function useIsModalOpen() {
  return useContext(ModalOverlayContext)?.isModalOpen ?? false;
}
