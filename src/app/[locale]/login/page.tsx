"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { getTranslations } from "@/i18n/utils";
import type { Locale } from "@/i18n/config";
import { useTheme } from "@/contexts/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const t = getTranslations(locale);
  const isRTL = locale === "ar";
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string>("");

  useEffect(() => {
    if (isBlocked && blockTimer > 0) {
      const timer = setTimeout(() => {
        setBlockTimer(blockTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isBlocked && blockTimer === 0) {
      setIsBlocked(false);
      setLoginAttempts(0);
    }
  }, [isBlocked, blockTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError(t.login.errors.blocked.replace('{seconds}', blockTimer.toString()));
      return;
    }

    if (!email || !email.includes('@')) {
      setError(t.login.errors.invalidEmail);
      return;
    }

    if (!password || password.length < 6) {
      setError(t.login.errors.shortPassword);
      return;
    }

    setIsLoading(true);
    setError("");
    setErrorDetails("");
    
    try {
      setLoginAttempts(0);
      
      const redirectTo = searchParams.get('redirect') || `/${locale}/dashboard`;
      router.push(redirectTo);
    } catch (err: unknown) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsBlocked(true);
        setBlockTimer(300); 
        setError(t.login.errors.maxAttempts);
        return;
      }
      
      let errorMessage = t.login.errors.invalidCredentials;
      
      if (err instanceof Error) {
        const errorWithDetails = err as Error & { technicalDetails?: string };
        if (errorWithDetails.technicalDetails) {
          setErrorDetails(errorWithDetails.technicalDetails);
        }
        
        if (err.message.includes('خطأ في الخادم') || 
            err.message.includes('فشل الاتصال') || 
            err.message.includes('المسار غير موجود') ||
            err.message.includes('بيانات غير صحيحة') ||
            err.message.includes('خطأ في قاعدة البيانات')) {
          errorMessage = err.message;
        } else {
          const msg = err.message.toLowerCase();
          if (msg.includes("network") || msg.includes("fetch")) {
            errorMessage = t.login.errors.networkError;
          } else if (msg.includes("unauthorized") || msg.includes("401")) {
            errorMessage = t.login.errors.unauthorized.replace('{attempt}', newAttempts.toString());
          } else if (msg.includes("not found") || msg.includes("404")) {
            errorMessage = t.login.errors.notFound;
          } else if (msg.includes("timeout")) {
            errorMessage = t.login.errors.timeout;
          } else if (msg.includes("500")) {
            errorMessage = t.login.errors.serverError;
            if (errorWithDetails.technicalDetails) {
              setErrorDetails(err.message);
            }
          } else {
            errorMessage = err.message;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen login-container ${isDarkMode ? 'dark' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* الوضع الغامق */
        .dark .form-section {
          background: #1a1a1a !important;
        }

        .dark .form-card {
          background: #2d2d2d !important;
          box-shadow: 1px 1px 51.9px 0 rgba(45, 138, 246, 0.2) !important;
        }

        .dark .form-header h1 {
          color: #ffffff !important;
        }

        .dark .form-header p {
          color: #b0b0b0 !important;
        }

        .dark label {
          color: #e0e0e0 !important;
        }

        .dark input {
          background: #1a1a1a !important;
          border-color: #404040 !important;
          color: #ffffff !important;
        }

        .dark input::placeholder {
          color: #666 !important;
        }

        .dark input:focus {
          border-color: #2D8AF6 !important;
          box-shadow: 0 0 0 3px rgba(45, 138, 246, 0.2) !important;
        }

        .dark .signup-text {
          color: #b0b0b0 !important;
        }

        /* التوافق مع RTL و LTR */
        [dir="rtl"] .welcome-section {
          text-align: right;
        }

        [dir="ltr"] .welcome-section {
          text-align: left;
        }

        [dir="ltr"] .welcome-section .text-right {
          text-align: left !important;
        }

        [dir="ltr"] .welcome-section .mr-12 {
          margin-right: 0 !important;
          margin-left: 3rem !important;
        }

        /* تصميم الموبايل */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            background: linear-gradient(135deg, #2D8AF6 0%, #5BA4F7 100%);
          }

          .dark .login-container {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          }
          
          .welcome-section {
            display: none !important;
          }
          
          .form-section {
            width: 100% !important;
            padding: 20px !important;
            background: transparent !important;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .form-section::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 200px;
            background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
            z-index: 0;
          }
          
          .form-card {
            width: 100% !important;
            height: auto !important;
            padding: 32px 24px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
            border-radius: 20px !important;
            position: relative;
            z-index: 1;
            margin-top: 60px;
            margin-bottom: 40px;
          }
          
          .form-content {
            width: 100% !important;
          }
          
          .form-header {
            margin-bottom: 20px !important;
            text-align: center !important;
          }
          
          .form-header h1 {
            font-size: 28px !important;
            line-height: 36px !important;
            text-align: center !important;
          }
          
          .form-header p {
            font-size: 16px !important;
            line-height: 24px !important;
            text-align: center !important;
          }
        }

        @media (max-width: 480px) {
          .form-card {
            padding: 24px 16px !important;
            margin-top: 40px;
          }
          
          .form-header h1 {
            font-size: 24px !important;
            line-height: 32px !important;
          }
          
          .form-header p {
            font-size: 14px !important;
            line-height: 20px !important;
          }
          
          button[type="submit"] {
            font-size: 16px !important;
            height: 48px !important;
          }
          
          input {
            font-size: 14px !important;
          }
          
          label {
            font-size: 14px !important;
          }
        }
      `}</style>
            {/* Left Side - Welcome Section */}
      <div className="w-1/2 bg-linear-to-br from-blue-600 via-blue-500 to-blue-300 flex items-center justify-center relative overflow-hidden welcome-section">
        {/* Decorative circles in background */}
        <div className="absolute top-20 right-20 bg-white/5 rounded-full animate-float" style={{ width: '381.023px', height: '381.023px', borderRadius: '14882.232px', animationDelay: '0s' }}></div>
        <div className="absolute bottom-20 left-20 bg-white/5 rounded-full animate-float-slow" style={{ width: '381.023px', height: '381.023px', borderRadius: '14882.232px', animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/4 bg-white/5 rounded-full animate-float" style={{ width: '381.023px', height: '381.023px', borderRadius: '14882.232px', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 bg-white/5 rounded-full animate-float-slow" style={{ width: '381.023px', height: '381.023px', borderRadius: '14882.232px', animationDelay: '3s' }}></div>

        <div className={`relative z-10 text-white px-12 ${isRTL ? 'text-right mr-12' : 'text-left ml-12'}`}>
          <h1 className="text-7xl font-bold mb-6 leading-tight">
            {t.login.welcome}
          </h1>
          <p className="text-2xl w-3/4 leading-relaxed mb-12 text-white/90">
            {t.login.welcomeDesc}
          </p>
        </div>
        
        {/* Decorative dots pattern */}
        <div className="absolute bottom-20 left-17 flex flex-col items-end gap-4">
          <div className="flex gap-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="flex gap-4">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
      </div>
      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50 px-8 form-section">
        {/* Mobile Header - يظهر فقط على الموبايل */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px',
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
        }} className="mobile-header">
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2D8AF6'
          }}>
            
          </div>
          <h2 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Noto Kufi Arabic',
            textAlign: 'center',
            margin: 0,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            {t.login.systemName}
          </h2>
        </div>
        
        <div className="w-full max-w-md">
          {/* Login Form Card */}
          <div 
className="form-card"
style={{
  display: "flex",
  width: "512px",
  height: "632px",
  padding: "48px",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  borderRadius: "24px",
  background: "#FFF",
  boxShadow: "1px 1px 51.9px 0 rgba(45, 138, 246, 0.34)",
  animation: "slideInUp 0.6s ease-out",
}}
          >
            <div 
className="form-header"
style={{
  display: "flex",
  flexDirection: "column",
  justifyContent: "",
    height: "126px",
  gap: "12px",

    alignItems: "flex-start",
    width: "100%",
}}
              >
<h1 
style={{
  color: "var(--Prject-Brand-Dark-Blue, #2E327A)",
  textAlign: isRTL ? "right" : "left",
  fontFamily: "Noto Kufi Arabic",
  fontSize: "36px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "44px",
  letterSpacing: "-0.72px",
}}>{t.login.title}</h1>
<p 
style={{
  color: "var(--Gray-500, #717680)",
  textAlign: isRTL ? "right" : "left",
  fontFamily: "Noto Kufi Arabic",
  fontSize: "20px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "30px"
}}
>{t.login.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="form-content" style={{
              display: "flex",
              width: "416px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
              animation: "fadeIn 0.8s ease-out 0.2s backwards"
            }}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg error-box" style={{
                  animation: "slideInUp 0.3s ease-out",
                  width: "100%"
                }}>
                  <p className="text-sm" style={{ 
                    textAlign: isRTL ? "right" : "left",
                    margin: 0,
                    fontFamily: "Noto Kufi Arabic",
                    marginBottom: errorDetails ? "8px" : "0"
                  }}>{error}</p>
                  {errorDetails && (
                    <details style={{ marginTop: "8px" }}>
                      <summary style={{ 
                        cursor: "pointer", 
                        fontSize: "12px",
                        color: "#991B1B",
                        fontFamily: "Noto Kufi Arabic"
                      }}>
                        {t.login.errors.showDetails}
                      </summary>
                      <pre style={{ 
                        fontSize: "11px", 
                        marginTop: "8px",
                        padding: "8px",
                        background: "#FEE2E2",
                        borderRadius: "4px",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        textAlign: "left",
                        direction: "ltr"
                      }}>
                        {errorDetails}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              {/* Email Field */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: isRTL ? "flex-end" : "flex-start",
                gap: "12px",
                alignSelf: "stretch"
              }}>
                <label htmlFor="email" style={{
                  color: "var(--Gray-800, #383E49)",
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: "Noto Kufi Arabic",
                  fontSize: "16px",
                  fontStyle: "normal",
                  width: "100%",
                  fontWeight: 500,
                  lineHeight: "24px"
                }}>
                  {t.login.email}
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      display: "flex",
                      width: "100%",
                      padding: isRTL ? "8px 12px 8px 8px" : "8px 8px 8px 12px",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "8px",
                      border: "1px solid var(--Gray-300, #D0D3D9)",
                      background: "#FAFAFA",
                      color: "var(--Gray-500, #717680)",
                      fontFamily: "Noto Kufi Arabic",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      textAlign: isRTL ? "right" : "left",
                      outline: "none",
                      boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2D8AF6";
                      e.target.style.boxShadow = "0 0 0 3px rgba(45, 138, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D0D3D9";
                      e.target.style.boxShadow = "0 1px 2px 0 rgba(18, 18, 23, 0.05)";
                    }}
                    placeholder={t.login.emailPlaceholder}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  <div style={{
                    position: "absolute",
                    [isRTL ? "left" : "right"]: "16px",
                    top: "50%",
                    transform: "translateY(-50%)"
                  }}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M23.9375 0.0625V23.9375H0.0625V0.0625H23.9375Z" stroke="#A4A7AE" strokeWidth="0.125"/>
<path d="M3 5.25H21V18C21 18.1989 20.921 18.3897 20.7803 18.5303C20.6397 18.671 20.4489 18.75 20.25 18.75H3.75C3.55109 18.75 3.36032 18.671 3.21967 18.5303C3.07902 18.3897 3 18.1989 3 18V5.25Z" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M21 5.25L12 13.5L3 5.25" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: isRTL ? "flex-end" : "flex-start",
                gap: "12px",
                alignSelf: "stretch"
              }}>
                <label htmlFor="password" style={{
                  color: "var(--Gray-800, #383E49)",
                  textAlign: isRTL ? "right" : "left",
                  fontFamily: "Noto Kufi Arabic",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  width: "100%",
                  lineHeight: "24px"
                }}>
                  {t.login.password}
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      display: "flex",
                      width: "100%",
                      padding: isRTL ? "8px 12px 8px 8px" : "8px 8px 8px 12px",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "8px",
                      border: "1px solid var(--Gray-300, #D0D3D9)",
                      background: "#FAFAFA",
                      color: "var(--Gray-500, #717680)",
                      fontFamily: "Noto Kufi Arabic",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      textAlign: isRTL ? "right" : "left",
                      outline: "none",
                      boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2D8AF6";
                      e.target.style.boxShadow = "0 0 0 3px rgba(45, 138, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D0D3D9";
                      e.target.style.boxShadow = "0 1px 2px 0 rgba(18, 18, 23, 0.05)";
                    }}
                    placeholder={t.login.passwordPlaceholder}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      [isRTL ? "left" : "right"]: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      transition: "opacity 0.2s"
                    }}
                  >
{showPassword ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M23.9375 0.0625V23.9375H0.0625V0.0625H23.9375Z" stroke="#A4A7AE" strokeWidth="0.125"/>
    <path d="M1.5 12C1.5 12 4.5 5.25 12 5.25C19.5 5.25 22.5 12 22.5 12C22.5 12 19.5 18.75 12 18.75C4.5 18.75 1.5 12 1.5 12Z" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M23.9375 0.0625V23.9375H0.0625V0.0625H23.9375Z" stroke="#A4A7AE" strokeWidth="0.125"/>
    <path d="M4.5 3.75L19.5 20.25" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5232 14.775C13.7872 15.4441 12.8156 15.7934 11.822 15.7461C10.8285 15.6988 9.89446 15.2588 9.22537 14.5228C8.55627 13.7868 8.20695 12.8152 8.25425 11.8217C8.30154 10.8281 8.74158 9.89407 9.47755 9.22498" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.7051 8.31653C13.5023 8.4692 14.2285 8.87644 14.7745 9.47708C15.3206 10.0777 15.657 10.8393 15.7332 11.6475" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.5565 15.8531C21.6002 14.0231 22.4993 12 22.4993 12C22.4993 12 19.4993 5.25001 11.9993 5.25001C11.3498 5.24912 10.7014 5.3018 10.0605 5.40751" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.9375 6.43127C3.11531 8.36627 1.5 12 1.5 12C1.5 12 4.5 18.75 12 18.75C13.7574 18.7638 15.4927 18.3589 17.0625 17.5688" stroke="#A4A7AE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)}
                  </button>
                </div>
                <div style={{ alignSelf: "stretch", textAlign: isRTL ? "right" : "left" }}>
                  <Link href={`/${locale}/forgot-password`} style={{
                    color: "var(--Primary-600, #2D8AF6)",
                    fontFamily: "Noto Kufi Arabic",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "24px",
                    textDecoration: "none"
                  }}>
                    {t.login.forgotPassword}
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: "flex",
                  height: "56px",
                  padding: "16px 32px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                  borderRadius: "8px",
                  background: "var(--Primary-600, #2D8AF6)",
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Noto Kufi Arabic",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "24px",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.8 : 1,
                  transition: "all 0.3s ease",
                  transform: isLoading ? "scale(0.98)" : "scale(1)",
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      style={{
                        animation: "spin 1s linear infinite",
                        [isRTL ? "marginLeft" : "marginRight"]: "8px"
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    {t.login.submitting}
                  </>
                ) : (
                  t.login.submit
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "8px",
              marginTop: "24px",
              flexDirection: isRTL ? "row" : "row-reverse"
            }}>
              <Link href={`/${locale}/signup`} style={{
                color: "var(--Primary-600, #2D8AF6)",
                fontFamily: "Noto Kufi Arabic",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "24px",
                textDecoration: "none"
              }}>
                {t.login.signup}
              </Link>
              <p className="signup-text" style={{
                color: "var(--Gray-600, #565D6D)",
                fontFamily: "Noto Kufi Arabic",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
                margin: 0
              }}>
                {t.login.noAccount}
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
