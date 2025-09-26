'use client'

import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Select } from './ui/Select'
import { Slider } from './ui/Slider'
import { supabase } from '@/lib/supabase'
import { ThumbsUp, Plus } from 'lucide-react'

interface AddStrengthModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess?: () => void
}

export function AddStrengthModal({ isOpen, onClose, userId, onSuccess }: AddStrengthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'general',
    description: '',
    examples: '',
    development_level: 5
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('strengths')
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
        examples: '',
        development_level: 5
      })
    } catch (error) {
      console.error('Error adding strength:', error)
      alert('添加优点时出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加优点">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            优点名称 *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="例如：责任心强、善于沟通"
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
            <option value="personality">性格</option>
            <option value="cognitive">认知</option>
            <option value="social">社交</option>
            <option value="creative">创造</option>
            <option value="leadership">领导</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            发展程度: {formData.development_level}/10
          </label>
          <Slider
            min={1}
            max={10}
            value={formData.development_level}
            onChange={(e) => setFormData(prev => ({ ...prev, development_level: parseInt(e.target.value) }))}
            color="green"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>初级</span>
            <span>中级</span>
            <span>高级</span>
            <span>专家</span>
            <span>大师</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            详细描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="详细描述这个优点..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            具体表现
          </label>
          <textarea
            value={formData.examples}
            onChange={(e) => setFormData(prev => ({ ...prev, examples: e.target.value }))}
            placeholder="举例说明这个优点在生活或工作中的具体表现..."
            rows={3}
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
            className="flex-1 bg-green-600 hover:bg-green-700"
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
                添加优点
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
