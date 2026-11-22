"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import { useMermaid } from "@/hooks/use-mermaid"
import { MediaLightbox, type LightboxItem } from "@/components/media-lightbox"

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
  const [modalItem, setModalItem] = useState<LightboxItem | null>(null)

  useEffect(() => {
    containerRef.current = document.getElementById(targetId)
  }, [targetId])

  const handleDiagramClick = useCallback((svgHtml: string) => {
    setModalItem({ kind: "mermaid", svgHtml })
  }, [])

  useMermaid(
    containerRef,
    targetId,
    enableModal ? handleDiagramClick : undefined
  )

  return (
    <MediaLightbox item={modalItem} onClose={() => setModalItem(null)} />
  )
}

export function MermaidArticle({
  htmlContent,
  id,
  enableModal = true,
}: MermaidArticleProps) {
  const [modalItem, setModalItem] = useState<LightboxItem | null>(null)

  const handleDiagramClick = useCallback((svgHtml: string) => {
    setModalItem({ kind: "mermaid", svgHtml })
  }, [])

  return (
    <>
      <ArticleInner
        htmlContent={htmlContent}
        id={id}
        onDiagramClick={enableModal ? handleDiagramClick : undefined}
      />

      <MediaLightbox item={modalItem} onClose={() => setModalItem(null)} />
    </>
  )
}
