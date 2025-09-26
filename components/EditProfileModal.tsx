'use client'

import { useState, useEffect } from 'react'
import { supabase, UserProfile } from '@/lib/supabase'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Edit, User } from 'lucide-react'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  profile: UserProfile
}

export function EditProfileModal({ isOpen, onClose, onSuccess, profile }: EditProfileModalProps) {
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

  // 当模态框打开时，用现有数据填充表单
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        name: profile.name || '',
        birth_date: profile.birth_date || '',
        current_height: profile.current_height?.toString() || '',
        current_weight: profile.current_weight?.toString() || '',
        location: profile.location || '',
        occupation: profile.occupation || '',
        bio: profile.bio || ''
      })
    }
  }, [isOpen, profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('user_profile')
        .update({
          name: formData.name,
          birth_date: formData.birth_date || null,
          current_height: formData.current_height ? parseFloat(formData.current_height) : null,
          current_weight: formData.current_weight ? parseFloat(formData.current_weight) : null,
          location: formData.location || null,
          occupation: formData.occupation || null,
          bio: formData.bio || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="编辑个人信息"
      className="max-w-lg"
    >
      <div className="mb-6 text-center">
        <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-4">
          <Edit className="h-8 w-8 text-white" />
        </div>
        <p className="text-gray-600">
          更新您的个人信息，保持资料的准确性。
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

        <div className="flex space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            取消
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? '保存中...' : '保存更改'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
