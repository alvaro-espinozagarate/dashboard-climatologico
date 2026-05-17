interface Props {
  label:   string
  value:   string
  sub:     string
  danger?: boolean
  warn?:   boolean
}

export function KPICard({ label, value, sub, danger, warn }: Props) {
  const bg     = danger ? "var(--alert-frost-severe-bg)"
                : warn  ? "var(--alert-frost-mod-bg)"
                :         "var(--bg-surface)"
  const border = danger ? "var(--alert-frost-severe-border)"
                : warn  ? "var(--alert-frost-mod-border)"
                :         "var(--border)"
  const color  = danger ? "var(--alert-frost-severe-text)"
                : warn  ? "var(--alert-frost-mod-text)"
                :         "var(--text-1)"

  return (
    <div style={{
      borderRadius: 12, padding: "14px 16px",
      background: bg,
      border: `1px solid ${border}`,
      transition: "background 0.25s, border 0.25s",
    }}>
      <p style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase",
        letterSpacing: "0.06em", marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 500, color, lineHeight: 1, marginBottom: 6 }}>{value}</p>
      <p style={{ fontSize: 11, color: "var(--text-2)" }}>{sub}</p>
    </div>
  )
}
