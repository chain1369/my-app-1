'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('密码不匹配')
        setLoading(false)
        return
      }
      if (formData.password.length < 6) {
        setError('密码至少需要6位字符')
        setLoading(false)
        return
      }
      if (!formData.name.trim()) {
        setError('请输入姓名')
        setLoading(false)
        return
      }

      const { error } = await signUp(formData.email, formData.password, formData.name)
      if (error) {
        setError(error.message === 'User already registered' ? '用户已存在' : '注册失败：' + error.message)
      } else {
        onClose()
      }
    } else {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        setError(error.message === 'Invalid login credentials' ? '邮箱或密码错误' : '登录失败：' + error.message)
      } else {
        onClose()
      }
    }

    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', confirmPassword: '' })
    setError('')
    setShowPassword(false)
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    resetForm()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={mode === 'signin' ? '登录' : '注册'}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <Input
            label="姓名"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="请输入您的姓名"
          />
        )}

        <Input
          label="邮箱"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="请输入邮箱地址"
        />

        <div className="relative">
          <Input
            label="密码"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="请输入密码"
          />
          <button
            type="button"
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {mode === 'signup' && (
          <Input
            label="确认密码"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            placeholder="请再次输入密码"
          />
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col space-y-3 pt-4">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === 'signin' ? '登录中...' : '注册中...'}
              </>
            ) : (
              <>
                {mode === 'signin' ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    登录
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    注册
                  </>
                )}
              </>
            )}
          </Button>

          <Button 
            type="button" 
            variant="ghost" 
            onClick={switchMode}
            className="w-full"
          >
            {mode === 'signin' ? '没有账号？立即注册' : '已有账号？立即登录'}
          </Button>
        </div>
      </form>

      {mode === 'signup' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600">
            💡 注册后，系统将为您创建专属的人生追踪档案
          </p>
        </div>
      )}
    </Modal>
  )
}
