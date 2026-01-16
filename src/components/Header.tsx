'use client';

import { Locale } from '@/i18n/config';
import { Translations } from '@/types/translations';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  LogIn, 
  UserPlus,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  translations: Translations;
  locale: Locale;
}

export default function Header({ translations, locale }: HeaderProps) {
  const isRTL = locale === 'ar';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll(); // Check initial scroll position
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      suppressHydrationWarning
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg border-b border-zinc-300/50 dark:bg-zinc-900/95 dark:border-zinc-700/50 shadow-sm' 
        : 'bg-transparent border-b border-white/10'
    }`}>
      <div className="container mx-auto px-4 md:px-6" suppressHydrationWarning>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image 
                src="/Coat_of_arms_of_Egypt_(Official).svg" 
                alt="Logo" 
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 40px, 48px"
              />
            </div>
            <div className="flex flex-col">
              <span 
                suppressHydrationWarning
                className={`text-lg md:text-xl font-bold leading-tight transition-colors ${
                isScrolled ? 'text-zinc-900 dark:text-white' : 'text-white drop-shadow-lg'
              }`}>
                {isRTL ? 'وحدة ضمان الجودة' : 'ISFQAU Team'}
              </span>
              <span 
                suppressHydrationWarning
                className={`text-xs md:text-sm leading-tight transition-colors ${
                isScrolled ? 'text-zinc-600 dark:text-zinc-400' : 'text-white/90 drop-shadow-md'
              }`}>
                {isRTL ? 'في خدمة الجامعات المصرية' : 'Serving Egyptian Universities'}
              </span>
            </div>
          </Link>

          {/* Actions Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Login Button - Desktop */}
            <Link
              href={`/${locale}/login`}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group hover:bg-white/10 ${
                isScrolled
                  ? 'text-zinc-700 hover:text-primary-600 dark:text-zinc-300 dark:hover:text-white'
                  : 'text-white hover:text-white/80'
              }`}
            >
              <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>{translations.header.login}</span>
            </Link>

            {/* Register Button - Desktop */}
            <Link
              href={`/${locale}/register`}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group ${
                isScrolled
                  ? 'text-zinc-700 hover:text-primary-600 dark:text-zinc-300 dark:hover:text-white'
                  : 'text-white hover:text-white/80'
              }`}
            >
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>{translations.header.register}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              suppressHydrationWarning
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? 'text-zinc-700 dark:text-zinc-300' : 'text-white'}`} suppressHydrationWarning />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-zinc-700 dark:text-zinc-300' : 'text-white'}`} suppressHydrationWarning />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-6 border-t border-zinc-200 dark:border-zinc-800 animate-fade-in">
            {/* User Actions */}
            <div className="space-y-2 mb-6">
              <Link
                href={`/${locale}/login`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-white/10 ${
                  isScrolled
                    ? 'text-zinc-700 hover:text-primary-600 dark:text-zinc-300 dark:hover:text-white'
                    : 'text-white hover:text-white/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                {translations.header.login}
              </Link>
              <Link
                href={`/${locale}/register`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-white/10 ${
                  isScrolled
                    ? 'text-zinc-700 hover:text-primary-600 dark:text-zinc-300 dark:hover:text-white'
                    : 'text-white hover:text-white/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus className="w-5 h-5" />
                {translations.header.register}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}