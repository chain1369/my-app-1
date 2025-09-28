'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { trackEvent } from '@/lib/analytics'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ProgressBar } from './ui/ProgressBar'

interface AddSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
}

export function AddSkillModal({ isOpen, onClose, onSuccess, userId }: AddSkillModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 5,
    description: '',
    started_date: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error, data } = await supabase
        .from('skills')
        .insert([
          {
            user_id: userId,
            ...formData,
            started_date: formData.started_date || null
          }
        ])
        .select()
        .single()

      if (error) throw error
      if (data) {
        await trackEvent({
          name: 'skill_created',
          data: { skillId: data.id, level: data.level },
        })
      }

      setFormData({
        name: '',
        category: '',
        level: 5,
        description: '',
        started_date: ''
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['技术', '语言', '运动', '艺术', '音乐', '管理', '其他']

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加新技能">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="技能名称"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            分类
          </label>
          <select
            className="w-full h-10 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">选择分类</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            技能等级: {formData.level}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <ProgressBar value={formData.level} max={10} showLabel={false} />
        </div>

        <Input
          label="描述 (可选)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="描述你的技能水平和经验"
        />

        <Input
          label="开始日期 (可选)"
          type="date"
          value={formData.started_date}
          onChange={(e) => setFormData({ ...formData, started_date: e.target.value })}
        />

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            取消
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? '添加中...' : '添加技能'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

