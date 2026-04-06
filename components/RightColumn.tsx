"use client";

import { useState } from "react";
import TabBar, { TabId } from "@/components/TabBar";
import ExampleTabPanel from "@/components/ExampleTabPanel";
import TryItTabPanel from "@/components/TryItTabPanel";

interface RightColumnProps {
  code: string;
  starterCode: string;
}

export default function RightColumn({ code, starterCode }: RightColumnProps) {
  const [activeTab, setActiveTab] = useState<TabId>("example");

  return (
    <section
      aria-label="Code"
      style={{
        flex: 1,
        backgroundColor: "var(--bg-base)",
        padding: "0 18px 18px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TabBar active={activeTab} onChange={setActiveTab} />

      <div
        style={{
          flex: 1,
          paddingTop: "14px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {activeTab === "example" ? (
          <ExampleTabPanel
            code={code}
            onTryIt={() => setActiveTab("tryit")}
          />
        ) : (
          <TryItTabPanel starterCode={starterCode} />
        )}
      </div>
    </section>
  );
}
