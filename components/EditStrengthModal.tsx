'use client'

import { useState, useEffect } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { supabase, Strength } from '@/lib/supabase'
import { ThumbsUp, Save, Trash2 } from 'lucide-react'

interface EditStrengthModalProps {
  isOpen: boolean
  onClose: () => void
  strength: Strength | null
  onSuccess?: () => void
}

export function EditStrengthModal({ isOpen, onClose, strength, onSuccess }: EditStrengthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    examples: ''
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (strength) {
      setFormData({
        name: strength.name,
        description: strength.description || '',
        examples: strength.examples || ''
      })
    }
  }, [strength])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!strength) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('strengths')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', strength.id)

      if (error) throw error

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error updating strength:', error)
      alert('更新优点时出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!strength) return
    
    if (!confirm('确定要删除这个优点吗？此操作无法撤销。')) {
      return
    }

    setDeleting(true)

    try {
      const { error } = await supabase
        .from('strengths')
        .delete()
        .eq('id', strength.id)

      if (error) throw error

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting strength:', error)
      alert('删除优点时出错，请重试')
    } finally {
      setDeleting(false)
    }
  }

  if (!strength) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑优点">
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
            className="bg-green-600 hover:bg-green-700"
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

