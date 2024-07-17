import { ReactNode } from "react";
import { AppProvider } from "./App";
import { PlayingProvider } from "./Playing";

export const Store = ({ children }: { children: ReactNode }) => {
  return (
    <AppProvider>
      <PlayingProvider>{children}</PlayingProvider>
    </AppProvider>
  );
};
