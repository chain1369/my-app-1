'use client'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class DataCache {
  private cache = new Map<string, CacheItem<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5分钟

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    this.cache.set(key, item)
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // 清理过期项
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // 获取缓存统计信息
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// 单例模式
export const dataCache = new DataCache()

// 自动清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    dataCache.cleanup()
  }, 60000) // 每分钟清理一次
}

// 缓存装饰器
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    
    // 尝试从缓存获取
    const cached = dataCache.get(key)
    if (cached !== null) {
      console.log(`🎯 缓存命中: ${key}`)
      return cached
    }

    // 缓存未命中，执行原函数
    console.log(`📥 缓存未命中，加载数据: ${key}`)
    const result = await fn(...args)
    
    // 存储到缓存
    dataCache.set(key, result, ttl)
    
    return result
  }) as T
}

// React Hook for cache management
import { useEffect, useState } from 'react'

export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl?: number) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 尝试从缓存获取
        const cached = dataCache.get<T>(key)
        if (cached !== null) {
          if (mounted) {
            setData(cached)
            setLoading(false)
          }
          return
        }

        // 缓存未命中，获取新数据
        const result = await fetcher()
        dataCache.set(key, result, ttl)
        
        if (mounted) {
          setData(result)
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [key, ttl])

  const invalidate = () => {
    dataCache.delete(key)
  }

  const refresh = async () => {
    dataCache.delete(key)
    setLoading(true)
    try {
      const result = await fetcher()
      dataCache.set(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, invalidate, refresh }
}


