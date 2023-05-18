"use client";
import { useThemeStore } from "@/store";
import { useEffect, useState, ReactNode } from "react";

function Hydrate({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const themeStore = useThemeStore();
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return (
    <>
      {isHydrated ? (
        <body
          className={"px-4 xl:px-48 font-roboto"}
          data-theme={themeStore.mode}
        >
          {children}
        </body>
      ) : (
        <body></body>
      )}
    </>
  );
}

export default Hydrate;
