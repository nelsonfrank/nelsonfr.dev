"use client"

import { useEffect, useState } from "react"

export function LiveClock() {
  const [time, setTime] = useState<string>("--:--")

  useEffect(() => {
    function tick() {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Dar_es_Salaam",
        }).format(new Date())
        setTime(formatted)
      } catch {
        // Fallback silently if Intl timezone is unsupported
      }
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  return <b id="clock">{time}</b>
}

