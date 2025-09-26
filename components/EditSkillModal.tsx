'use client'

import { useState, useEffect } from 'react'
import { supabase, Skill } from '@/lib/supabase'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ProgressBar } from './ui/ProgressBar'
import { Trash2 } from 'lucide-react'

interface EditSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  skill: Skill | null
}

export function EditSkillModal({ isOpen, onClose, onSuccess, skill }: EditSkillModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 5,
    description: '',
    started_date: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        description: skill.description || '',
        started_date: skill.started_date ? skill.started_date.split('T')[0] : '',
        is_active: skill.is_active
      })
    }
  }, [skill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skill) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('skills')
        .update({
          name: formData.name,
          category: formData.category,
          level: formData.level,
          description: formData.description || null,
          started_date: formData.started_date || null,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', skill.id)

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!skill) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skill.id)

      if (error) throw error

      onSuccess()
      onClose()
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['技术', '语言', '运动', '艺术', '音乐', '管理', '其他']

  if (!skill) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="编辑技能"
      className="max-w-lg"
    >
      {!showDeleteConfirm ? (
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

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              描述
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="描述你的技能水平和经验"
            />
          </div>

          <Input
            label="开始日期"
            type="date"
            value={formData.started_date}
            onChange={(e) => setFormData({ ...formData, started_date: e.target.value })}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              当前活跃技能
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
              <h3 className="text-lg font-medium text-gray-900">删除技能</h3>
              <p className="text-sm text-gray-500 mt-2">
                确定要删除技能 "{skill.name}" 吗？此操作无法撤销。
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

