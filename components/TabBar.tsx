"use client";

export type TabId = "example" | "tryit";

interface Tab {
  id: TabId;
  label: string;
  hint: string;
}

const TABS: Tab[] = [
  { id: "example", label: "Example", hint: "see how it works" },
  { id: "tryit",   label: "Try it",  hint: "write your own code" },
];

interface TabBarProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
        flexShrink: 0,
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            style={{
              padding: "10px 18px 8px",
              background: "transparent",
              border: "none",
              borderBottom: isActive
                ? "2px solid var(--accent-primary)"
                : "2px solid transparent",
              cursor: "pointer",
              textAlign: "left",
              marginBottom: "-1px",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                display: "block",
                fontSize: "10px",
                color: "var(--text-muted)",
                marginTop: "1px",
              }}
            >
              {tab.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
