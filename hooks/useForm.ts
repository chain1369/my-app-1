'use client'

import { useState, useCallback } from 'react'
import { FormValidationError } from '@/lib/types'

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => FormValidationError[]
  onSubmit: (values: T) => Promise<void>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  onSuccess,
  onError
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // 清除该字段的错误
    if (errors.length > 0) {
      setErrors([])
    }
  }, [errors.length])

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors([])
    setTouched({} as Record<keyof T, boolean>)
  }, [initialValues])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    // 客户端验证
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors.length > 0) {
        setErrors(validationErrors.map(error => error.message))
        return
      }
    }

    setIsSubmitting(true)

    try {
      await onSubmit(values)
      onSuccess?.()
      reset()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '操作失败'
      setErrors([errorMessage])
      onError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate, onSubmit, onSuccess, onError, reset])

  const getFieldProps = useCallback((name: keyof T) => ({
    value: values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(name, e.target.value)
    },
    onBlur: () => setFieldTouched(name)
  }), [values, setValue, setFieldTouched])

  const getSelectProps = useCallback((name: keyof T) => ({
    value: values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(name, e.target.value)
    },
    onBlur: () => setFieldTouched(name)
  }), [values, setValue, setFieldTouched])

  const getSliderProps = useCallback((name: keyof T) => ({
    value: values[name] || 0,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, parseInt(e.target.value))
    },
    onBlur: () => setFieldTouched(name)
  }), [values, setValue, setFieldTouched])

  return {
    values,
    errors,
    isSubmitting,
    touched,
    setValue,
    setFieldTouched,
    reset,
    handleSubmit,
    getFieldProps,
    getSelectProps,
    getSliderProps
  }
}

