export interface ArchDiagramProps {
  nodes: [string, string, string]
  className?: string
  variant?: "default" | "blueprint"
}

export function ArchDiagram({
  nodes,
  className,
  variant = "default",
}: ArchDiagramProps) {
  const [a, b, c] = nodes
  const label = `Architecture: ${a} to ${b} to ${c}`

  if (variant === "blueprint") {
    return (
      <svg
        viewBox="0 0 320 56"
        width="320"
        height="56"
        role="img"
        aria-label={label}
        className={
          className ??
          "w-full h-auto aspect-[40/7] block text-foreground select-none"
        }
      >
        {/* Node 1: Client / Source */}
        <g className="transition-transform duration-300">
          <rect
            x="2"
            y="10"
            width="88"
            height="36"
            rx="4"
            fill="var(--card)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
          <circle cx="12" cy="28" r="2.2" fill="var(--muted-foreground)" opacity="0.6" />
          <text
            x="50"
            y="31"
            textAnchor="middle"
            fill="currentColor"
            fontSize="10"
            fontWeight="500"
            fontFamily="var(--font-mono), monospace"
          >
            {a}
          </text>
        </g>

        {/* Connector 1 -> 2 */}
        <line
          x1="90"
          y1="28"
          x2="114"
          y2="28"
          stroke="var(--border-strong)"
          strokeWidth="1.25"
        />
        <line
          x1="90"
          y1="28"
          x2="114"
          y2="28"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <polyline
          points="110,24.5 114.5,28 110,31.5"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.25"
        />

        {/* Node 2: Core Engine (Highlighted Accent Node) */}
        <g>
          <rect
            x="116"
            y="8"
            width="88"
            height="40"
            rx="4"
            fill="color-mix(in srgb, var(--primary) 9%, var(--card))"
            stroke="var(--primary)"
            strokeWidth="1.25"
          />
          <circle cx="126" cy="28" r="2.5" fill="var(--primary)" />
          <text
            x="164"
            y="31"
            textAnchor="middle"
            fill="currentColor"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font-mono), monospace"
          >
            {b}
          </text>
        </g>

        {/* Connector 2 -> 3 */}
        <line
          x1="204"
          y1="28"
          x2="228"
          y2="28"
          stroke="var(--border-strong)"
          strokeWidth="1.25"
        />
        <line
          x1="204"
          y1="28"
          x2="228"
          y2="28"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <polyline
          points="224,24.5 228.5,28 224,31.5"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.25"
        />

        {/* Node 3: Data / Target */}
        <g>
          <rect
            x="230"
            y="10"
            width="88"
            height="36"
            rx="4"
            fill="var(--card)"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
          <circle cx="240" cy="28" r="2.2" fill="var(--muted-foreground)" opacity="0.6" />
          <text
            x="278"
            y="31"
            textAnchor="middle"
            fill="currentColor"
            fontSize="10"
            fontWeight="500"
            fontFamily="var(--font-mono), monospace"
          >
            {c}
          </text>
        </g>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 320 48"
      width="320"
      height="48"
      role="img"
      aria-label={label}
      className={className ?? "w-full h-auto aspect-[20/3] block text-foreground select-none"}
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
