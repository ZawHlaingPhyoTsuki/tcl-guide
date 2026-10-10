import React from "react";

import { PublicHeader } from "@/components/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-svh grid-rows-[auto_1fr]">
      <PublicHeader />
      {children}
    </div>
  );
}
