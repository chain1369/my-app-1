// 严格的类型定义
export interface DemoUser {
  id: string
  name?: string
  email?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

export interface FormValidationError {
  field: string
  message: string
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type Priority = 1 | 2 | 3 | 4 | 5
export type WeaknessPriority = 1 | 2 | 3

// 表单数据类型
export interface TalentFormData {
  name: string
  description: string
  category: string
  level: number
  discovered_date: string
}

export interface StrengthFormData {
  name: string
  category: string
  description: string
  examples: string
  development_level: number
}

export interface WeaknessFormData {
  name: string
  category: string
  description: string
  impact: string
  improvement_plan: string
  priority: WeaknessPriority
}

