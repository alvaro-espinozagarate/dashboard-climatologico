interface Props {
  label:   string
  value:   string
  sub:     string
  danger?: boolean
  warn?:   boolean
}

export function KPICard({ label, value, sub, danger, warn }: Props) {
  const style = danger
    ? {
        background: "var(--alert-frost-severe-bg)",
        border: `1px solid var(--alert-frost-severe-border)`,
        valueColor: "var(--alert-frost-severe-text)",
      }
    : warn
    ? {
        background: "var(--alert-frost-moderate-bg)",
        border: `1px solid var(--alert-frost-moderate-border)`,
        valueColor: "var(--alert-frost-moderate-text)",
      }
    : {
        background: "var(--color-bg-surface)",
        border: `1px solid var(--color-border)`,
        valueColor: "var(--color-text-primary)",
      }

  return (
    <div style={{
      borderRadius: 12,
      padding: "14px 16px",
      background: style.background,
      border: style.border,
      transition: "background 0.25s ease, border 0.25s ease",
    }}>
      <p style={{
        fontSize: 11,
        color: "var(--color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 6,
      }}>{label}</p>
      <p style={{
        fontSize: 24,
        fontWeight: 500,
        color: style.valueColor,
        lineHeight: 1,
        marginBottom: 6,
      }}>{value}</p>
      <p style={{
        fontSize: 11,
        color: "var(--color-text-secondary)",
      }}>{sub}</p>
    </div>
  )
}
