// 简洁大气的设计系统
export const designSystem = {
  // 配色方案 - 简洁专业
  colors: {
    // 主色调 - 深蓝色系，专业稳重
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9', 
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // 主色
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    
    // 辅助色 - 纯净的灰色系
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5', 
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    },
    
    // 功能色 - 克制使用
    success: '#10b981', // 绿色
    warning: '#f59e0b', // 橙色  
    error: '#ef4444',   // 红色
    info: '#3b82f6',    // 蓝色
    
    // 背景色
    background: '#ffffff',
    surface: '#fafafa',
    
    // 边框色
    border: '#e5e5e5',
    divider: '#f5f5f5'
  },

  // 字体系统
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'   // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },

  // 间距系统 - 8px 基准
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem'     // 80px
  },

  // 圆角系统
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px'
  },

  // 阴影系统 - 克制使用
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    none: 'none'
  },

  // 动画系统 - 简洁流畅
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms'
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)'
    }
  }
} as const

// 组件变体
export const componentVariants = {
  button: {
    primary: {
      bg: designSystem.colors.primary[600],
      color: '#ffffff',
      hover: designSystem.colors.primary[700],
      active: designSystem.colors.primary[800]
    },
    secondary: {
      bg: designSystem.colors.neutral[100],
      color: designSystem.colors.neutral[700],
      hover: designSystem.colors.neutral[200],
      active: designSystem.colors.neutral[300]
    },
    outline: {
      bg: 'transparent',
      color: designSystem.colors.primary[600],
      border: designSystem.colors.primary[300],
      hover: designSystem.colors.primary[50]
    },
    ghost: {
      bg: 'transparent',
      color: designSystem.colors.neutral[600],
      hover: designSystem.colors.neutral[100]
    }
  },
  
  card: {
    default: {
      bg: '#ffffff',
      border: designSystem.colors.border,
      shadow: designSystem.shadow.sm
    },
    elevated: {
      bg: '#ffffff',
      border: 'transparent',
      shadow: designSystem.shadow.md
    }
  }
}

export type ColorScale = typeof designSystem.colors.primary
export type ComponentVariant = keyof typeof componentVariants.button


