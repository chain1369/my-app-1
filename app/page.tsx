'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase, UserProfile, Skill, Asset, Milestone, Talent, Strength, Weakness } from '@/lib/supabase'
import { StatsCard } from '@/components/StatsCard'
import { SkillCard } from '@/components/SkillCard'
import { MilestoneCard } from '@/components/MilestoneCard'
import { AddSkillModal } from '@/components/AddSkillModal'
import { AddMilestoneModal } from '@/components/AddMilestoneModal'
import { AddAssetModal } from '@/components/AddAssetModal'
import { EditSkillModal } from '@/components/EditSkillModal'
import { EditMilestoneModal } from '@/components/EditMilestoneModal'
import { EditProfileModal } from '@/components/EditProfileModal'
import { EditAssetModal } from '@/components/EditAssetModal'
import { AuthModal } from '@/components/AuthModal'
import { InitialSetupModal } from '@/components/InitialSetupModal'
import { TalentCard } from '@/components/TalentCard'
import { StrengthCard } from '@/components/StrengthCard'
import { WeaknessCard } from '@/components/WeaknessCard'
import { AddTalentModal } from '@/components/AddTalentModal'
import { AddStrengthModal } from '@/components/AddStrengthModal'
import { AddWeaknessModal } from '@/components/AddWeaknessModal'
import { EditTalentModal } from '@/components/EditTalentModal'
import { EditStrengthModal } from '@/components/EditStrengthModal'
import { EditWeaknessModal } from '@/components/EditWeaknessModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  User, 
  Target, 
  Award, 
  DollarSign, 
  Activity,
  Plus,
  Calendar,
  LogOut,
  Edit,
  Settings,
  Sparkles,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react'
