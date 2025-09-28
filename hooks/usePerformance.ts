'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
}

export function usePerformance(componentName: string) {
  const startTimeRef = useRef<number>(Date.now())
  const mountTimeRef = useRef<number | null>(null)

  useEffect(() => {
    // 组件挂载时间
    mountTimeRef.current = Date.now()
    const mountTime = mountTimeRef.current - startTimeRef.current

    // 在开发环境中记录性能指标
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${componentName} 组件加载时间: ${mountTime}ms`)
    }

    // 清理函数
    return () => {
      if (mountTimeRef.current) {
        const unmountTime = Date.now() - mountTimeRef.current
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔄 ${componentName} 组件运行时间: ${unmountTime}ms`)
        }
      }
    }
  }, [componentName])

  // 测量渲染性能
  const measureRender = (operationName: string, operation: () => void) => {
    const start = performance.now()
    operation()
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} - ${operationName}: ${(end - start).toFixed(2)}ms`)
    }
  }

  return { measureRender }
}

// Web Vitals 监控
export function useWebVitals() {
  useEffect(() => {
    // 动态导入 web-vitals 以避免增加包大小
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(console.log)
      onINP(console.log) // INP 替代了 FID
      onFCP(console.log)
      onLCP(console.log)
      onTTFB(console.log)
    }).catch(() => {
      // web-vitals 不可用时的降级处理
      console.log('Web Vitals monitoring not available')
    })
  }, [])
}

// 内存使用监控
export function useMemoryMonitor() {
  const checkMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      }
    }
    return null
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const memory = checkMemory()
        if (memory) {
          console.log(`📊 内存使用: ${memory.used}MB / ${memory.total}MB (限制: ${memory.limit}MB)`)
        }
      }, 10000) // 每10秒检查一次

      return () => clearInterval(interval)
    }
  }, [])

  return { checkMemory }
}

// 网络状态监控
export function useNetworkStatus() {
  const getConnectionInfo = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return null
  }

  useEffect(() => {
    const connection = getConnectionInfo()
    if (connection && process.env.NODE_ENV === 'development') {
      console.log('🌐 网络状态:', connection)
    }
  }, [])

  return { getConnectionInfo }
}
