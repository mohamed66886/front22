'use client';

import { Locale } from '@/i18n/config';
import { Translations } from '@/types/translations';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface LatestNewsProps {
  translations: Translations;
  locale: Locale;
}

// Custom hook for scroll animation
function useScrollAnimation(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin: '0px' }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return [ref, isVisible] as const;
}

export default function LatestNews({ translations, locale }: LatestNewsProps) {
  const isRTL = locale === 'ar';
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Separate animation for each element
  const [titleRef, isTitleVisible] = useScrollAnimation(0.3);
  const [mainCardMobileRef, isMainCardMobileVisible] = useScrollAnimation(0.2);
  const [mainCardDesktopRef, isMainCardDesktopVisible] = useScrollAnimation(0.2);
  
  // Secondary cards animations for mobile
  const [card1MobileRef, isCard1MobileVisible] = useScrollAnimation(0.2);
  const [card2MobileRef, isCard2MobileVisible] = useScrollAnimation(0.2);
  const [card3MobileRef, isCard3MobileVisible] = useScrollAnimation(0.2);
  const [card4MobileRef, isCard4MobileVisible] = useScrollAnimation(0.2);
  
  // Secondary cards animations for desktop
  const [card1DesktopRef, isCard1DesktopVisible] = useScrollAnimation(0.2);
  const [card2DesktopRef, isCard2DesktopVisible] = useScrollAnimation(0.2);
  const [card3DesktopRef, isCard3DesktopVisible] = useScrollAnimation(0.2);
  const [card4DesktopRef, isCard4DesktopVisible] = useScrollAnimation(0.2);

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
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`flex flex-col items-center justify-center mb-16 transition-all duration-1000 ${
            isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          {/* Title */}
          <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight transform hover:scale-105 transition-transform duration-300">
            <span className="transition-colors duration-300 text-zinc-900 dark:text-white">
              {isRTL ? 'أحدث ' : 'Latest '}
            </span>
            <span className="text-sky-500 inline-block hover:animate-pulse">{isRTL ? 'الأخبار' : 'News'}</span>
          </h2>

          {/* Curve */}
          <svg
            className="mt-4 w-full max-w-70 sm:max-w-87.5 md:max-w-105"
            height="40"
            viewBox="0 0 420 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d="M10 30 C 140 5, 280 5, 410 30"
              stroke="#5BB6E8"
              strokeWidth="5"
              strokeLinecap="round"
              className={`transition-all duration-1000 delay-300 ${
                isTitleVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                strokeDasharray: isTitleVisible ? '0' : '1000',
                strokeDashoffset: isTitleVisible ? '0' : '1000',
              }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto space-y-2 lg:space-y-0">
          {/* Layout for Mobile: Featured first, then grid */}
          <div className="lg:hidden space-y-2">
            {/* Main Featured Article - Mobile */}
            <article 
              ref={mainCardMobileRef as React.RefObject<HTMLElement>}
              className={`relative group cursor-pointer overflow-hidden h-100 transition-all duration-700 shadow-lg hover:shadow-2xl rounded-lg ${
                isMainCardMobileVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Image
                src={currentArticle.image || '/news-1.jpg'}
                alt={currentArticle.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent group-hover:from-black transition-all duration-500"></div>
              
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
                  className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  aria-label={isRTL ? 'السابق' : 'Previous'}
                >
                  <svg className={`w-5 h-5 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  aria-label={isRTL ? 'التالي' : 'Next'}
                >
                  <svg className={`w-5 h-5 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-4 z-10`}>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:-translate-y-1 transition-transform duration-300">
                  {currentArticle.title}
                </h3>
                <div className={`flex items-center gap-2 text-zinc-300 text-xs ${isRTL ? 'flex-row-reverse' : ''} group-hover:text-sky-400 transition-colors duration-300`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{currentArticle.date}</span>
                </div>
              </div>
            </article>

            {/* Secondary Articles Grid - Mobile */}
            <div className="grid grid-cols-2 gap-2">
              {translations.news.articles.slice(1, 5).map((article, index) => {
                const cardRefs = [card1MobileRef, card2MobileRef, card3MobileRef, card4MobileRef];
                const cardVisibility = [isCard1MobileVisible, isCard2MobileVisible, isCard3MobileVisible, isCard4MobileVisible];
                
                return (
                  <article 
                    key={article.id}
                    ref={cardRefs[index] as React.RefObject<HTMLElement>}
                    className={`relative group cursor-pointer overflow-hidden h-50 transition-all duration-700 shadow-lg hover:shadow-2xl rounded-lg ${
                      cardVisibility[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                  <Image
                    src={article.image || '/news-1.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent group-hover:from-black transition-all duration-500"></div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} z-10`}>
                    <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold rounded group-hover:scale-110 transition-transform duration-300">
                      {article.category || (isRTL ? index === 0 ? 'علوم وتكنولوجيا' : index === 1 ? 'نصائح عامة' : index === 2 ? 'نصائح عامة' : 'محافظات' : 'News')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-2 z-10`}>
                    <h3 className="text-xs font-bold text-white mb-1 leading-tight line-clamp-3 group-hover:-translate-y-0.5 transition-transform duration-300">
                      {article.title}
                    </h3>
                    <div className={`flex items-center gap-1 text-zinc-300 text-[10px] ${isRTL ? 'flex-row-reverse' : ''} group-hover:text-sky-400 transition-colors duration-300`}>
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          </div>

          {/* Layout for Desktop */}
          <div className={`hidden lg:flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
            {/* Secondary Articles Grid - Desktop Left (Right in RTL) */}
            <div className="grid grid-cols-2 gap-2 w-1/2">
              {translations.news.articles.slice(1, 5).map((article, index) => {
                const cardRefs = [card1DesktopRef, card2DesktopRef, card3DesktopRef, card4DesktopRef];
                const cardVisibility = [isCard1DesktopVisible, isCard2DesktopVisible, isCard3DesktopVisible, isCard4DesktopVisible];
                
                return (
                  <article 
                    key={article.id}
                    ref={cardRefs[index] as React.RefObject<HTMLElement>}
                    className={`relative group cursor-pointer overflow-hidden min-h-71.25 transition-all duration-700 shadow-lg hover:shadow-2xl rounded-lg ${
                      cardVisibility[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                  <Image
                    src={article.image || '/news-1.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent group-hover:from-black transition-all duration-500"></div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-10`}>
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded group-hover:scale-110 transition-transform duration-300">
                      {article.category || (isRTL ? index === 0 ? 'علوم وتكنولوجيا' : index === 1 ? 'نصائح عامة' : index === 2 ? 'نصائح عامة' : 'محافظات' : 'News')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-3 z-10`}>
                    <h3 className="text-sm font-bold text-white mb-1.5 leading-tight line-clamp-3 group-hover:-translate-y-0.75 transition-transform duration-300">
                      {article.title}
                    </h3>
                    <div className={`flex items-center gap-1.5 text-zinc-300 text-xs ${isRTL ? 'flex-row-reverse' : ''} group-hover:text-sky-400 transition-colors duration-300`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>

            {/* Main Featured Article - Desktop Right (Left in RTL) */}
            <article 
              ref={mainCardDesktopRef as React.RefObject<HTMLElement>}
              className={`w-1/2 relative group cursor-pointer overflow-hidden min-h-150 transition-all duration-700 shadow-lg hover:shadow-2xl rounded-lg ${
                isMainCardDesktopVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Image
                src={currentArticle.image || '/news-1.jpg'}
                alt={currentArticle.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent group-hover:from-black transition-all duration-500"></div>
              
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
                  className="w-12 h-12 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                  aria-label={isRTL ? 'السابق' : 'Previous'}
                >
                  <svg className={`w-6 h-6 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                  aria-label={isRTL ? 'التالي' : 'Next'}
                >
                  <svg className={`w-6 h-6 text-zinc-700 dark:text-zinc-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className={`absolute inset-0 flex flex-col justify-end ${isRTL ? 'text-right' : 'text-left'} p-5 z-10`}>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2.5 leading-tight group-hover:-translate-y-1 transition-transform duration-300">
                  {currentArticle.title}
                </h3>
                <div className={`flex items-center gap-2 text-zinc-300 text-sm ${isRTL ? 'flex-row-reverse' : ''} group-hover:text-sky-400 transition-colors duration-300`}>
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
