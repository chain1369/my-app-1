'use client'

import { useState, useEffect } from 'react'
import { supabase, Asset } from '@/lib/supabase'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Trash2 } from 'lucide-react'

interface EditAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  asset: Asset | null
}

export function EditAssetModal({ isOpen, onClose, onSuccess, asset }: EditAssetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    current_value: '',
    currency: 'CNY',
    purchase_date: '',
    purchase_price: '',
    description: '',
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        category: asset.category,
        current_value: asset.current_value?.toString() || '',
        currency: asset.currency,
        purchase_date: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
        purchase_price: asset.purchase_price?.toString() || '',
        description: asset.description || '',
        is_active: asset.is_active
      })
    }
  }, [asset])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!asset) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('assets')
        .update({
          name: formData.name,
          category: formData.category,
          current_value: formData.current_value ? parseFloat(formData.current_value) : null,
          currency: formData.currency,
          purchase_date: formData.purchase_date || null,
          purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
          description: formData.description || null,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', asset.id)

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating asset:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!asset) return
    
    setLoading(true)

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', asset.id)

      if (error) throw error

      onSuccess()
      onClose()
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting asset:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['现金', '投资', '房产', '车辆', '收藏品', '知识产权', '其他']
  const currencies = [
    { value: 'CNY', label: '人民币 (¥)' },
    { value: 'USD', label: '美元 ($)' },
    { value: 'EUR', label: '欧元 (€)' },
    { value: 'JPY', label: '日元 (¥)' },
    { value: 'GBP', label: '英镑 (£)' }
  ]

  if (!asset) return null

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="编辑资产"
      className="max-w-lg"
    >
      {!showDeleteConfirm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="资产名称"
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="当前价值"
              type="number"
              step="0.01"
              value={formData.current_value}
              onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                货币
              </label>
              <select
                className="w-full h-10 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="购买日期"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
            />

            <Input
              label="购买价格"
              type="number"
              step="0.01"
              value={formData.purchase_price}
              onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
            />
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
              placeholder="资产的详细描述、用途或备注"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              当前持有
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
              <h3 className="text-lg font-medium text-gray-900">删除资产</h3>
              <p className="text-sm text-gray-500 mt-2">
                确定要删除资产 "{asset.name}" 吗？此操作无法撤销。
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

