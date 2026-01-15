"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Target,
  Globe,
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react";
import { getTranslations } from "@/i18n/utils";
import type { Locale } from "@/i18n/config";

interface AboutUsProps {
  locale: Locale;
}

export default function AboutUs({ locale }: AboutUsProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);
  const [isVisionSectionVisible, setIsVisionSectionVisible] = useState(false);
  
  const titleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  
  const isRTL = locale === 'ar';

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };

    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        setIsTitleVisible(entry.isIntersecting);
      },
      observerOptions
    );

    const imageObserver = new IntersectionObserver(
      ([entry]) => {
        setIsImageVisible(entry.isIntersecting);
      },
      observerOptions
    );

    const contentObserver = new IntersectionObserver(
      ([entry]) => {
        setIsContentVisible(entry.isIntersecting);
      },
      observerOptions
    );

    const cardsObserver = new IntersectionObserver(
      ([entry]) => {
        setIsCardsVisible(entry.isIntersecting);
      },
      observerOptions
    );

    const visionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisionSectionVisible(entry.isIntersecting);
      },
      observerOptions
    );

    const titleElement = titleRef.current;
    const imageElement = imageRef.current;
    const contentElement = contentRef.current;
    const cardsElement = cardsRef.current;
    const visionElement = visionRef.current;

    if (titleElement) titleObserver.observe(titleElement);
    if (imageElement) imageObserver.observe(imageElement);
    if (contentElement) contentObserver.observe(contentElement);
    if (cardsElement) cardsObserver.observe(cardsElement);
    if (visionElement) visionObserver.observe(visionElement);

    return () => {
      if (titleElement) titleObserver.unobserve(titleElement);
      if (imageElement) imageObserver.unobserve(imageElement);
      if (contentElement) contentObserver.unobserve(contentElement);
      if (cardsElement) cardsObserver.unobserve(cardsElement);
      if (visionElement) visionObserver.unobserve(visionElement);
    };
  }, []);

  const t = (key: string): string => {
    const translations = getTranslations(locale);
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  return (
    <div className="bg-gray-50"  dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* About Description Section */}
      <section className="py-12 overflow-hidden md:py-16 bg-white">
                <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`flex flex-col items-center justify-center mb-16 transition-all duration-1000 ${
            isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          {/* Title */}
          <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight transform hover:scale-105 transition-transform duration-300">
            <span className="transition-colors duration-300 text-zinc-900 dark:text-white">
              {isRTL ? 'من ' : 'About '}
            </span>
            <span className="text-sky-500 inline-block hover:animate-pulse">{isRTL ? 'نحن' : 'Us'}</span>
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Image */}
            <div 
              ref={imageRef}
              className={`relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg order-2 lg:order-1 transition-all duration-1000 transform ${
                isImageVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${isRTL ? 'translate-x-20' : '-translate-x-20'}`
              }`}
            >
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop"
                alt={t("about.overview.title")}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div 
              ref={contentRef}
              className={`order-1 lg:order-2 transition-all duration-1000 delay-300 transform ${
                isContentVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${isRTL ? '-translate-x-20' : 'translate-x-20'}`
              }`}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                {t("about.overview.title")}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 md:mb-8">
                {t("about.description")}
              </p>
              <div 
                ref={cardsRef}
                className={`grid grid-cols-2 gap-3 md:gap-4 transition-all duration-1000 delay-500 ${
                  isCardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="bg-blue-50 p-3 md:p-5 rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row items-center md:gap-3 mb-2 md:mb-3">
                    <div className="rounded-lg shrink-0 mb-2 md:mb-0">
                      <Target className="w-8 h-8 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <h4 className="text-gray-900 font-semibold text-xs md:text-base text-center md:text-right">
                      {t("about.overview.academicExcellence")}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm text-center md:text-right">
                    {t("about.overview.academicExcellenceDesc")}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 md:p-5 rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row items-center md:gap-3 mb-2 md:mb-3">
                    <div className="rounded-lg shrink-0 mb-2 md:mb-0">
                      <Globe className="w-8 h-8 md:w-5 md:h-5 text-blue-600" />
                    </div>
                    <h4 className="text-gray-900 font-semibold text-xs md:text-base text-center md:text-right">
                      {t("about.overview.globalStandards")}
                    </h4>
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm text-center md:text-right">
                    {t("about.overview.globalStandardsDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Goals Section */}
      <section 
        ref={visionRef}
        className={`relative py-12 md:py-16 overflow-hidden flex items-center min-h-112.5 md:min-h-125 transition-all duration-1000 ${
          isVisionSectionVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/computer.mp4" type="video/mp4" />
        </video>
        
        {/* Blue overlay filter */}
        <div className="absolute inset-0 bg-blue-300 opacity-20"></div>
        
        <div className={`relative z-10 w-full flex items-center px-4 sm:px-6 lg:px-8 ${locale === 'ar' ? 'justify-start' : 'justify-end'}`}>
          {/* Main Card */}
          <div className={`w-full md:w-2/5 lg:w-1/3 bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg transition-all duration-1000 delay-300 transform ${
            isVisionSectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          } ${locale === 'ar' ? 'md:mr-8 lg:mr-20' : 'md:ml-8 lg:ml-20'}`}
          >
            <div className="p-5 md:p-8 w-full">
              {/* Title */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 text-center mb-2 md:mb-3">
                {t("about.services.title")}
              </h2>
              
              {/* Subtitle */}
              <div className="text-center mb-6 md:mb-10">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base pb-2 border-b-2 border-red-500 inline-block font-normal px-2">
                  {t("about.services.subtitle")}
                  <br className="hidden sm:block" />
                  <span className="hidden sm:inline">{t("about.services.subtitleLine2")}</span>
                </p>
              </div>

              {/* Three Circles - Horizontal Layout */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {/* Student Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 md:border-3 border-red-500 flex items-center justify-center mb-2 md:mb-3 bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-teal-700" />
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-red-500 text-center leading-tight">
                    {t("about.services.students")}
                  </h3>
                </div>

                {/* Staff Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 md:border-3 border-red-500 flex items-center justify-center mb-2 md:mb-3 bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-teal-700" />
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-red-500 text-center leading-tight">
                    {t("about.services.staff")}
                  </h3>
                </div>

                {/* Graduate Circle */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 md:border-3 border-red-500 flex items-center justify-center mb-2 md:mb-3 bg-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-teal-700" />
                  </div>
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-red-500 text-center leading-tight">
                    {t("about.services.graduates")}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}