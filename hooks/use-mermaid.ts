"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

function getMermaidThemeVariables(isDark: boolean) {
  if (isDark) {
    return {
      darkMode: true,
      background: "transparent",
      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
      fontSize: "13px",
      // Core / Flowchart tokens
      primaryColor: "#0b0f14",
      primaryTextColor: "#e6edf3",
      primaryBorderColor: "#2b3744",
      secondaryColor: "#131b24",
      secondaryTextColor: "#e6edf3",
      secondaryBorderColor: "#2b3744",
      tertiaryColor: "#0f151c",
      tertiaryTextColor: "#e6edf3",
      tertiaryBorderColor: "#1f2933",
      lineColor: "#9aa7b4",
      textColor: "#e6edf3",
      mainBkg: "#0b0f14",
      nodeBorder: "#2b3744",
      nodeTextColor: "#e6edf3",
      clusterBkg: "#121922",
      clusterBorder: "#2b3744",
      titleColor: "#3ddbc8",
      edgeLabelBackground: "#0f151c",
      // Sequence diagram tokens
      actorBkg: "#0b0f14",
      actorBorder: "#3ddbc8",
      actorTextColor: "#e6edf3",
      actorLineColor: "#2b3744",
      signalColor: "#9aa7b4",
      signalTextColor: "#e6edf3",
      labelBoxBkgColor: "#131b24",
      labelBoxBorderColor: "#2b3744",
      labelTextColor: "#3ddbc8",
      loopTextColor: "#e6edf3",
      noteBkgColor: "#131b24",
      noteBorderColor: "#2b3744",
      noteTextColor: "#e6edf3",
      activationBkgColor: "#131b24",
      activationBorderColor: "#3ddbc8",
      sequenceNumberColor: "#06201c",
    }
  }

  return {
    darkMode: false,
    background: "transparent",
    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
    fontSize: "13px",
    // Core / Flowchart tokens
    primaryColor: "#fafaf7",
    primaryTextColor: "#11181c",
    primaryBorderColor: "#c9c9c2",
    secondaryColor: "#f2f2ec",
    secondaryTextColor: "#11181c",
    secondaryBorderColor: "#c9c9c2",
    tertiaryColor: "#ffffff",
    tertiaryTextColor: "#11181c",
    tertiaryBorderColor: "#e2e2dc",
    lineColor: "#4a5560",
    textColor: "#11181c",
    mainBkg: "#fafaf7",
    nodeBorder: "#c9c9c2",
    nodeTextColor: "#11181c",
    clusterBkg: "#f4f4ef",
    clusterBorder: "#c9c9c2",
    titleColor: "#0b7a6e",
    edgeLabelBackground: "#ffffff",
    // Sequence diagram tokens
    actorBkg: "#fafaf7",
    actorBorder: "#0b7a6e",
    actorTextColor: "#11181c",
    actorLineColor: "#c9c9c2",
    signalColor: "#4a5560",
    signalTextColor: "#11181c",
    labelBoxBkgColor: "#f2f2ec",
    labelBoxBorderColor: "#c9c9c2",
    labelTextColor: "#0b7a6e",
    loopTextColor: "#11181c",
    noteBkgColor: "#f2f2ec",
    noteBorderColor: "#c9c9c2",
    noteTextColor: "#11181c",
    activationBkgColor: "#f2f2ec",
    activationBorderColor: "#0b7a6e",
    sequenceNumberColor: "#ffffff",
  }
}

export function useMermaid(
  containerRef: React.RefObject<HTMLElement | null>,
  htmlContent: string,
  onDiagramClick?: (svgHtml: string) => void
) {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const blocks = Array.from(
      container.querySelectorAll<HTMLDivElement>("div.mermaid-block")
    )
    if (blocks.length === 0) return

    let cancelled = false
    const isDark = resolvedTheme !== "light"

    async function render() {
      const mermaid = (await import("mermaid")).default

      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: getMermaidThemeVariables(isDark),
        flowchart: {
          htmlLabels: true,
          curve: "basis",
          padding: 14,
          nodeSpacing: 36,
          rankSpacing: 44,
        },
        sequence: {
          useMaxWidth: true,
          boxMargin: 8,
          noteMargin: 10,
          messageMargin: 32,
          mirrorActors: false,
        },
      })

      for (let i = 0; i < blocks.length; i++) {
        if (cancelled) break
        const block = blocks[i]

        // Cache raw mermaid source on dataset before first innerHTML replacement
        // so theme toggles can re-render from the original definition.
        let definition = block.dataset.mermaidDef
        if (!definition) {
          const scriptEl = block.querySelector<HTMLScriptElement>(
            "script[type='application/mermaid']"
          )
          definition = scriptEl?.textContent ?? ""
          if (definition.trim()) {
            block.dataset.mermaidDef = definition
          }
        }

        if (!definition || !definition.trim()) continue

        try {
          const id = `mermaid-svg-${isDark ? "dark" : "light"}-${Date.now()}-${i}`
          const { svg } = await mermaid.render(id, definition)
          if (cancelled) break
          block.innerHTML = svg

          if (onDiagramClick) {
            block.style.cursor = "zoom-in"
            block.setAttribute("role", "button")
            block.setAttribute("tabindex", "0")
            block.setAttribute("aria-label", "Enlarge architecture diagram")
            block.onclick = () => {
              onDiagramClick(block.innerHTML)
            }
            block.onkeydown = (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onDiagramClick(block.innerHTML)
              }
            }
          }
        } catch (err) {
          console.error("Mermaid render error:", err)
          block.innerHTML = `<pre class="text-xs font-mono text-destructive whitespace-pre-wrap text-left p-2">${String(err)}</pre>`
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [containerRef, htmlContent, resolvedTheme, onDiagramClick])
}
