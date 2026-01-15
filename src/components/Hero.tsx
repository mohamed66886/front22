'use client';

import { useState, useEffect } from 'react';
import { Locale } from '@/i18n/config';
import { Translations } from '@/types/translations';
import Image from 'next/image';

interface HeroProps {
  translations: Translations;
  locale: Locale;
}

export default function Hero({ translations, locale }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    // Trigger animations in sequence
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setTitleVisible(true), 300);
    const timer3 = setTimeout(() => setSubtitleVisible(true), 600);
    const timer4 = setTimeout(() => setImageVisible(true), 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div className={`absolute inset-0 z-0 transition-all duration-1000 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
      }`}>
        <Image
          src="https://www.emaratalyoum.com/polopoly_fs/1.1170819.1546953649!/image/image.jpeg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/30 via-blue-500/25 to-blue-400/20 dark:from-blue-800/40 dark:via-blue-700/35 dark:to-blue-600/30"></div>
        {/* Shadow from top */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 pt-32 relative z-10">
        <div className="max-w-350 mx-auto">
          <div className="grid md:grid-cols-[70%_30%] gap-12 items-center">
            {/* Content Side */}
            <div className={`text-center ${locale === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
              <h1 className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl leading-tight whitespace-pre-line px-2 transition-all duration-1000 transform ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
              }`}>
                {translations.hero.title}
              </h1>
              <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-0 md:mb-12 drop-shadow-lg px-2 transition-all duration-1000 delay-300 transform ${
                subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
              }`}>
                {translations.hero.subtitle}
              </p>
              {/* <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
                <Link
                  href={`/${locale}#contact`}
                  className="px-8 py-4 bg-white/95 text-blue-900 rounded-full font-semibold hover:bg-white transition-all transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 backdrop-blur-sm"
                >
                  {translations.hero.cta}
                </Link>
                <Link
                  href={`/${locale}#about`}
                  className="px-8 py-4 bg-white/10 text-white border-2 border-white/50 rounded-full font-semibold hover:bg-white/20 hover:border-white backdrop-blur-md transition-all shadow-2xl"
                >
                  {translations.hero.learnMore}
                </Link>
              </div> */}
            </div>

            {/* Image Side */}
            <div className={`relative transition-all duration-1000 delay-500 transform ${
              imageVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-12'
            }`}>
              <div className="relative w-full max-w-3xl mx-auto animate-float">
                <Image
                  src="/logohero.png"
                  alt="Hero Image"
                  width={300}
                  height={300}
                  className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-110"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={`absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob z-10 transition-all duration-1000 ${
        isVisible ? 'scale-100' : 'scale-0'
      }`}></div>
      <div className={`absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-15 animate-blob animation-delay-2000 z-10 transition-all duration-1000 delay-300 ${
        isVisible ? 'scale-100' : 'scale-0'
      }`}></div>
      <div className={`absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000 z-10 transition-all duration-1000 delay-500 ${
        isVisible ? 'scale-100' : 'scale-0'
      }`}></div>
    </section>
  );
}
