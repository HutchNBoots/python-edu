import KeyConceptBox from "@/components/KeyConceptBox";
import XPRewardNotice from "@/components/XPRewardNotice";

interface LessonPanelProps {
  title: string;
  contentHtml: string;
  keyConcept: string;
  xp: number;
  skillProgress: number; // 0–100, for the green progress bar
}

export default function LessonPanel({
  title,
  contentHtml,
  keyConcept,
  xp,
  skillProgress,
}: LessonPanelProps) {
  return (
    <section
      aria-label="Lesson"
      className="themed-scroll"
      style={{
        flex: 1,
        backgroundColor: "var(--bg-base)",
        borderRight: "1px solid var(--border-subtle)",
        padding: "18px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Lesson heading */}
      <h1
        style={{
          fontSize: "17px",
          fontWeight: 500,
          color: "var(--text-primary)",
          marginTop: 0,
          marginBottom: "12px",
        }}
      >
        {title}
      </h1>

      {/* Explanation body */}
      <div
        className="lesson-body"
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          lineHeight: "1.75",
          marginBottom: "20px",
        }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Key concept box */}
      <KeyConceptBox concept={keyConcept} />

      {/* XP reward notice */}
      <XPRewardNotice xp={xp} />

      {/* Spacer to push progress bar to bottom */}
      <div style={{ flex: 1 }} />

      {/* Green skill progress bar */}
      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
          }}
        >
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Skill progress
          </span>
          <span style={{ fontSize: "11px", color: "var(--accent-green)" }}>
            {skillProgress}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={skillProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Skill progress: ${skillProgress}%`}
          style={{
            height: "5px",
            backgroundColor: "var(--accent-green-subtle)",
            borderRadius: "9999px",
            overflow: "hidden",
            border: "1px solid var(--accent-green-border)",
          }}
        >
          <div
            style={{
              width: `${skillProgress}%`,
              height: "100%",
              backgroundColor: "var(--accent-green)",
              borderRadius: "9999px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
    </section>
  );
}