import { formatCurrency, calculateAge, calculateBMI, getBMICategory } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [demoUser, setDemoUser] = useState<any>(null)
  const { toasts } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [talents, setTalents] = useState<Talent[]>([])
  const [strengths, setStrengths] = useState<Strength[]>([])
  const [weaknesses, setWeaknesses] = useState<Weakness[]>([])
  const [loading, setLoading] = useState(true)
  
  // 模态框状态
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false)
  const [showAddAssetModal, setShowAddAssetModal] = useState(false)
  const [showAddTalentModal, setShowAddTalentModal] = useState(false)
  const [showAddStrengthModal, setShowAddStrengthModal] = useState(false)
  const [showAddWeaknessModal, setShowAddWeaknessModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showInitialSetupModal, setShowInitialSetupModal] = useState(false)
  
  // 编辑模态框状态
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null)
  const [editingStrength, setEditingStrength] = useState<Strength | null>(null)
  const [editingWeakness, setEditingWeakness] = useState<Weakness | null>(null)

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [user])

  // 当前活跃用户（真实用户或演示用户）
  const currentUser = user || demoUser

  async function loadData() {
    if (!user) return
    
    try {
      setLoading(true)
      
      // 加载用户资料
      const { data: profileData } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      } else {
        // 如果没有用户资料，显示初始设置模态框
        setShowInitialSetupModal(true)
      }

      // 加载技能
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('level', { ascending: false })

      if (skillsData) {
        setSkills(skillsData)
      }

      // 加载资产
      const { data: assetsData } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('current_value', { ascending: false })

      if (assetsData) {
        setAssets(assetsData)
      }

      // 加载里程碑
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      if (milestonesData) {
        setMilestones(milestonesData)
      }

      // 加载天赋
      const { data: talentsData } = await supabase
        .from('talents')
        .select('*')
        .eq('user_id', user.id)
        .order('level', { ascending: false })

      if (talentsData) {
        setTalents(talentsData)
      }

      // 加载优点
      const { data: strengthsData } = await supabase
        .from('strengths')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (strengthsData) {
        setStrengths(strengthsData)
      }

      // 加载缺点
      const { data: weaknessesData } = await supabase
        .from('weaknesses')
        .select('*')
        .eq('user_id', user.id)
        .order('priority', { ascending: false })

      if (weaknessesData) {
        setWeaknesses(weaknessesData)
      }

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md mx-4">
            <div className="text-center mb-8">
              <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                人生追踪器
              </h1>
              <p className="text-gray-600">
                记录成长的每一步，追踪你的技能、资产和里程碑
              </p>
            </div>
            <div className="space-y-4">
              <AuthModal
                isOpen={true}
                onClose={() => {}}
              />
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    // 模拟用户登录
                    const demoUserData = { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' } as any
                    setDemoUser(demoUserData)
                    
                    // 加载演示数据
                    try {
                      // 加载用户资料
                      const { data: profileData } = await supabase
                        .from('user_profile')
                        .select('*')
                        .eq('id', demoUserData.id)
                        .single()

                      if (profileData) {
                        setProfile(profileData)
                      }

                      // 加载技能
                      const { data: skillsData } = await supabase
                        .from('skills')
                        .select('*')
                        .eq('user_id', demoUserData.id)
                        .eq('is_active', true)
                        .order('level', { ascending: false })

                      if (skillsData) {
                        setSkills(skillsData)
                      }

                      // 加载资产
                      const { data: assetsData } = await supabase
                        .from('assets')
                        .select('*')
                        .eq('user_id', demoUserData.id)
                        .eq('is_active', true)
                        .order('current_value', { ascending: false })

                      if (assetsData) {
                        setAssets(assetsData)
                      }

                      // 加载里程碑
                      const { data: milestonesData } = await supabase
                        .from('milestones')
                        .select('*')
                        .eq('user_id', demoUserData.id)
                        .order('created_at', { ascending: false })
                        .limit(6)

                      if (milestonesData) {
                        setMilestones(milestonesData)
                      }

                      // 加载天赋
                      const { data: talentsData } = await supabase
                        .from('talents')
                        .select('*')
                        .eq('user_id', demoUserData.id)
                        .order('level', { ascending: false })

                      if (talentsData) {
                        setTalents(talentsData)
                      }

                      // 加载优点
                      const { data: strengthsData } = await supabase
                        .from('strengths')
                        .select('*')
                        .eq('user_id', demoUserData.id)
                        .order('created_at', { ascending: false })

                      if (strengthsData) {
                        setStrengths(strengthsData)
                      }

                      // 加载缺点
                      const { data: weaknessesData } = await supabase
                        .from('weaknesses')
                        .select('*')
                        .eq('user_id', demoUserData.id)
                        .order('priority', { ascending: false })

                      if (weaknessesData) {
                        setWeaknesses(weaknessesData)
                      }
                    } catch (error) {
                      console.error('Error loading demo data:', error)
                    }
                  }}
                  className="w-full"
                >
                  🚀 查看演示界面
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalAssetValue = assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0)
  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const avgSkillLevel = skills.length > 0 ? skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                人生仪表板
              </h1>
              <p className="text-gray-600 mt-1">追踪你的成长与进步</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddSkillModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加技能
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowAddMilestoneModal(true)}
              >
                <Target className="h-4 w-4 mr-2" />
                新建里程碑
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowAddAssetModal(true)}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                添加资产
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowAddTalentModal(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                添加天赋
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowAddStrengthModal(true)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                添加优点
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowAddWeaknessModal(true)}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                改进方面
              </Button>
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 个人信息卡片 */}
        {profile && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <p className="text-gray-600">{profile.occupation}</p>
                    {profile.birth_date && (
                      <p className="text-sm text-gray-500">
                        {calculateAge(profile.birth_date)} 岁
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.current_height && profile.current_weight && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">BMI</p>
                    <p className="text-lg font-semibold">
                      {calculateBMI(profile.current_weight, profile.current_height)}
                    </p>
                    <Badge 
                      variant={getBMICategory(calculateBMI(profile.current_weight, profile.current_height)).color.includes('green') ? 'success' : 'warning'}
                      className="text-xs"
                    >
                      {getBMICategory(calculateBMI(profile.current_weight, profile.current_height)).category}
                    </Badge>
                  </div>
                )}
                {profile.location && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">位置</p>
                    <p className="text-lg font-semibold">{profile.location}</p>
                  </div>
                )}
                {profile.bio && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">简介</p>
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatsCard
            title="技能数量"
            value={skills.length}
            change={{ value: `平均等级 ${avgSkillLevel.toFixed(1)}`, type: 'neutral' }}
            icon={Award}
            color="blue"
          />
          <StatsCard
            title="总资产价值"
            value={formatCurrency(totalAssetValue)}
            change={{ value: `${assets.length} 项资产`, type: 'increase' }}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="已完成里程碑"
            value={completedMilestones}
            change={{ value: `总共 ${milestones.length} 个`, type: 'increase' }}
            icon={Target}
            color="purple"
          />
          <StatsCard
            title="天赋数量"
            value={talents.length}
            change={{ value: `平均等级 ${talents.length > 0 ? (talents.reduce((sum, t) => sum + t.level, 0) / talents.length).toFixed(1) : '0'}`, type: 'neutral' }}
            icon={Sparkles}
            color="purple"
          />
          <StatsCard
            title="优点数量"
            value={strengths.length}
            change={{ value: "个人优势", type: 'increase' }}
            icon={ThumbsUp}
            color="green"
          />
          <StatsCard
            title="改进方面"
            value={weaknesses.length}
            change={{ value: `${weaknesses.filter(w => w.priority === 3).length} 高优先级`, type: 'neutral' }}
            icon={AlertTriangle}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 技能概览 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">技能概览</h2>
              <Button variant="ghost" size="sm">
                查看全部
              </Button>
            </div>
            <div className="grid gap-4">
              {skills.slice(0, 6).map((skill) => (
                <SkillCard 
                  key={skill.id} 
                  skill={skill} 
                  onEdit={(skill) => setEditingSkill(skill)}
                />
              ))}
              {skills.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有添加技能</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowAddSkillModal(true)}
                    >
                      添加第一个技能
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* 里程碑 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">近期里程碑</h2>
              <Button variant="ghost" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                查看全部
              </Button>
            </div>
            <div className="grid gap-4">
              {milestones.map((milestone) => (
                <MilestoneCard 
                  key={milestone.id} 
                  milestone={milestone} 
                  onEdit={(milestone) => setEditingMilestone(milestone)}
                />
              ))}
              {milestones.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有设置里程碑</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowAddMilestoneModal(true)}
                    >
                      创建第一个里程碑
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* 天赋、优点缺点 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* 天赋 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">天赋能力</h2>
              <Button variant="ghost" size="sm">
                <Sparkles className="h-4 w-4 mr-2" />
                查看全部
              </Button>
            </div>
            <div className="space-y-4">
              {talents.slice(0, 4).map((talent) => (
                <TalentCard 
                  key={talent.id} 
                  talent={talent} 
                  onEdit={setEditingTalent}
                />
              ))}
              {talents.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有添加天赋</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowAddTalentModal(true)}
                    >
                      添加第一个天赋
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* 优点 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">个人优点</h2>
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                查看全部
              </Button>
            </div>
            <div className="space-y-4">
              {strengths.slice(0, 4).map((strength) => (
                <StrengthCard 
                  key={strength.id} 
                  strength={strength} 
                  onEdit={setEditingStrength}
                />
              ))}
              {strengths.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <ThumbsUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有添加优点</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowAddStrengthModal(true)}
                    >
                      添加第一个优点
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* 缺点/改进方面 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">改进方面</h2>
              <Button variant="ghost" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                查看全部
              </Button>
            </div>
            <div className="space-y-4">
              {weaknesses.slice(0, 4).map((weakness) => (
                <WeaknessCard 
                  key={weakness.id} 
                  weakness={weakness} 
                  onEdit={setEditingWeakness}
                />
              ))}
              {weaknesses.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">还没有添加需要改进的方面</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setShowAddWeaknessModal(true)}
                    >
                      添加改进方面
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* 资产概览 */}
        {assets.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">资产概览</h2>
              <Button variant="ghost" size="sm">
                查看详情
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.slice(0, 6).map((asset) => (
                <Card key={asset.id} hover onClick={() => setEditingAsset(asset)}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {asset.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {asset.category}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(asset.current_value || 0, asset.currency)}
                      </p>
                      {asset.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {asset.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 模态框 */}
      {currentUser && (
        <>
          <AddSkillModal
            isOpen={showAddSkillModal}
            onClose={() => setShowAddSkillModal(false)}
            onSuccess={loadData}
            userId={currentUser.id}
          />
          <AddMilestoneModal
            isOpen={showAddMilestoneModal}
            onClose={() => setShowAddMilestoneModal(false)}
            onSuccess={loadData}
            userId={currentUser.id}
          />
          <AddAssetModal
            isOpen={showAddAssetModal}
            onClose={() => setShowAddAssetModal(false)}
            onSuccess={loadData}
            userId={currentUser.id}
          />
          <AddTalentModal
            isOpen={showAddTalentModal}
            onClose={() => setShowAddTalentModal(false)}
            onSuccess={loadData}
            userId={currentUser.id}
          />
          <AddStrengthModal
            isOpen={showAddStrengthModal}
            onClose={() => setShowAddStrengthModal(false)}
            onSuccess={loadData}
            userId={currentUser.id}
          />
          <AddWeaknessModal
            isOpen={showAddWeaknessModal}
            onClose={() => setShowAddWeaknessModal(false)}
            onSuccess={loadData}
            userId={currentUser.id}
          />
          {profile && (
            <EditProfileModal
              isOpen={showEditProfileModal}
              onClose={() => setShowEditProfileModal(false)}
              onSuccess={loadData}
              profile={profile}
            />
          )}
          <EditSkillModal
            isOpen={!!editingSkill}
            onClose={() => setEditingSkill(null)}
            onSuccess={loadData}
            skill={editingSkill}
          />
          <EditMilestoneModal
            isOpen={!!editingMilestone}
            onClose={() => setEditingMilestone(null)}
            onSuccess={loadData}
            milestone={editingMilestone}
          />
          <EditAssetModal
            isOpen={!!editingAsset}
            onClose={() => setEditingAsset(null)}
            onSuccess={loadData}
            asset={editingAsset}
          />
          <EditTalentModal
            isOpen={!!editingTalent}
            onClose={() => setEditingTalent(null)}
            onSuccess={loadData}
            talent={editingTalent}
          />
          <EditStrengthModal
            isOpen={!!editingStrength}
            onClose={() => setEditingStrength(null)}
            onSuccess={loadData}
            strength={editingStrength}
          />
          <EditWeaknessModal
            isOpen={!!editingWeakness}
            onClose={() => setEditingWeakness(null)}
            onSuccess={loadData}
            weakness={editingWeakness}
          />
          <InitialSetupModal
            isOpen={showInitialSetupModal}
            onClose={() => setShowInitialSetupModal(false)}
            onSuccess={loadData}
            userId={currentUser.id}
          />
        </>
      )}
      
      {/* Toast 通知系统 */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}
