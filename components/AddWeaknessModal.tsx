'use client'

import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Select } from './ui/Select'
import { supabase } from '@/lib/supabase'
import { AlertTriangle, Plus } from 'lucide-react'

interface AddWeaknessModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess?: () => void
}

export function AddWeaknessModal({ isOpen, onClose, userId, onSuccess }: AddWeaknessModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'general',
    description: '',
    impact: '',
    improvement_plan: '',
    priority: 2
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('weaknesses')
        .insert([{
          ...formData,
          user_id: userId
        }])

      if (error) throw error

      onSuccess?.()
      onClose()
      setFormData({
        name: '',
        category: 'general',
        description: '',
        impact: '',
        improvement_plan: '',
        priority: 2
      })
    } catch (error) {
      console.error('Error adding weakness:', error)
      alert('添加缺点时出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加需要改进的方面">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            需要改进的方面 *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="例如：拖延症、缺乏耐心"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分类
          </label>
          <Select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="general">通用</option>
            <option value="productivity">效率</option>
            <option value="mindset">心态</option>
            <option value="health">健康</option>
            <option value="social">社交</option>
            <option value="technical">技术</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            优先级
          </label>
          <Select
            value={formData.priority.toString()}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
          >
            <option value={1}>低优先级</option>
            <option value={2}>中优先级</option>
            <option value={3}>高优先级</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            详细描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="详细描述这个需要改进的方面..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            影响分析
          </label>
          <textarea
            value={formData.impact}
            onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
            placeholder="分析这个问题对你的影响..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            改进计划
          </label>
          <textarea
            value={formData.improvement_plan}
            onChange={(e) => setFormData(prev => ({ ...prev, improvement_plan: e.target.value }))}
            placeholder="制定具体的改进计划和行动步骤..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            取消
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                添加中...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                添加
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
