"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar, { SidebarToggleButton } from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // إظهار الزر إذا كان هناك محتوى أسفل (أكثر من 20 بكسل)
      const hasMoreContentBelow = scrollHeight - (scrollTop + clientHeight) > 20;
      setShowScrollButton(hasMoreContentBelow);
    };

    const container = scrollContainerRef.current;
    if (container) {
      // استدعاء handleScroll مرة واحدة عند التحميل
      handleScroll();
      
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, []);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D6E9F8' }}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Mobile Sidebar Toggle */}
      <SidebarToggleButton onClick={() => setSidebarOpen(true)} />

      {/* Main Content */}
      <main 
        className={`transition-all duration-300 h-screen overflow-hidden ${
          sidebarCollapsed ? 'lg:mr-16' : 'lg:mr-64'
        }`}
      >
        <div className="h-full p-3 lg:p-8 lg:pr-0">
          <div 
            ref={scrollContainerRef}
            className="bg-[#FAFAFA] rounded-2xl lg:rounded-3xl p-4 lg:p-8 h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* إخفاء الـ scrollbar في كروم وسفاري */}
            <style>{`
              .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
            <div className="hide-scrollbar  ">
              {children}
            </div>
          </div>
        </div>

        {/* زر التمرير للأسفل العائم */}
        <button
          onClick={scrollToBottom}
          className={`fixed bottom-6 z-50 flex flex-col items-center justify-center gap-1 transition-all duration-500 group cursor-pointer ${
            showScrollButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          } ${
            sidebarCollapsed ? 'lg:left-[calc(50%-2rem)]' : 'lg:left-[calc(50%-8rem)]'
          } left-1/2 -translate-x-1/2 lg:translate-x-0`}
          aria-label="التمرير للأسفل"
        >
          <style>{`
            @keyframes bounceArrow {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(6px);
              }
            }
            .animate-bounce-arrow {
              animation: bounceArrow 1.5s ease-in-out infinite;
            }
          `}</style>
          
          <span 
            className="text-[10px] font-medium mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              color: '#4A7DD9',
              fontFamily: '"Noto Kufi Arabic"',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            المزيد بالأسفل
          </span>
          

          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#4A7DD9" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="drop-shadow-md animate-bounce-arrow"
            style={{ animationDelay: '0s' }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
          
          {/* السهم الثاني */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#4A7DD9" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="drop-shadow-md animate-bounce-arrow -mt-2 opacity-70"
            style={{ animationDelay: '0.15s' }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </main>
    </div>
  );
}
