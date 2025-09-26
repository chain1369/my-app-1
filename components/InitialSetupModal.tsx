'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { User } from 'lucide-react'

interface InitialSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
}

export function InitialSetupModal({ isOpen, onClose, onSuccess, userId }: InitialSetupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    current_height: '',
    current_weight: '',
    location: '',
    occupation: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('user_profile')
        .insert([
          {
            id: userId,
            name: formData.name,
            birth_date: formData.birth_date || null,
            current_height: formData.current_height ? parseFloat(formData.current_height) : null,
            current_weight: formData.current_weight ? parseFloat(formData.current_weight) : null,
            location: formData.location || null,
            occupation: formData.occupation || null,
            bio: formData.bio || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="完善个人信息"
      className="max-w-lg"
    >
      <div className="mb-6 text-center">
        <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">
          欢迎使用人生追踪器！请先完善您的基本信息，这将帮助我们为您提供更好的体验。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="姓名 *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="请输入您的姓名"
        />

        <Input
          label="生日"
          type="date"
          value={formData.birth_date}
          onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="身高 (cm)"
            type="number"
            step="0.1"
            value={formData.current_height}
            onChange={(e) => setFormData({ ...formData, current_height: e.target.value })}
            placeholder="175.0"
          />

          <Input
            label="体重 (kg)"
            type="number"
            step="0.1"
            value={formData.current_weight}
            onChange={(e) => setFormData({ ...formData, current_weight: e.target.value })}
            placeholder="70.0"
          />
        </div>

        <Input
          label="所在地"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="城市或地区"
        />

        <Input
          label="职业"
          value={formData.occupation}
          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          placeholder="您的职业或职位"
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            个人简介
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="简单介绍一下自己..."
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 这些信息可以随时在设置中修改，您也可以选择跳过某些字段。
          </p>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              // 创建基础资料
              handleSubmit(new Event('submit') as any)
            }}
            className="flex-1"
          >
            稍后设置
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? '保存中...' : '完成设置'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

