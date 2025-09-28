'use client'

import { useCallback, useState } from 'react'
import { toPng } from 'html-to-image'

interface ShareResult {
  status: 'idle' | 'generating' | 'success' | 'error'
  error?: string
  url?: string
}

export function useShareCard() {
  const [result, setResult] = useState<ShareResult>({ status: 'idle' })

  const generate = useCallback(async (element: HTMLElement) => {
    setResult({ status: 'generating' })
    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: '#FFFFFF',
        quality: 0.95,
      })
      setResult({ status: 'success', url: dataUrl })
      return dataUrl
    } catch (error) {
      console.error('[useShareCard] Failed to export', error)
      setResult({ status: 'error', error: (error as Error).message })
      return undefined
    }
  }, [])

  const reset = useCallback(() => setResult({ status: 'idle' }), [])

  return {
    status: result.status,
    error: result.error,
    url: result.url,
    generate,
    reset,
  }
}


