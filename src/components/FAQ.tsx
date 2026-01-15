'use client';

import { useState, useEffect, useRef } from 'react';
import { Locale } from '@/i18n/config';
import { Translations } from '@/types/translations';

interface FAQProps {
  translations: Translations;
  locale: Locale;
}

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
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

export default function FAQ({ translations, locale }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isRTL = locale === 'ar';
  
  // Separate animations for title and content
  const [titleRef, isTitleVisible] = useScrollAnimation(0.3);
  const [contentRef, isContentVisible] = useScrollAnimation(0.2);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = translations.faq?.questions || [];

  return (
    <section id="faq" className="py-12 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        {/* New Header Section */}
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`flex flex-col items-center justify-center mb-12 md:mb-16 transition-all duration-1000 ${
            isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          {/* Title */}
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-center transform hover:scale-105 transition-transform duration-300">
            <span className="transition-colors duration-300 text-gray-900 dark:text-white">
              {isRTL ? 'الأسئلة ' : 'Frequently Asked '}
            </span>
            <span className="text-sky-500 inline-block hover:animate-pulse">{isRTL ? 'الشائعة' : 'Questions'}</span>
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

        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className={`max-w-5xl mx-auto grid md:grid-cols-2 gap-0 md:gap-10 items-center bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-700 ${
            isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        > 
          {/* Image Side as Background */}
          <div className={`relative h-48 sm:h-64 md:h-full w-full flex items-center justify-center bg-[url('/FAQ.png')] bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105 ${locale === 'ar' ? 'md:order-2' : ''}`}></div>

          {/* FAQ Content Side */}
          <div className="py-6 px-4 sm:py-8 sm:px-6 md:py-10 md:px-8">
            <div className="space-y-2 sm:space-y-3">
              {faqItems.length > 0 ? (
                faqItems.map((item: FAQItem, index: number) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 overflow-hidden hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <button
                      onClick={() => toggleQuestion(index)}
                      className={`w-full text-${locale === 'ar' ? 'right' : 'left'} p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors`}
                    >
                      <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex-1 leading-snug">
                        {item.question}
                      </span>
                      <svg
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 shrink-0 ${
                          openIndex === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openIndex === index ? 'max-h-48 sm:max-h-40' : 'max-h-0'
                      }`}
                    >
                      <div className={`p-3 sm:p-4 pt-0 text-${locale === 'ar' ? 'right' : 'left'} text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm`}>
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Default FAQ items if translations not available
                <div className="space-y-2 sm:space-y-3">
                  {[
                    {
                      question: locale === 'ar' 
                        ? 'ما هو نظام معلومات وحدات ضمان الجودة؟'
                        : 'What is the Quality Assurance Units Information System?',
                      answer: locale === 'ar'
                        ? 'هو نظام متكامل يهدف إلى إدارة وتنظيم عمليات ضمان الجودة في الجامعات وفقاً للمعايير العالمية والمحلية، ويوفر أدوات لمتابعة وتقييم الأداء الأكاديمي والإداري.'
                        : 'It is an integrated system aimed at managing and organizing quality assurance processes in universities according to international and local standards, providing tools for monitoring and evaluating academic and administrative performance.'
                    },
                    {
                      question: locale === 'ar'
                        ? 'كيف يمكنني التسجيل في النظام؟'
                        : 'How can I register in the system?',
                      answer: locale === 'ar'
                        ? 'يمكنك التسجيل عن طريق الضغط على زر "إنشاء حساب" في أعلى الصفحة، ثم ملء البيانات المطلوبة. سيتم مراجعة طلبك والموافقة عليه من قبل إدارة النظام.'
                        : 'You can register by clicking the "Register" button at the top of the page, then filling in the required information. Your request will be reviewed and approved by the system administration.'
                    },
                    {
                      question: locale === 'ar'
                        ? 'ما هي المعايير المعتمدة في النظام؟'
                        : 'What standards are adopted in the system?',
                      answer: locale === 'ar'
                        ? 'النظام يعتمد على معايير الهيئة القومية لضمان جودة التعليم والاعتماد (NAQAAE) بالإضافة إلى المعايير الدولية للجودة في التعليم العالي.'
                        : 'The system adopts the standards of the National Authority for Quality Assurance and Accreditation of Education (NAQAAE) in addition to international quality standards in higher education.'
                    },
                    {
                      question: locale === 'ar'
                        ? 'هل يوفر النظام تقارير تفصيلية؟'
                        : 'Does the system provide detailed reports?',
                      answer: locale === 'ar'
                        ? 'نعم، النظام يوفر مجموعة شاملة من التقارير التفصيلية والإحصائيات التي تساعد في اتخاذ القرارات وتحسين الأداء المؤسسي.'
                        : 'Yes, the system provides a comprehensive set of detailed reports and statistics that help in decision-making and improving institutional performance.'
                    },
                    {
                      question: locale === 'ar'
                        ? 'من يمكنه استخدام النظام؟'
                        : 'Who can use the system?',
                      answer: locale === 'ar'
                        ? 'النظام متاح لأعضاء هيئة التدريس، الإداريين، منسقي الجودة، وإدارة الجامعة. كل مستخدم لديه صلاحيات محددة حسب دوره في المؤسسة.'
                        : 'The system is available for faculty members, administrators, quality coordinators, and university management. Each user has specific permissions based on their role in the institution.'
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 overflow-hidden hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
                    >
                      <button
                        onClick={() => toggleQuestion(index)}
                        className={`w-full text-${locale === 'ar' ? 'right' : 'left'} p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors`}
                      >
                        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex-1 leading-snug">
                          {item.question}
                        </span>
                        <svg
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300 shrink-0 ${
                            openIndex === index ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openIndex === index ? 'max-h-48 sm:max-h-40' : 'max-h-0'
                        }`}
                      >
                        <div className={`p-3 sm:p-4 pt-0 text-${locale === 'ar' ? 'right' : 'left'} text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm`}>
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Contact Support */}
            <div className="mt-6 sm:mt-8 md:mt-10 text-center">
              <a
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all text-xs sm:text-sm shadow-sm hover:shadow-lg hover:scale-105"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
