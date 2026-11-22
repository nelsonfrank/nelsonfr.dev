"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import { useMermaid } from "@/hooks/use-mermaid"

interface MermaidArticleProps {
  htmlContent: string
  id?: string
  enableModal?: boolean
}

const ArticleInner = memo(function ArticleInner({
  htmlContent,
  id,
  onDiagramClick,
}: {
  htmlContent: string
  id?: string
  onDiagramClick?: (svgHtml: string) => void
}) {
  const articleRef = useRef<HTMLElement | null>(null)
  useMermaid(articleRef, htmlContent, onDiagramClick)

  return (
    <article
      ref={articleRef}
      id={id}
      className="prose"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
})

export function MermaidHydrator({
  targetId = "art",
  enableModal = true,
}: {
  targetId?: string
  enableModal?: boolean
}) {
  const containerRef = useRef<HTMLElement | null>(null)
  const [modalSvg, setModalSvg] = useState<string | null>(null)

  useEffect(() => {
    containerRef.current = document.getElementById(targetId)
  }, [targetId])

  const handleDiagramClick = useCallback((svgHtml: string) => {
    setModalSvg(svgHtml)
  }, [])

  useMermaid(
    containerRef,
    targetId,
    enableModal ? handleDiagramClick : undefined
  )

  useEffect(() => {
    if (!modalSvg) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalSvg(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modalSvg])

  if (!modalSvg) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "var(--glass)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
      onClick={() => setModalSvg(null)}
    >
      <button
        type="button"
        onClick={() => setModalSvg(null)}
        className="btn s"
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "1.25rem",
          background: "var(--surface)",
        }}
        aria-label="Close diagram"
      >
        Close
      </button>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          padding: "1.5rem",
          maxWidth: "64rem",
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        data-mermaid-modal
        dangerouslySetInnerHTML={{ __html: modalSvg }}
      />
    </div>
  )
}

export function MermaidArticle({
  htmlContent,
  id,
  enableModal = true,
}: MermaidArticleProps) {
  const [modalSvg, setModalSvg] = useState<string | null>(null)

  const handleDiagramClick = useCallback((svgHtml: string) => {
    setModalSvg(svgHtml)
  }, [])

  useEffect(() => {
    if (!modalSvg) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalSvg(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modalSvg])

  return (
    <>
      <ArticleInner
        htmlContent={htmlContent}
        id={id}
        onDiagramClick={enableModal ? handleDiagramClick : undefined}
      />

      {modalSvg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "var(--glass)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setModalSvg(null)}
        >
          <button
            type="button"
            onClick={() => setModalSvg(null)}
            className="btn s"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "var(--surface)",
            }}
            aria-label="Close diagram"
          >
            Close
          </button>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "14px",
              padding: "1.5rem",
              maxWidth: "64rem",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
            data-mermaid-modal
            dangerouslySetInnerHTML={{ __html: modalSvg }}
          />
        </div>
      )}
    </>
  )
}

