'use client'

import { useState, useEffect } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { supabase, Weakness } from '@/lib/supabase'
import { AlertTriangle, Save, Trash2 } from 'lucide-react'

interface EditWeaknessModalProps {
  isOpen: boolean
  onClose: () => void
  weakness: Weakness | null
  onSuccess?: () => void
}

export function EditWeaknessModal({ isOpen, onClose, weakness, onSuccess }: EditWeaknessModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    improvement_plan: '',
    priority: 2 as number
  })
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (weakness) {
      setFormData({
        name: weakness.name,
        description: weakness.description || '',
        improvement_plan: weakness.improvement_plan || '',
        priority: weakness.priority
      })
    }
  }, [weakness])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!weakness) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('weaknesses')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', weakness.id)

      if (error) throw error

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error updating weakness:', error)
      alert('更新缺点时出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!weakness) return
    
    if (!confirm('确定要删除这个需要改进的方面吗？此操作无法撤销。')) {
      return
    }

    setDeleting(true)

    try {
      const { error } = await supabase
        .from('weaknesses')
        .delete()
        .eq('id', weakness.id)

      if (error) throw error

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting weakness:', error)
      alert('删除时出错，请重试')
    } finally {
      setDeleting(false)
    }
  }

  if (!weakness) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="编辑需要改进的方面">
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
            优先级
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="1">低优先级</option>
            <option value="2">中优先级</option>
            <option value="3">高优先级</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            详细描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="详细描述这个需要改进的方面..."
            rows={3}
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
            className="bg-orange-600 hover:bg-orange-700"
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

