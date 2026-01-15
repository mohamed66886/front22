'use client';

import { Locale } from '@/i18n/config';
import { Translations } from '@/types/translations';
import Image from 'next/image';

interface AboutUsProps {
  translations?: Translations;
  locale: Locale;
}

export default function AboutUs({ locale }: AboutUsProps) {
  const isArabic = locale === 'ar';

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {isArabic ? 'من نحن' : 'About Us'}
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-linear-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {isArabic 
              ? 'نسعى لتمثيل طلاب الجامعات المصرية وتقديم الدعم والخدمات اللازمة'
              : 'We strive to represent Egyptian university students and provide the necessary support and services'
            }
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative h-64 sm:h-96 lg:h-125 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/Coat_of_arms_of_Egypt_(Official).svg"
                alt={isArabic ? 'شعار مصر' : 'Egypt Coat of Arms'}
                fill
                className="object-contain p-8 sm:p-12 bg-white dark:bg-gray-800"
              />
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 sm:w-40 sm:h-40 bg-indigo-500/10 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Mission Card */}
            <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {isArabic ? 'رسالتنا' : 'Our Mission'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isArabic 
                      ? 'نلتزم بنشر ثقافة الجودة وتطبيق معايير الاعتماد الأكاديمي، وتطوير العملية التعليمية والبحثية وخدمة المجتمع من خلال التقييم المستمر للأداء وتحسين جودة المخرجات التعليمية.'
                      : 'We are committed to spreading the culture of quality and applying academic accreditation standards, developing the educational and research process, and community service through continuous performance evaluation and improving the quality of educational outcomes.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {isArabic ? 'رؤيتنا' : 'Our Vision'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isArabic 
                      ? 'نسعى لتحقيق التميز والريادة في التعليم العالي من خلال تطبيق معايير الجودة الشاملة والاعتماد الأكاديمي، وتحسين مستوى الأداء المؤسسي والأكاديمي وفقاً للمعايير المحلية والعالمية.'
                      : 'We seek to achieve excellence and leadership in higher education through the application of comprehensive quality standards and academic accreditation, and to improve the level of institutional and academic performance in accordance with local and global standards.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Goals Card */}
            <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    {isArabic ? 'أهدافنا' : 'Our Goals'}
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      { ar: 'نشر ثقافة الجودة بين جميع أعضاء هيئة التدريس والطلاب', en: 'Spreading the culture of quality among all staff and students' },
                      { ar: 'تطبيق معايير الاعتماد الأكاديمي المحلية والعالمية', en: 'Applying local and global academic accreditation standards' },
                      { ar: 'تطوير البرامج الأكاديمية بما يتماشى مع متطلبات سوق العمل', en: 'Developing academic programs in line with labor market requirements' },
                      { ar: 'تحسين مستوى الأداء المؤسسي والأكاديمي', en: 'Improving the level of institutional and academic performance' },
                    ].map((goal, index) => (
                      <li key={index} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5 sm:mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{isArabic ? goal.ar : goal.en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
