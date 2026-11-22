"use client"

import { useEffect } from "react"

function getMermaidThemeVariables(isDark: boolean) {
  if (isDark) {
    return {
      darkMode: true,
      background: "transparent",
      fontFamily: "var(--display), system-ui, sans-serif",
      fontSize: "13px",
      primaryColor: "#0F1426",
      primaryTextColor: "#EDF0F7",
      primaryBorderColor: "#2A3354",
      secondaryColor: "#171E36",
      secondaryTextColor: "#EDF0F7",
      secondaryBorderColor: "#2A3354",
      tertiaryColor: "#173A47",
      tertiaryTextColor: "#EDF0F7",
      tertiaryBorderColor: "#2A3354",
      lineColor: "#9AA3BA",
      textColor: "#EDF0F7",
      mainBkg: "#0F1426",
      nodeBorder: "#2A3354",
      nodeTextColor: "#EDF0F7",
      clusterBkg: "#171E36",
      clusterBorder: "#2A3354",
      titleColor: "#6CC4CC",
      edgeLabelBackground: "#171E36",
      actorBkg: "#0F1426",
      actorBorder: "#6CC4CC",
      actorTextColor: "#EDF0F7",
      actorLineColor: "#2A3354",
      signalColor: "#9AA3BA",
      signalTextColor: "#EDF0F7",
      labelBoxBkgColor: "#171E36",
      labelBoxBorderColor: "#2A3354",
      labelTextColor: "#6CC4CC",
      loopTextColor: "#EDF0F7",
      noteBkgColor: "#171E36",
      noteBorderColor: "#2A3354",
      noteTextColor: "#EDF0F7",
      activationBkgColor: "#173A47",
      activationBorderColor: "#6CC4CC",
      sequenceNumberColor: "#18203A",
    }
  }

  return {
    darkMode: false,
    background: "transparent",
    fontFamily: "var(--display), system-ui, sans-serif",
    fontSize: "13px",
    primaryColor: "#F4F6F8",
    primaryTextColor: "#18203A",
    primaryBorderColor: "#D9DEE6",
    secondaryColor: "#FFFFFF",
    secondaryTextColor: "#18203A",
    secondaryBorderColor: "#D9DEE6",
    tertiaryColor: "#DCEFF0",
    tertiaryTextColor: "#18203A",
    tertiaryBorderColor: "#D9DEE6",
    lineColor: "#586179",
    textColor: "#18203A",
    mainBkg: "#F4F6F8",
    nodeBorder: "#D9DEE6",
    nodeTextColor: "#18203A",
    clusterBkg: "#FFFFFF",
    clusterBorder: "#D9DEE6",
    titleColor: "#1F6F78",
    edgeLabelBackground: "#FFFFFF",
    actorBkg: "#F4F6F8",
    actorBorder: "#1F6F78",
    actorTextColor: "#18203A",
    actorLineColor: "#D9DEE6",
    signalColor: "#586179",
    signalTextColor: "#18203A",
    labelBoxBkgColor: "#FFFFFF",
    labelBoxBorderColor: "#D9DEE6",
    labelTextColor: "#1F6F78",
    loopTextColor: "#18203A",
    noteBkgColor: "#DCEFF0",
    noteBorderColor: "#D9DEE6",
    noteTextColor: "#18203A",
    activationBkgColor: "#DCEFF0",
    activationBorderColor: "#1F6F78",
    sequenceNumberColor: "#FFFFFF",
  }
}

function isDocumentDark(): boolean {
  if (typeof document === "undefined") return false
  const attr = document.documentElement.getAttribute("data-theme")
  if (attr === "dark") return true
  if (attr === "light") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export function useMermaid(
  containerRef: React.RefObject<HTMLElement | null>,
  htmlContent: string,
  onDiagramClick?: (svgHtml: string) => void
) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const blocks = Array.from(
      container.querySelectorAll<HTMLDivElement>("div.mermaid-block")
    )
    if (blocks.length === 0) return

    let cancelled = false

    async function render() {
      const isDark = isDocumentDark()
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
        }
      }
    }

    let hasRenderedOnce = false
    let io: IntersectionObserver | null = null

    const triggerRender = () => {
      if (hasRenderedOnce) return
      hasRenderedOnce = true
      io?.disconnect()
      render()
    }

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            triggerRender()
          }
        },
        { rootMargin: "300px 0px" }
      )
      blocks.forEach((block) => io!.observe(block))
    } else {
      triggerRender()
    }

    const observer = new MutationObserver(() => {
      if (hasRenderedOnce) render()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => {
      cancelled = true
      io?.disconnect()
      observer.disconnect()
    }
  }, [containerRef, htmlContent, onDiagramClick])
}
