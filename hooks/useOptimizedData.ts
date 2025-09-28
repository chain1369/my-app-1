'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, UserProfile, Skill, Asset, Milestone, Talent, Strength, Weakness } from '@/lib/supabase'
import { dataCache } from '@/lib/cache'

interface DataState {
  profile: UserProfile | null
  skills: Skill[]
  assets: Asset[]
  milestones: Milestone[]
  talents: Talent[]
  strengths: Strength[]
  weaknesses: Weakness[]
  loading: boolean
  error: Error | null
}

export function useOptimizedData(userId: string | null) {
  const [state, setState] = useState<DataState>({
    profile: null,
    skills: [],
    assets: [],
    milestones: [],
    talents: [],
    strengths: [],
    weaknesses: [],
    loading: true,
    error: null
  })

  // 缓存键生成器
  const getCacheKey = useCallback((type: string, userId: string) => {
    return `${type}_${userId}`
  }, [])

  // 批量加载数据
  const loadAllData = useCallback(async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // 并行加载所有数据
      const [
        profileResult,
        skillsResult,
        assetsResult,
        milestonesResult,
        talentsResult,
        strengthsResult,
        weaknessesResult
      ] = await Promise.allSettled([
        // 用户资料
        supabase.from('user_profile').select('*').eq('id', userId).single(),
        // 技能
        supabase.from('skills').select('*').eq('user_id', userId).eq('is_active', true).order('level', { ascending: false }),
        // 资产
        supabase.from('assets').select('*').eq('user_id', userId).eq('is_active', true).order('current_value', { ascending: false }),
        // 里程碑
        supabase.from('milestones').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(6),
        // 天赋
        supabase.from('talents').select('*').eq('user_id', userId).order('level', { ascending: false }),
        // 优点
        supabase.from('strengths').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        // 缺点
        supabase.from('weaknesses').select('*').eq('user_id', userId).order('priority', { ascending: false })
      ])

      // 处理结果
      const newState: Partial<DataState> = {}

      if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        newState.profile = profileResult.value.data
        dataCache.set(getCacheKey('profile', userId), profileResult.value.data)
      }

      if (skillsResult.status === 'fulfilled' && skillsResult.value.data) {
        newState.skills = skillsResult.value.data
        dataCache.set(getCacheKey('skills', userId), skillsResult.value.data)
      }

      if (assetsResult.status === 'fulfilled' && assetsResult.value.data) {
        newState.assets = assetsResult.value.data
        dataCache.set(getCacheKey('assets', userId), assetsResult.value.data)
      }

      if (milestonesResult.status === 'fulfilled' && milestonesResult.value.data) {
        newState.milestones = milestonesResult.value.data
        dataCache.set(getCacheKey('milestones', userId), milestonesResult.value.data)
      }

      if (talentsResult.status === 'fulfilled' && talentsResult.value.data) {
        newState.talents = talentsResult.value.data
        dataCache.set(getCacheKey('talents', userId), talentsResult.value.data)
      }

      if (strengthsResult.status === 'fulfilled' && strengthsResult.value.data) {
        newState.strengths = strengthsResult.value.data
        dataCache.set(getCacheKey('strengths', userId), strengthsResult.value.data)
      }

      if (weaknessesResult.status === 'fulfilled' && weaknessesResult.value.data) {
        newState.weaknesses = weaknessesResult.value.data
        dataCache.set(getCacheKey('weaknesses', userId), weaknessesResult.value.data)
      }

      setState(prev => ({
        ...prev,
        ...newState,
        loading: false
      }))

    } catch (error) {
      console.error('Error loading data:', error)
      setState(prev => ({
        ...prev,
        error: error as Error,
        loading: false
      }))
    }
  }, [getCacheKey])

  // 从缓存加载数据
  const loadFromCache = useCallback((userId: string) => {
    const cachedProfile = dataCache.get<UserProfile>(getCacheKey('profile', userId))
    const cachedSkills = dataCache.get<Skill[]>(getCacheKey('skills', userId))
    const cachedAssets = dataCache.get<Asset[]>(getCacheKey('assets', userId))
    const cachedMilestones = dataCache.get<Milestone[]>(getCacheKey('milestones', userId))
    const cachedTalents = dataCache.get<Talent[]>(getCacheKey('talents', userId))
    const cachedStrengths = dataCache.get<Strength[]>(getCacheKey('strengths', userId))
    const cachedWeaknesses = dataCache.get<Weakness[]>(getCacheKey('weaknesses', userId))

    const hasAllCache = cachedProfile && cachedSkills && cachedAssets && 
                      cachedMilestones && cachedTalents && cachedStrengths && cachedWeaknesses

    if (hasAllCache) {
      setState({
        profile: cachedProfile,
        skills: cachedSkills,
        assets: cachedAssets,
        milestones: cachedMilestones,
        talents: cachedTalents,
        strengths: cachedStrengths,
        weaknesses: cachedWeaknesses,
        loading: false,
        error: null
      })
      return true
    }

    return false
  }, [getCacheKey])

  // 刷新数据
  const refreshData = useCallback(() => {
    if (userId) {
      // 清除缓存
      const cacheKeys = ['profile', 'skills', 'assets', 'milestones', 'talents', 'strengths', 'weaknesses']
      cacheKeys.forEach(key => dataCache.delete(getCacheKey(key, userId)))
      
      // 重新加载
      loadAllData(userId)
    }
  }, [userId, getCacheKey, loadAllData])

  // 初始化加载
  useEffect(() => {
    if (!userId) {
      setState(prev => ({ ...prev, loading: false }))
      return
    }

    // 首先尝试从缓存加载
    const loadedFromCache = loadFromCache(userId)
    
    // 如果缓存未命中，从服务器加载
    if (!loadedFromCache) {
      loadAllData(userId)
    }
  }, [userId, loadFromCache, loadAllData])

  // 计算统计数据
  const stats = useMemo(() => {
    const totalAssetValue = state.assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0)
    const completedMilestones = state.milestones.filter(m => m.status === 'completed').length
    const avgSkillLevel = state.skills.length > 0 
      ? state.skills.reduce((sum, skill) => sum + skill.level, 0) / state.skills.length 
      : 0

    return {
      totalAssetValue,
      completedMilestones,
      avgSkillLevel,
      totalSkills: state.skills.length,
      totalAssets: state.assets.length,
      totalMilestones: state.milestones.length,
      totalTalents: state.talents.length,
      totalStrengths: state.strengths.length,
      totalWeaknesses: state.weaknesses.length
    }
  }, [state])

  return {
    ...state,
    stats,
    refreshData,
    isFromCache: !state.loading && userId ? loadFromCache(userId) : false
  }
}


