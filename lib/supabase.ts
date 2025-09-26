import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://lrojdhpyomlcmzgafplp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyb2pkaHB5b21sY216Z2FmcGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDMyNjIsImV4cCI6MjA3NDM3OTI2Mn0.fMVvmmOWisuxRqPtjOfhvr6_5ussudlgzABNOmDNRkQ'

// 用于客户端的Supabase客户端
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface UserProfile {
  id: string
  created_at: string
  updated_at: string
  name: string
  birth_date?: string
  current_height?: number
  current_weight?: number
  location?: string
  occupation?: string
  bio?: string
}

export interface BodyMetric {
  id: string
  user_id: string
  recorded_at: string
  height?: number
  weight?: number
  body_fat_percentage?: number
  muscle_mass?: number
  notes?: string
}

export interface Skill {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  name: string
  category: string
  level: number
  description?: string
  started_date?: string
  is_active: boolean
}

export interface Asset {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  name: string
  category: string
  current_value?: number
  currency: string
  purchase_date?: string
  purchase_price?: number
  description?: string
  is_active: boolean
}

export interface Milestone {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  title: string
  description?: string
  category: string
  target_date?: string
  completed_date?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  progress: number
  priority: number
  is_public: boolean
}

export interface Talent {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  name: string
  description?: string
  level: number
  category: string
  discovered_date?: string
}

export interface Strength {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  name: string
  category: string
  description?: string
  examples?: string
  development_level: number
  is_active: boolean
}

export interface Weakness {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  name: string
  category: string
  description?: string
  impact?: string
  improvement_plan?: string
  priority: number
  is_working_on: boolean
  is_active: boolean
}
