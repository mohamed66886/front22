'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const isArabic = locale === 'ar';

  return (
    <footer className="bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Logo & Description */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                <Image
                  src="/Coat_of_arms_of_Egypt_(Official).svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isArabic ? 'الاتحاد المصري' : 'Egyptian Union'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {isArabic ? 'لطلاب الجامعات' : 'University Students'}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {isArabic 
                ? 'نسعى لتمثيل طلاب الجامعات المصرية وتقديم الدعم والخدمات اللازمة لتحقيق تطلعاتهم الأكاديمية والمهنية.'
                : 'We strive to represent Egyptian university students and provide the necessary support and services to achieve their academic and professional aspirations.'
              }
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-white border-b-2 border-white pb-2 inline-block">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { href: '#hero', labelAr: 'الرئيسية', labelEn: 'Home' },
                { href: '#about', labelAr: 'من نحن', labelEn: 'About Us' },
                { href: '#news', labelAr: 'آخر الأخبار', labelEn: 'Latest News' },
                { href: '#faq', labelAr: 'الأسئلة الشائعة', labelEn: 'FAQ' },
                { href: '#contact', labelAr: 'اتصل بنا', labelEn: 'Contact Us' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <svg 
                      className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    {isArabic ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-white border-b-2 border-white pb-2 inline-block">
              {isArabic ? 'معلومات الاتصال' : 'Contact Info'}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-gray-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">
                  {isArabic ? 'القاهرة، جمهورية مصر العربية' : 'Cairo, Arab Republic of Egypt'}
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-gray-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@egyptianunion.edu.eg" className="hover:text-white transition-colors">
                  info@egyptianunion.edu.eg
                </a>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-gray-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+201234567890" className="hover:text-white transition-colors" dir="ltr">
                  +20 123 456 7890
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-white border-b-2 border-white pb-2 inline-block">
              {isArabic ? 'تابعنا' : 'Follow Us'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-400">
              {isArabic 
                ? 'تابعنا على وسائل التواصل الاجتماعي للبقاء على اطلاع بآخر الأخبار والفعاليات.'
                : 'Follow us on social media to stay updated with the latest news and events.'
              }
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', url: 'https://facebook.com' },
                { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', url: 'https://twitter.com' },
                { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', url: 'https://instagram.com' },
                { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', url: 'https://linkedin.com' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-800 hover:bg-white rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-900 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
              <p className="text-center sm:text-right">
                © {currentYear} {isArabic ? 'الاتحاد المصري لطلاب الجامعات. جميع الحقوق محفوظة.' : 'Egyptian University Students Union. All Rights Reserved.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <svg className="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.7,-78.3C59.9,-70.4,72.6,-59.1,79.8,-45.2C87,-31.3,88.7,-15.7,87.9,-0.3C87.1,15,83.8,30,75.4,42.8C67,55.6,53.5,66.2,38.8,73.4C24.1,80.6,8.2,84.4,-7.3,84.1C-22.8,83.8,-37.9,79.4,-51.6,71.5C-65.3,63.6,-77.6,52.2,-84.4,38.1C-91.2,24,-92.5,7.2,-89.9,-8.4C-87.3,-24,-80.8,-38.4,-70.8,-50.2C-60.8,-62,-47.3,-71.2,-32.9,-78.7C-18.5,-86.2,-3.2,-92,11.4,-90.1C26,-88.2,31.5,-86.2,45.7,-78.3Z" transform="translate(100 100)" />
        </svg>
      </div>
    </footer>
  );
}
