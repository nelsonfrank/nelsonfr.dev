// TODO(content): Replace [N] placeholders with real verified metrics.
// In production builds, the proof strip is automatically hidden while all values remain placeholders.
export const PROOF_STATS = [
  {
    value: "[N]+", // TODO(content): Replace with actual years building production systems
    caption: "years building production systems",
  },
  {
    value: "[N]", // TODO(content): Replace with actual shipped projects or users served
    caption: "shipped projects or users served",
  },
  {
    value: "[N] ms", // TODO(content): Replace with actual headline performance metric
    caption: "headline performance metric",
  },
] as const

export function ProofStrip() {
  const allPlaceholders = PROOF_STATS.every((stat) => stat.value.includes("[N]"))
  const forceShow = process.env.NEXT_PUBLIC_SHOW_PROOF_STRIP === "true"

  if (process.env.NODE_ENV === "production" && allPlaceholders && !forceShow) {
    return null
  }

  return (
    <section aria-label="Key metrics" className="border-t border-b border-border">
      <div className="page-container py-8">
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
        >
          {PROOF_STATS.map((stat) => (
            <div key={stat.caption} className="space-y-1">
              <p className="text-[32px] font-semibold tracking-tight leading-none text-foreground">
                {stat.value}
              </p>
              <p className="meta-mono">{stat.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
