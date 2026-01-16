"use client";

import React, { createContext, useContext, useLayoutEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function لقراءة الثيم من localStorage
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  } catch {
    return 'light';
  }
}

// Font variable للعربية
const ARABIC_FONT_VAR = '__Noto_Kufi_Arabic_bfb5c1';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // استخدام lazy initialization
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const params = useParams();
  const locale = params?.locale || 'ar';

  // استخدام useLayoutEffect بدلاً من useEffect للتطبيق قبل الـ paint
  useLayoutEffect(() => {
    const root = document.documentElement;
    
    console.log('🎨 useLayoutEffect - Theme:', theme, 'Locale:', locale);
    
    // بناء الكلاسات المطلوبة
    const classes = [];
    
    // إضافة dark class إذا كان الثيم غامق
    if (theme === 'dark') {
      classes.push('dark');
    }
    
    // إضافة font variable للعربية
    if (locale === 'ar') {
      classes.push(ARABIC_FONT_VAR);
    }
    
    // تطبيق الكلاسات
    root.className = classes.join(' ');
    
    // حفظ في localStorage
    localStorage.setItem('theme', theme);
    
    // للتصحيح
    console.log('✅ Theme applied via useLayoutEffect');
    console.log('📋 HTML classes:', root.className);
    console.log('🔍 Has dark class:', root.classList.contains('dark'));
  }, [theme, locale]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDarkMode: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
