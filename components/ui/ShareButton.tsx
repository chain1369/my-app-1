'use client'

import { useRef } from 'react'
import { Share2 } from 'lucide-react'
import { CleanButton } from './CleanButton'
import { useShareCard } from '@/hooks/useShareCard'

interface ShareButtonProps {
  targetId: string
}

export function ShareButton({ targetId }: ShareButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const { status, url, generate } = useShareCard()

  const handleShare = async () => {
    const element = document.getElementById(targetId)
    if (!element) return
    const imageUrl = await generate(element)
    if (imageUrl && ref.current) {
      ref.current.href = imageUrl
      ref.current.download = `life-tracker-${Date.now()}.png`
      ref.current.click()
    }
  }

  return (
    <>
      <CleanButton
        variant="secondary"
        size="sm"
        onClick={handleShare}
        loading={status === 'generating'}
      >
        <Share2 className="h-4 w-4 mr-2" />
        导出分享卡片
      </CleanButton>
      <a ref={ref} className="hidden" aria-hidden href="#" />
    </>
  )
}


