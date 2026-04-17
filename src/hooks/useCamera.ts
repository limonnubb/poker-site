'use client'

import { useEffect, useRef, useState } from 'react'

export function useCamera(enabled: boolean) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!enabled) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((mediaStream) => {
        setStream(mediaStream)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      })

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [enabled])

  return { stream, error, isLoading }
}