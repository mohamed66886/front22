"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar, { SidebarToggleButton } from "@/components/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // مغلق افتراضيًا
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // افتح القائمة تلقائيًا على الشاشات الكبيرة
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }

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


      </main>
    </div>
  );
}
