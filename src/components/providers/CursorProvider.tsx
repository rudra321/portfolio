"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CursorType = "default" | "button" | "link" | "card";

interface CursorContextValue {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
}

const CursorContext = createContext<CursorContextValue>({
  cursorType: "default",
  setCursorType: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorType, setCursorType] = useState<CursorType>("default");

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      {children}
    </CursorContext.Provider>
  );
}
