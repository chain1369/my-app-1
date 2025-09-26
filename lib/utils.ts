import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatCurrency(amount: number, currency = 'CNY') {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function calculateAge(birthDate: string) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function calculateBMI(weight: number, height: number) {
  // height in cm, weight in kg
  const heightInM = height / 100
  return Number((weight / (heightInM * heightInM)).toFixed(1))
}

export function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { category: '偏瘦', color: 'text-blue-600' }
  if (bmi < 24) return { category: '正常', color: 'text-green-600' }
  if (bmi < 28) return { category: '偏胖', color: 'text-orange-600' }
  return { category: '肥胖', color: 'text-red-600' }
}

export function getSkillLevelText(level: number) {
  if (level <= 2) return '初学者'
  if (level <= 4) return '入门'
  if (level <= 6) return '中级'
  if (level <= 8) return '高级'
  return '专家'
}

export function getMilestoneStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
}

export function getMilestoneStatusText(status: string) {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'in_progress':
      return '进行中'
    case 'cancelled':
      return '已取消'
    default:
      return '待开始'
  }
}

