"use client"

import Link, { type LinkProps } from "next/link"
import { captureEvent } from "@/lib/analytics"

type TrackedAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string
  eventProps?: Record<string, unknown>
}

export function TrackedAnchor({
  eventName,
  eventProps,
  onClick,
  ...props
}: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        captureEvent(eventName, eventProps)
        onClick?.(e)
      }}
    />
  )
}

type TrackedNextLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    eventName: string
    eventProps?: Record<string, unknown>
  }

export function TrackedNextLink({
  eventName,
  eventProps,
  onClick,
  ...props
}: TrackedNextLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        captureEvent(eventName, eventProps)
        onClick?.(e)
      }}
    />
  )
}

