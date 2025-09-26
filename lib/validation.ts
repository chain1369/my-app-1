import { FormValidationError } from './types'

// 基础验证函数
export function validateRequired(value: string, fieldName: string): FormValidationError | null {
  if (!value || value.trim().length === 0) {
    return {
      field: fieldName,
      message: `${fieldName}不能为空`
    }
  }
  return null
}

export function validateLength(
  value: string, 
  fieldName: string, 
  min?: number, 
  max?: number
): FormValidationError | null {
  if (min && value.length < min) {
    return {
      field: fieldName,
      message: `${fieldName}长度不能少于${min}个字符`
    }
  }
  if (max && value.length > max) {
    return {
      field: fieldName,
      message: `${fieldName}长度不能超过${max}个字符`
    }
  }
  return null
}

export function validateRange(
  value: number, 
  fieldName: string, 
  min: number, 
  max: number
): FormValidationError | null {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName}必须在${min}-${max}之间`
    }
  }
  return null
}

export function validateEmail(email: string): FormValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: '请输入有效的邮箱地址'
    }
  }
  return null
}

// 表单验证函数
export function validateTalentForm(data: {
  name: string
  description: string
  category: string
  level: number
}): FormValidationError[] {
  const errors: FormValidationError[] = []

  const nameError = validateRequired(data.name, '天赋名称')
  if (nameError) errors.push(nameError)

  const nameLengthError = validateLength(data.name, '天赋名称', 1, 50)
  if (nameLengthError) errors.push(nameLengthError)

  const levelError = validateRange(data.level, '天赋等级', 1, 10)
  if (levelError) errors.push(levelError)

  const categoryError = validateRequired(data.category, '分类')
  if (categoryError) errors.push(categoryError)

  if (data.description) {
    const descLengthError = validateLength(data.description, '描述', 0, 500)
    if (descLengthError) errors.push(descLengthError)
  }

  return errors
}

export function validateStrengthForm(data: {
  name: string
  category: string
  description: string
  development_level: number
}): FormValidationError[] {
  const errors: FormValidationError[] = []

  const nameError = validateRequired(data.name, '优点名称')
  if (nameError) errors.push(nameError)

  const categoryError = validateRequired(data.category, '分类')
  if (categoryError) errors.push(categoryError)

  const levelError = validateRange(data.development_level, '发展水平', 1, 10)
  if (levelError) errors.push(levelError)

  return errors
}

export function validateWeaknessForm(data: {
  name: string
  category: string
  priority: number
}): FormValidationError[] {
  const errors: FormValidationError[] = []

  const nameError = validateRequired(data.name, '缺点名称')
  if (nameError) errors.push(nameError)

  const categoryError = validateRequired(data.category, '分类')
  if (categoryError) errors.push(categoryError)

  const priorityError = validateRange(data.priority, '优先级', 1, 3)
  if (priorityError) errors.push(priorityError)

  return errors
}

