'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Modal } from './ui/Modal'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

interface AddAssetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userId: string
}

export function AddAssetModal({ isOpen, onClose, onSuccess, userId }: AddAssetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    current_value: '',
    currency: 'CNY',
    purchase_date: '',
    purchase_price: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('assets')
        .insert([
          {
            user_id: userId,
            name: formData.name,
            category: formData.category,
            current_value: formData.current_value ? parseFloat(formData.current_value) : null,
            currency: formData.currency,
            purchase_date: formData.purchase_date || null,
            purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
            description: formData.description || null,
            is_active: true
          }
        ])

      if (error) throw error

      setFormData({
        name: '',
        category: '',
        current_value: '',
        currency: 'CNY',
        purchase_date: '',
        purchase_price: '',
        description: ''
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding asset:', error)
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="添加新资产" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="资产名称"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="例如：股票投资、房产、汽车等"
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
            placeholder="0.00"
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
            placeholder="0.00"
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

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            取消
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? '添加中...' : '添加资产'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

