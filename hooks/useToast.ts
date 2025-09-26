'use client'

import { useState, useCallback } from 'react'
import { ToastProps } from '@/components/ui/Toast'

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((
    type: ToastProps['type'],
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = Date.now().toString()
    const toast: ToastProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: removeToast
    }

    setToasts(prev => [...prev, toast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((title: string, message?: string) => {
    return addToast('success', title, message)
  }, [addToast])

  const showError = useCallback((title: string, message?: string) => {
    return addToast('error', title, message, 7000) // 错误消息显示更长时间
  }, [addToast])

  const showWarning = useCallback((title: string, message?: string) => {
    return addToast('warning', title, message)
  }, [addToast])

  const showInfo = useCallback((title: string, message?: string) => {
    return addToast('info', title, message)
  }, [addToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll
  }
}

