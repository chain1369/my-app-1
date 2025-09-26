'use client'

import { useState, useEffect } from 'react'
import { supabase, Milestone } from '@/lib/supabase'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ProgressBar } from './ui/ProgressBar'
import { Trash2 } from 'lucide-react'

interface EditMilestoneModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  milestone: Milestone | null
}

export function EditMilestoneModal({ isOpen, onClose, onSuccess, milestone }: EditMilestoneModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_date: '',
    completed_date: '',
    progress: 0,
    priority: 3,
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    is_public: false
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title,
        description: milestone.description || '',
        category: milestone.category,
        target_date: milestone.target_date ? milestone.target_date.split('T')[0] : '',
        completed_date: milestone.completed_date ? milestone.completed_date.split('T')[0] : '',
        progress: milestone.progress,
        priority: milestone.priority,
        status: milestone.status,
        is_public: milestone.is_public
      })
    }
  }, [milestone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!milestone) return
    
    setLoading(true)

    try {
      const updateData: any = {
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        target_date: formData.target_date || null,
        progress: formData.progress,
        priority: formData.priority,
        status: formData.status,
        is_public: formData.is_public,
        updated_at: new Date().toISOString()
      }

      // 如果状态变为已完成且没有完成日期，自动设置完成日期
      if (formData.status === 'completed' && !formData.completed_date) {
        updateData.completed_date = new Date().toISOString()
        updateData.progress = 100
      } else if (formData.status === 'completed' && formData.completed_date) {
        updateData.completed_date = formData.completed_date
      } else if (formData.status !== 'completed') {
        updateData.completed_date = null
      }

      const { error } = await supabase
        .from('milestones')
        .update(updateData)
        .eq('id', milestone.id)

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating milestone:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!milestone) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestone.id)

      if (error) throw error

      onSuccess()
      onClose()
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting milestone:', error)
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

  if (!milestone) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="编辑里程碑"
      className="max-w-lg"
    >
      {!showDeleteConfirm ? (
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="目标日期"
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />

            {formData.status === 'completed' && (
              <Input
                label="完成日期"
                type="date"
                value={formData.completed_date}
                onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
              />
            )}
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_public" className="text-sm text-gray-700">
              公开显示
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </Button>
            <div className="flex space-x-2 flex-1">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                取消
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">删除里程碑</h3>
              <p className="text-sm text-gray-500 mt-2">
                确定要删除里程碑 "{milestone.title}" 吗？此操作无法撤销。
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? '删除中...' : '确认删除'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

