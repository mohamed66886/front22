"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { Locale } from "@/i18n/config";

export default function ControlButtons() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as Locale) || "ar";
  const isRTL = locale === "ar";

  const currentPath = pathname?.replace(`/${locale}`, "") || "/";

  const getDelay = (index: number) => {
    return index * 0.07; // تأخير تدريجي
  };

  return (
    <>
      <style jsx>{`
        .fab-container {
          position: fixed;
          bottom: 26px;
          ${isRTL ? "left" : "right"}: 26px;
          z-index: 999999;
        }

        .fab-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${isDarkMode ? "#333" : "#fff"};
          border: 2px solid ${isDarkMode ? "#555" : "#ddd"};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 6px 20px ${isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)"};
        }

        .fab-btn:hover {
          transform: scale(1.08) rotate(${open ? "90deg" : "0deg"});
          box-shadow: 0 8px 25px ${isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)"};
        }

        .fab-menu {
          position: absolute;
          bottom: 70px;
          ${isRTL ? "left" : "right"}: 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
          pointer-events: ${open ? "auto" : "none"};
        }

        .menu-btn {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: ${isDarkMode ? "#444" : "#fff"};
          border: 2px solid ${isDarkMode ? "#666" : "#ccc"};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          color: ${isDarkMode ? "#fff" : "#2D8AF6"};
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform-origin: center;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
        }

        /* أنيميشن عند الفتح */
        .open .menu-btn:nth-child(1) {
          animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s forwards;
        }

        .open .menu-btn:nth-child(2) {
          animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards;
        }

        /* أنيميشن عند الإغلاق */
        .closing .menu-btn:nth-child(1) {
          animation: slideDown 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) 0.1s forwards;
        }

        .closing .menu-btn:nth-child(2) {
          animation: slideDown 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) 0s forwards;
        }

        .menu-btn:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 8px 20px ${isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.25)"};
          color: ${isDarkMode ? "#2D8AF6" : "#1a73e8"};
          border-color: ${isDarkMode ? "#2D8AF6" : "#1a73e8"};
        }

        /* أنيميشن زر الإعدادات الرئيسي */
        @keyframes rotateIn {
          from {
            transform: rotate(-180deg) scale(0);
            opacity: 0;
          }
          to {
            transform: rotate(0) scale(1);
            opacity: 1;
          }
        }

        /* أنيميشن الأزرار الفرعية */
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8) rotate(-10deg);
          }
          70% {
            transform: translateY(-5px) scale(1.05) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0);
          }
        }

        @keyframes slideDown {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(20px) scale(0.8) rotate(10deg);
          }
        }

        /* أنيميشن النبض */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 ${isDarkMode ? "rgba(45, 138, 246, 0.4)" : "rgba(45, 138, 246, 0.4)"};
          }
          70% {
            box-shadow: 0 0 0 10px rgba(45, 138, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(45, 138, 246, 0);
          }
        }

        .fab-btn {
          animation: ${mounted ? "rotateIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none"};
        }

        /* تأثير النبض للزر الرئيسي عند التحميل */
        .fab-btn.pulse {
          animation: pulse 2s infinite;
        }

        /* تحسين الأيقونات */
        .icon {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .rotate-icon {
          transform: rotate(180deg);
        }

        @media (max-width: 768px) {
          .fab-container {
            bottom: 20px;
            ${isRTL ? "left" : "right"}: 20px;
          }

          .fab-btn {
            width: 56px;
            height: 56px;
          }

          .menu-btn {
            width: 50px;
            height: 50px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .fab-container {
            bottom: 16px;
            ${isRTL ? "left" : "right"}: 16px;
          }
          
          .fab-btn {
            width: 52px;
            height: 52px;
          }
        }
      `}</style>

      <div className="fab-container">
        {/* القائمة المنبثقة */}
        <div className={`fab-menu ${open ? "open" : "closing"}`}>
          {/* لغة */}
          <Link
            href={`/${locale === "ar" ? "en" : "ar"}${currentPath}`}
            className="menu-btn"
            onClick={() => setOpen(false)}
          >
            {locale === "ar" ? "EN" : "ع"}
          </Link>

          {/* وضع */}
          <button 
            className="menu-btn" 
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* زر الإعدادات الرئيسي */}
        <button 
          className={`fab-btn ${mounted ? 'pulse' : ''}`}
          onClick={() => {
            setOpen(!open);
            // إزالة تأثير النبض بعد النقر الأول
            if (mounted) {
              const fabBtn = document.querySelector('.fab-btn');
              fabBtn?.classList.remove('pulse');
            }
          }}
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        >
          <div className={`icon ${open ? 'rotate-icon' : ''}`}>
            {open ? (
              <svg width="28" height="28" viewBox="0 0 24 24" stroke="#2D8AF6" strokeWidth="2">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <svg width="30" height="30" viewBox="0 0 24 24" stroke="#2D8AF6" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 
                         2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 
                         0 0-1.82-.33 1.65 1.65 0 0 0-1 
                         1.51V22a2 2 0 0 1-4 0v-.09a1.65 
                         1.65 0 0 0-1-1.51 1.65 1.65 0 0 
                         0-1.82.33l-.06.06a2 2 0 1 
                         1-2.83-2.83l.06-.06a1.65 1.65 
                         0 0 0 .33-1.82 1.65 1.65 0 
                         0 0-1.51-1H2a2 2 0 0 
                         1 0-4h.09a1.65 1.65 0 0 
                         0 1.51-1 1.65 1.65 0 0 
                         0-.33-1.82l-.06-.06a2 
                         2 0 1 1 2.83-2.83l.06.06a1.65 
                         1.65 0 0 0 1.82.33A1.65 1.65 
                         0 0 0 10 3.09V3a2 2 
                         0 0 1 4 0v.09a1.65 1.65 
                         0 0 0 1 1.51h0a1.65 1.65 
                         0 0 0 1.82-.33l.06-.06a2 
                         2 0 1 1 2.83 2.83l-.06.06a1.65 
                         1.65 0 0 0-.33 1.82v0A1.65 1.65 
                         0 0 0 21 10h.09a2 2 
                         0 0 1 0 4H21a1.65 
                         1.65 0 0 0-1.6 1z" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </>
  );
}