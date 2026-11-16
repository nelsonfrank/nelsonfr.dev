export interface ArchDiagramProps {
  nodes: [string, string, string]
  className?: string
}

export function ArchDiagram({ nodes, className }: ArchDiagramProps) {
  const [a, b, c] = nodes
  const label = `Architecture: ${a} to ${b} to ${c}`

  return (
    <svg
      viewBox="0 0 320 48"
      width="320"
      height="48"
      role="img"
      aria-label={label}
      className={className ?? "w-full h-12 text-foreground select-none"}
    >
      {/* Box 1 */}
      <rect
        x="1"
        y="8"
        width="88"
        height="32"
        rx="4"
        fill="var(--background)"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />
      <text
        x="45"
        y="27"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        fontFamily="var(--font-mono), monospace"
      >
        {a}
      </text>

      {/* Arrow 1 -> 2 */}
      <line
        x1="89"
        y1="24"
        x2="113"
        y2="24"
        stroke="var(--muted-foreground)"
        strokeWidth="1"
      />
      <polyline
        points="109,20 114,24 109,28"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth="1"
      />

      {/* Box 2 */}
      <rect
        x="116"
        y="8"
        width="88"
        height="32"
        rx="4"
        fill="var(--background)"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />
      <text
        x="160"
        y="27"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        fontFamily="var(--font-mono), monospace"
      >
        {b}
      </text>

      {/* Arrow 2 -> 3 */}
      <line
        x1="204"
        y1="24"
        x2="228"
        y2="24"
        stroke="var(--muted-foreground)"
        strokeWidth="1"
      />
      <polyline
        points="224,20 229,24 224,28"
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth="1"
      />

      {/* Box 3 */}
      <rect
        x="231"
        y="8"
        width="88"
        height="32"
        rx="4"
        fill="var(--background)"
        stroke="var(--border-strong)"
        strokeWidth="1"
      />
      <text
        x="275"
        y="27"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        fontFamily="var(--font-mono), monospace"
      >
        {c}
      </text>
    </svg>
  )
}
