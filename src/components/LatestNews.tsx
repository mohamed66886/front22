'use client';

import { Locale } from '@/i18n/config';
import { Translations } from '@/types/translations';
import Image from 'next/image';
import { useState } from 'react';

interface LatestNewsProps {
  translations: Translations;
  locale: Locale;
}

export default function LatestNews({ translations, locale }: LatestNewsProps) {
  const isRTL = locale === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? translations.news.articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === translations.news.articles.length - 1 ? 0 : prev + 1));
  };

  const currentArticle = translations.news.articles[currentIndex];

  return (
    <section id="news" className="py-16 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
            {translations.news.title}
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            {translations.news.subtitle}
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-2 lg:space-y-0">
          {/* Layout for Mobile: Featured first, then grid */}
          <div className="lg:hidden space-y-2">
            {/* Main Featured Article - Mobile */}
            <article className="relative group cursor-pointer overflow-hidden h-[400px]">
              <Image
                src={currentArticle.image || '/news-1.jpg'}
                alt={currentArticle.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
              
              {/* Category Badge */}
              <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} z-10`}>
                <span className="bg-red-600 text-white px-4 py-1.5 text-sm font-bold rounded">
                  {currentArticle.category || (isRTL ? 'محافظات' : 'Local')}
                </span>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-20">
                <button 
                  onClick={handlePrevious}
                  className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                  aria-label={isRTL ? 'السابق' : 'Previous'}
                >
                  <svg className={`w-5 h-5 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                  aria-label={isRTL ? 'التالي' : 'Next'}
                >
                  <svg className={`w-5 h-5 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-4 z-10`}>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {currentArticle.title}
                </h3>
                <div className={`flex items-center gap-2 text-zinc-300 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{currentArticle.date}</span>
                </div>
              </div>
            </article>

            {/* Secondary Articles Grid - Mobile */}
            <div className="grid grid-cols-2 gap-2">
              {translations.news.articles.slice(1, 5).map((article, index) => (
                <article 
                  key={article.id}
                  className="relative group cursor-pointer overflow-hidden h-[200px]"
                >
                  <Image
                    src={article.image || '/news-1.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} z-10`}>
                    <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold rounded">
                      {article.category || (isRTL ? index === 0 ? 'علوم وتكنولوجيا' : index === 1 ? 'نصائح عامة' : index === 2 ? 'نصائح عامة' : 'محافظات' : 'News')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-2 z-10`}>
                    <h3 className="text-xs font-bold text-white mb-1 leading-tight line-clamp-3">
                      {article.title}
                    </h3>
                    <div className={`flex items-center gap-1 text-zinc-300 text-[10px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Layout for Desktop */}
          <div className={`hidden lg:flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
            {/* Secondary Articles Grid - Desktop Left (Right in RTL) */}
            <div className="grid grid-cols-2 gap-2 w-1/2">
              {translations.news.articles.slice(1, 5).map((article, index) => (
                <article 
                  key={article.id}
                  className="relative group cursor-pointer overflow-hidden min-h-[285px]"
                >
                  <Image
                    src={article.image || '/news-1.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-10`}>
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">
                      {article.category || (isRTL ? index === 0 ? 'علوم وتكنولوجيا' : index === 1 ? 'نصائح عامة' : index === 2 ? 'نصائح عامة' : 'محافظات' : 'News')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-3 z-10`}>
                    <h3 className="text-sm font-bold text-white mb-1.5 leading-tight line-clamp-3">
                      {article.title}
                    </h3>
                    <div className={`flex items-center gap-1.5 text-zinc-300 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Main Featured Article - Desktop Right (Left in RTL) */}
            <article className="w-1/2 relative group cursor-pointer overflow-hidden min-h-[600px]">
              <Image
                src={currentArticle.image || '/news-1.jpg'}
                alt={currentArticle.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
              
              {/* Category Badge */}
              <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} z-10`}>
                <span className="bg-red-600 text-white px-4 py-1.5 text-sm font-bold rounded">
                  {currentArticle.category || (isRTL ? 'محافظات' : 'Local')}
                </span>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-6 z-20">
                <button 
                  onClick={handlePrevious}
                  className="w-12 h-12 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                  aria-label={isRTL ? 'السابق' : 'Previous'}
                >
                  <svg className={`w-6 h-6 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                  aria-label={isRTL ? 'التالي' : 'Next'}
                >
                  <svg className={`w-6 h-6 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-5 z-10`}>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2.5 leading-tight">
                  {currentArticle.title}
                </h3>
                <div className={`flex items-center gap-2 text-zinc-300 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{currentArticle.date}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
