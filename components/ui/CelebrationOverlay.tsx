'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'

interface CelebrationOverlayProps {
  show: boolean
  title: string
  message?: string
  onClose: () => void
  autoCloseAfter?: number
}

export function CelebrationOverlay({
  show,
  title,
  message,
  onClose,
  autoCloseAfter = 3200,
}: CelebrationOverlayProps) {
  useEffect(() => {
    if (!show) return

    const duration = autoCloseAfter
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 }

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        window.clearInterval(interval)
        onClose()
        return
      }

      const particleCount = 60 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      })
    }, 200)

    return () => window.clearInterval(interval)
  }, [show, autoCloseAfter, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
            <button
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              太棒了！继续探索
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


