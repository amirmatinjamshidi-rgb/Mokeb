"use client";

import { createContext, useContext, type ReactNode } from "react";

type PanelDateContextValue = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const PanelDateContext = createContext<PanelDateContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
  value: PanelDateContextValue;
};

export function PanelDateProvider({ children, value }: ProviderProps) {
  return (
    <PanelDateContext.Provider value={value}>{children}</PanelDateContext.Provider>
  );
}

export function usePanelDate() {
  const context = useContext(PanelDateContext);
  if (!context) {
    throw new Error("usePanelDate must be used within PanelDateProvider");
  }
  return context;
}
