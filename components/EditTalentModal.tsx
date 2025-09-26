'use client'

import { useState, useEffect } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { supabase, Talent } from '@/lib/supabase'
import { Sparkles, Save, Trash2 } from 'lucide-react'

interface EditTalentModalProps {
  isOpen: boolean
  onClose: () => void
  talent: Talent | null
  onSuccess?: () => void
}

export function EditTalentModal({ isOpen, onClose, talent, onSuccess }: EditTalentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    level: 5,
    discovered_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (talent) {
      setFormData({
        name: talent.name,
        description: talent.description || '',
        category: talent.category,
        level: talent.level,
        discovered_date: talent.discovered_date || ''
      })
    }
  }, [talent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!talent) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('talents')
        .update({
          ...formData,
          discovered_date: formData.discovered_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', talent.id)

      if (error) throw error

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error updating talent:', error)
      alert('更新天赋时出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!talent) return
    
    if (!confirm('确定要删除这个天赋吗？此操作无法撤销。')) {
      return
    }

    setDeleting(true)

    try {
      const { error } = await supabase
        .from('talents')
        .delete()
        .eq('id', talent.id)

      if (error) throw error

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting talent:', error)
      alert('删除天赋时出错，请重试')
    } finally {
      setDeleting(false)
    }
  }

  if (!talent) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑天赋">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            天赋名称 *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="例如：音乐感知力、空间想象力"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分类
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="general">通用</option>
            <option value="creative">创意</option>
            <option value="analytical">分析</option>
            <option value="social">社交</option>
            <option value="physical">体能</option>
            <option value="technical">技术</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            天赋等级: {formData.level}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>初现</span>
            <span>发展中</span>
            <span>良好</span>
            <span>优秀</span>
            <span>卓越</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="描述这个天赋的具体表现和特点..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            发现日期
          </label>
          <Input
            type="date"
            value={formData.discovered_date}
            onChange={(e) => setFormData(prev => ({ ...prev, discovered_date: e.target.value }))}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={loading || deleting}
          >
            {deleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                删除中...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading || deleting}
          >
            取消
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700"
            disabled={loading || deleting}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

