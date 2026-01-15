'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Locale } from '@/i18n/config';
import { Translations } from '@/types/translations';
import SearchableSelect from './SearchableSelect';

// Dynamic import to avoid SSR issues with Leaflet
const UniversityMap = dynamic(() => import('./UniversityMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full min-h-150 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400">جاري تحميل الخريطة...</span>
    </div>
  ),
});

interface ContactUsProps {
  translations?: Translations;
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

export default function ContactUs({ locale }: ContactUsProps) {
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const isRTL = locale === 'ar';
  
  // Separate animations for different sections
  const [titleRef, isTitleVisible] = useScrollAnimation(0.3);
  const [formRef, isFormVisible] = useScrollAnimation(0.2);
  const [mapRef, isMapVisible] = useScrollAnimation(0.2);

  // قائمة الجامعات المصرية
  const egyptianUniversities = [
    { value: 'cairo', label: 'جامعة القاهرة - Cairo University' },
    { value: 'alexandria', label: 'جامعة الإسكندرية - Alexandria University' },
    { value: 'ain-shams', label: 'جامعة عين شمس - Ain Shams University' },
    { value: 'assiut', label: 'جامعة أسيوط - Assiut University' },
    { value: 'tanta', label: 'جامعة طنطا - Tanta University' },
    { value: 'mansoura', label: 'جامعة المنصورة - Mansoura University' },
    { value: 'zagazig', label: 'جامعة الزقازيق - Zagazig University' },
    { value: 'helwan', label: 'جامعة حلوان - Helwan University' },
    { value: 'minia', label: 'جامعة المنيا - Minia University' },
    { value: 'menoufia', label: 'جامعة المنوفية - Menoufia University' },
    { value: 'suez-canal', label: 'جامعة قناة السويس - Suez Canal University' },
    { value: 'south-valley', label: 'جامعة جنوب الوادي - South Valley University' },
    { value: 'benha', label: 'جامعة بنها - Benha University' },
    { value: 'fayoum', label: 'جامعة الفيوم - Fayoum University' },
    { value: 'beni-suef', label: 'جامعة بني سويف - Beni-Suef University' },
    { value: 'kafr-el-sheikh', label: 'جامعة كفر الشيخ - Kafr El Sheikh University' },
    { value: 'sohag', label: 'جامعة سوهاج - Sohag University' },
    { value: 'port-said', label: 'جامعة بورسعيد - Port Said University' },
    { value: 'damanhour', label: 'جامعة دمنهور - Damanhour University' },
    { value: 'damietta', label: 'جامعة دمياط - Damietta University' },
    { value: 'aswan', label: 'جامعة أسوان - Aswan University' },
    { value: 'luxor', label: 'جامعة الأقصر - Luxor University' },
    { value: 'new-valley', label: 'جامعة الوادي الجديد - New Valley University' },
    { value: 'matrouh', label: 'جامعة مطروح - Matrouh University' },
    { value: 'auc', label: 'الجامعة الأمريكية بالقاهرة - AUC' },
    { value: 'guc', label: 'الجامعة الألمانية بالقاهرة - GUC' },
    { value: 'bue', label: 'الجامعة البريطانية في مصر - BUE' },
    { value: 'nile', label: 'جامعة النيل - Nile University' },
    { value: 'must', label: 'جامعة مصر للعلوم والتكنولوجيا - MUST' },
    { value: '6-october', label: 'جامعة 6 أكتوبر - 6th October University' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    
    // إعادة تعيين النموذج بعد 3 ثواني
    setTimeout(() => {
      setFormData({ name: '', university: '', email: '', message: '' });
      setSubmitStatus(null);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-8 md:py-12 lg:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
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
              {isRTL ? 'تواصل ' : 'Contact '}
            </span>
            <span className="text-sky-500 inline-block hover:animate-pulse">{isRTL ? 'معنا' : 'Us'}</span>
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

        {/* Main Container - كل شيء في div واحد */}
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
                        {/* Form Section - على اليسار في العربي */}
            <div 
              ref={formRef as React.RefObject<HTMLDivElement>}
              className={`${locale === 'ar' ? 'lg:order-1' : 'lg:order-2'} order-1 transition-all duration-700 ${
                isFormVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${locale === 'ar' ? 'translate-x-10' : '-translate-x-10'}`
              }`}
            >
              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Name and University in one row */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-5">
                    {/* Name Input */}
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                        {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                        <span className="text-red-500 mr-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                          display: "flex",
                          width: "100%",
                          padding: "10px 12px",
                          alignItems: "center",
                          gap: "8px",
                          borderRadius: "8px",
                          border: "1px solid var(--Gray-300, #D0D3D9)",
                          background: "#FAFAFA",
                          color: "var(--Gray-500, #717680)",
                          fontFamily: "Noto Kufi Arabic",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "22px",
                          textAlign: "right",
                          outline: "none",
                          boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                          transition: "all 0.3s ease"
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#2D8AF6";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45, 138, 246, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#D0D3D9";
                          e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(18, 18, 23, 0.05)";
                        }}
                        placeholder={locale === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      />
                    </div>

                    {/* University Dropdown */}
                    <div className="transform transition-all duration-300 hover:scale-[1.02]">
                      <SearchableSelect
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={(value) => setFormData({ ...formData, university: value })}
                        options={egyptianUniversities}
                        label={locale === 'ar' ? 'الجامعة' : 'University'}
                        placeholder={locale === 'ar' ? 'اختر الجامعة' : 'Select University'}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        display: "flex",
                        width: "100%",
                        padding: "10px 12px",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "8px",
                        border: "1px solid var(--Gray-300, #D0D3D9)",
                        background: "#FAFAFA",
                        color: "var(--Gray-500, #717680)",
                        fontFamily: "Noto Kufi Arabic",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "22px",
                        textAlign: "right",
                        outline: "none",
                        boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                        transition: "all 0.3s ease"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2D8AF6";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45, 138, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D0D3D9";
                        e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(18, 18, 23, 0.05)";
                      }}
                      placeholder={locale === 'ar' ? 'example@university.edu.eg' : 'example@university.edu.eg'}
                    />
                  </div>

                  {/* Message Textarea */}
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                      {locale === 'ar' ? 'الرسالة' : 'Message'}
                      <span className="text-red-500 mr-1">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      style={{
                        display: "flex",
                        width: "100%",
                        padding: "10px 12px",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "8px",
                        border: "1px solid var(--Gray-300, #D0D3D9)",
                        background: "#FAFAFA",
                        color: "var(--Gray-500, #717680)",
                        fontFamily: "Noto Kufi Arabic",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "22px",
                        textAlign: "right",
                        outline: "none",
                        boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                        transition: "all 0.3s ease",
                        resize: "none"
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2D8AF6";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45, 138, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D0D3D9";
                        e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(18, 18, 23, 0.05)";
                      }}
                      placeholder={locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                      </>
                    )}
                  </button>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex items-center gap-2 animate-fade-in">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium">
                        {locale === 'ar' ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Your message has been sent successfully! We will contact you soon.'}
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>
            {/* Map Section - على اليمين في العربي */}
            <div 
              ref={mapRef as React.RefObject<HTMLDivElement>}
              className={`${locale === 'ar' ? 'lg:order-2' : 'lg:order-1'} order-2 transition-all duration-700 ${
                isMapVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${locale === 'ar' ? '-translate-x-10' : 'translate-x-10'}`
              }`}
            >
              <div className="h-64 sm:h-96 lg:h-full min-h-100">
                <UniversityMap locale={locale} />
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
