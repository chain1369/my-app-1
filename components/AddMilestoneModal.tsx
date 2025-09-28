'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { trackEvent } from '@/lib/analytics'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ProgressBar } from './ui/ProgressBar'

interface AddMilestoneModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
}

export function AddMilestoneModal({ isOpen, onClose, onSuccess, userId }: AddMilestoneModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_date: '',
    progress: 0,
    priority: 3,
    status: 'pending' as const
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error, data } = await supabase
        .from('milestones')
        .insert([
          {
            user_id: userId,
            ...formData,
            target_date: formData.target_date || null
          }
        ])
        .select()
        .single()

      if (error) throw error

      setFormData({
        title: '',
        description: '',
        category: '',
        target_date: '',
        progress: 0,
        priority: 3,
        status: 'pending'
      })
      
      onSuccess()
      onClose()
      if (data) {
        await trackEvent({
          name: 'milestone_created',
          data: { milestoneId: data.id, status: data.status },
        })
      }
    } catch (error) {
      console.error('Error adding milestone:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['职业', '教育', '健康', '财务', '个人', '家庭', '其他']
  const statuses = [
    { value: 'pending', label: '待开始' },
    { value: 'in_progress', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'cancelled', label: '已取消' }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="创建新里程碑" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="里程碑标题"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            描述
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述这个里程碑的具体内容和意义"
          />
        </div>

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

        <Input
          label="目标日期 (可选)"
          type="date"
          value={formData.target_date}
          onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            当前进度: {formData.progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <ProgressBar value={formData.progress} max={100} showLabel={false} />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            优先级
          </label>
          <select
            className="w-full h-10 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
          >
            <option value={1}>最高 (1)</option>
            <option value={2}>高 (2)</option>
            <option value={3}>中 (3)</option>
            <option value={4}>低 (4)</option>
            <option value={5}>最低 (5)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            状态
          </label>
          <select
            className="w-full h-10 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            取消
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? '创建中...' : '创建里程碑'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

