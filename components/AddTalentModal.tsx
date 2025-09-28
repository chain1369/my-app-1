'use client'

import { useCallback } from 'react'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Select } from './ui/Select'
import { Slider } from './ui/Slider'
import { supabase } from '@/lib/supabase'
import { trackEvent } from '@/lib/analytics'
import { TalentFormData } from '@/lib/types'
import { validateTalentForm } from '@/lib/validation'
import { useToast } from '@/hooks/useToast'
import { useForm } from '@/hooks/useForm'
import { Plus } from 'lucide-react'

interface AddTalentModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess?: () => void
}

export function AddTalentModal({ isOpen, onClose, userId, onSuccess }: AddTalentModalProps) {
  const { showSuccess, showError } = useToast()

  const submitTalent = useCallback(async (formData: TalentFormData) => {
    const { error, data } = await supabase
      .from('talents')
      .insert([{
        ...formData,
        user_id: userId,
        discovered_date: formData.discovered_date || null
      }])
      .select()
      .single()

    if (error) throw error
    if (data) {
      await trackEvent({
        name: 'talent_added',
        data: { talentId: data.id },
      })
    }
    
    showSuccess('天赋添加成功', `已成功添加天赋"${formData.name}"`)
    onSuccess?.()
    onClose()
  }, [userId, onSuccess, onClose, showSuccess])

  const form = useForm<TalentFormData>({
    initialValues: {
      name: '',
      description: '',
      category: 'general',
      level: 5,
      discovered_date: ''
    },
    validate: validateTalentForm,
    onSubmit: submitTalent,
    onError: (error) => {
      console.error('Error adding talent:', error)
      showError('添加失败', '添加天赋时出错，请重试')
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加天赋">
      <form onSubmit={form.handleSubmit} className="space-y-6">
        {form.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">请修正以下错误：</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {form.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <label htmlFor="talent-name" className="block text-sm font-medium text-gray-700 mb-2">
            天赋名称 *
          </label>
          <Input
            id="talent-name"
            type="text"
            {...form.getFieldProps('name')}
            placeholder="例如：音乐感知力、空间想象力"
            aria-describedby="talent-name-help"
            required
          />
          <p id="talent-name-help" className="sr-only">
            请输入您的天赋名称，例如音乐感知力或空间想象力
          </p>
        </div>

        <div>
          <label htmlFor="talent-category" className="block text-sm font-medium text-gray-700 mb-2">
            分类
          </label>
          <Select
            id="talent-category"
            {...form.getSelectProps('category')}
            aria-describedby="talent-category-help"
          >
            <option value="general">通用</option>
            <option value="creative">创意</option>
            <option value="analytical">分析</option>
            <option value="social">社交</option>
            <option value="physical">体能</option>
            <option value="technical">技术</option>
          </Select>
          <p id="talent-category-help" className="sr-only">
            选择最适合描述您天赋的分类
          </p>
        </div>

        <div>
          <label htmlFor="talent-level" className="block text-sm font-medium text-gray-700 mb-2">
            天赋等级: {form.values.level}/10
          </label>
          <Slider
            id="talent-level"
            min={1}
            max={10}
            {...form.getSliderProps('level')}
            color="purple"
            aria-describedby="talent-level-help"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>初现</span>
            <span>发展中</span>
            <span>良好</span>
            <span>优秀</span>
            <span>卓越</span>
          </div>
          <p id="talent-level-help" className="sr-only">
            使用滑块选择您的天赋等级，从1（初现）到10（卓越）
          </p>
        </div>

        <div>
          <label htmlFor="talent-description" className="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <textarea
            id="talent-description"
            {...form.getFieldProps('description')}
            placeholder="描述这个天赋的具体表现和特点..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            aria-describedby="talent-description-help"
          />
          <p id="talent-description-help" className="sr-only">
            可选：描述这个天赋的具体表现和特点
          </p>
        </div>

        <div>
          <label htmlFor="talent-date" className="block text-sm font-medium text-gray-700 mb-2">
            发现日期
          </label>
          <Input
            id="talent-date"
            type="date"
            {...form.getFieldProps('discovered_date')}
            aria-describedby="talent-date-help"
          />
          <p id="talent-date-help" className="sr-only">
            可选：选择您发现这个天赋的日期
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={form.isSubmitting}
          >
            取消
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            disabled={form.isSubmitting}
          >
            {form.isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                添加中...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                添加天赋
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
