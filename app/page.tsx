'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
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
import { DataTabs } from '@/components/ui/DataTabs'
import { HighlightCard } from '@/components/ui/HighlightCard'
import { CelebrationOverlay } from '@/components/ui/CelebrationOverlay'
import { ShareButton } from '@/components/ui/ShareButton'
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
  AlertTriangle,
} from 'lucide-react'
import { formatCurrency, calculateAge, calculateBMI, getBMICategory } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { usePerformance } from '@/hooks/usePerformance'
import { useStreak } from '@/hooks/useStreak'
import { useFocusAreas } from '@/hooks/useFocusAreas'
import { ToastContainer } from '@/components/ui/Toast'
import { SimpleLoading } from '@/components/ui/SimpleLoading'
import { CleanHeader } from '@/components/ui/CleanHeader'
import { CleanCard, CleanCardHeader, CleanCardContent, CleanCardTitle } from '@/components/ui/CleanCard'
import { CleanButton } from '@/components/ui/CleanButton'
import { CleanStatsCard } from '@/components/ui/CleanStatsCard'

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [demoUser, setDemoUser] = useState<any>(null)
  const { toasts } = useToast()
  const { measureRender } = usePerformance('Dashboard')
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
    return <SimpleLoading message="正在加载您的人生数据..." />
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
    <div className="min-h-screen bg-gray-50">
      {/* 简洁导航栏 */}
      <CleanHeader
        onAddSkill={() => setShowAddSkillModal(true)}
        onAddMilestone={() => setShowAddMilestoneModal(true)}
        onAddAsset={() => setShowAddAssetModal(true)}
        onAddTalent={() => setShowAddTalentModal(true)}
        onAddStrength={() => setShowAddStrengthModal(true)}
        onAddWeakness={() => setShowAddWeaknessModal(true)}
        onEditProfile={() => setShowEditProfileModal(true)}
        onSignOut={signOut}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 个人信息卡片 */}
        {profile && (
          <CleanCard className="mb-8">
            <CleanCardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CleanCardTitle>{profile.name}</CleanCardTitle>
                    <p className="text-gray-600">{profile.occupation}</p>
                    {profile.birth_date && (
                      <p className="text-sm text-gray-500">
                        {calculateAge(profile.birth_date)} 岁
                      </p>
                    )}
                  </div>
                </div>
                <CleanButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <Edit className="h-4 w-4" />
                </CleanButton>
              </div>
            </CleanCardHeader>
            <CleanCardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {profile.current_height && profile.current_weight && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">BMI</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {calculateBMI(profile.current_weight, profile.current_height)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getBMICategory(calculateBMI(profile.current_weight, profile.current_height)).category}
                    </p>
                  </div>
                )}
                {profile.location && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">位置</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.location}</p>
                  </div>
                )}
                {profile.bio && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">简介</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>
            </CleanCardContent>
          </CleanCard>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <CleanStatsCard
            title="技能数量"
            value={skills.length}
            subtitle={`平均等级 ${avgSkillLevel.toFixed(1)}`}
            icon={Award}
          />
          <CleanStatsCard
            title="总资产价值"
            value={formatCurrency(totalAssetValue)}
            subtitle={`${assets.length} 项资产`}
            icon={DollarSign}
          />
          <CleanStatsCard
            title="已完成里程碑"
            value={completedMilestones}
            subtitle={`总共 ${milestones.length} 个`}
            icon={Target}
          />
          <CleanStatsCard
            title="天赋数量"
            value={talents.length}
            subtitle={`平均等级 ${talents.length > 0 ? (talents.reduce((sum, t) => sum + t.level, 0) / talents.length).toFixed(1) : '0'}`}
            icon={Sparkles}
          />
          <CleanStatsCard
            title="优点数量"
            value={strengths.length}
            subtitle="个人优势"
            icon={ThumbsUp}
          />
          <CleanStatsCard
            title="改进方面"
            value={weaknesses.length}
            subtitle={`${weaknesses.filter(w => w.priority === 3).length} 高优先级`}
            icon={AlertTriangle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* 技能概览 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">技能概览</h2>
              <CleanButton variant="ghost" size="sm">
                查看全部
              </CleanButton>
            </div>
            <div className="space-y-3">
              {skills.slice(0, 6).map((skill) => (
                <CleanCard 
                  key={skill.id} 
                  hover
                  onClick={() => setEditingSkill(skill)}
                  className="p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{skill.name}</h3>
                      {skill.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {skill.level}/10
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-gray-700 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(skill.level / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CleanCard>
              ))}
              {skills.length === 0 && (
                <CleanCard className="p-8 text-center">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">还没有添加技能</p>
                  <CleanButton 
                    variant="outline" 
                    onClick={() => setShowAddSkillModal(true)}
                  >
                    添加第一个技能
                  </CleanButton>
                </CleanCard>
              )}
            </div>
          </div>

          {/* 里程碑 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">近期里程碑</h2>
              <CleanButton variant="ghost" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                查看全部
              </CleanButton>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <CleanCard 
                  key={milestone.id} 
                  hover
                  onClick={() => setEditingMilestone(milestone)}
                  className="p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      milestone.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {milestone.status === 'completed' ? '已完成' : 
                       milestone.status === 'in_progress' ? '进行中' : '待开始'}
                    </span>
                  </div>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {milestone.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-700 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${milestone.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {milestone.progress || 0}%
                    </span>
                  </div>
                </CleanCard>
              ))}
              {milestones.length === 0 && (
                <CleanCard className="p-8 text-center">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">还没有设置里程碑</p>
                  <CleanButton 
                    variant="outline" 
                    onClick={() => setShowAddMilestoneModal(true)}
                  >
                    创建第一个里程碑
                  </CleanButton>
                </CleanCard>
              )}
            </div>
          </div>
        </div>

        {/* 天赋、优点缺点 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
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
                <CleanCard className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">发现您的天赋潜能</p>
                  <CleanButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddTalentModal(true)}
                  >
                    添加第一个天赋
                  </CleanButton>
                </CleanCard>
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
                <CleanCard className="p-6 text-center">
                  <ThumbsUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">记录您的个人优势</p>
                  <CleanButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddStrengthModal(true)}
                  >
                    添加第一个优点
                  </CleanButton>
                </CleanCard>
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
                <CleanCard className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">识别成长机会</p>
                  <CleanButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddWeaknessModal(true)}
                  >
                    添加改进方面
                  </CleanButton>
                </CleanCard>
              )}
            </div>
          </div>
        </div>

        {/* 资产概览 */}
        {assets.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">资产概览</h2>
              <CleanButton variant="ghost" size="sm">
                查看详情
              </CleanButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.slice(0, 6).map((asset) => (
                <CleanCard 
                  key={asset.id} 
                  hover
                  onClick={() => setEditingAsset(asset)}
                  className="p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {asset.name}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {asset.category}
                      </span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatCurrency(asset.current_value || 0, asset.currency)}
                    </p>
                    {asset.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {asset.description}
                      </p>
                    )}
                  </div>
                </CleanCard>
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
