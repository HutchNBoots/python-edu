interface XPRewardNoticeProps {
  xp: number;
}

export default function XPRewardNotice({ xp }: XPRewardNoticeProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "16px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: "var(--accent-primary-subtle)",
          border: "1px solid var(--accent-primary-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--accent-primary)",
          flexShrink: 0,
        }}
      >
        +{xp}
      </div>
      <p
        style={{
          fontSize: "13px",
          color: "var(--accent-primary)",
          margin: 0,
        }}
      >
        Complete this lesson to earn{" "}
        <strong>{xp} XP</strong>
      </p>
    </div>
  );
}
