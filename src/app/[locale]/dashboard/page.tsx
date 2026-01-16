"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authApi } from "@/services/authService";
import { dashboardApi } from "@/services/dashboardService";
import DashboardLayout from "@/components/DashboardLayout";
import type { DashboardStats, Notification } from "@/types/dashboard";

const cache = {
  dashboardData: null as DashboardStats | null,
  notifications: [] as Notification[],
  qualityData: [] as number[],
  lastFetchTime: 0,
  CACHE_DURATION: 5 * 60 * 1000 
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("المسؤول");
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(cache.dashboardData);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>(cache.notifications);
  const [qualityData, setQualityData] = useState<number[]>(cache.qualityData);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // تحديث التاريخ الحالي
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const arabicDate = now.toLocaleDateString('ar-EG', options);
      setCurrentDate(arabicDate);
    };
    
    updateDate();
    
    const checkAuth = async () => {

      const user = authApi.getCurrentUser?.();
      if (user && user.name) {
        setUserName(user.name);
      }

      const now = Date.now();
      const isCacheValid = cache.dashboardData && (now - cache.lastFetchTime < cache.CACHE_DURATION);

      if (isCacheValid) {
        setDashboardData(cache.dashboardData);
        setRecentNotifications(cache.notifications);
        setQualityData(cache.qualityData);
        return;
      }

      setIsLoading(true);
      try {
        const data = await dashboardApi.getUserDashboard();
        cache.dashboardData = data;
        cache.lastFetchTime = now;
        setDashboardData(data);
        if (data.RecentNotifications) {
          cache.notifications = data.RecentNotifications;
          setRecentNotifications(data.RecentNotifications);
        }
        const completedPercentage = data.CompletedTasks && data.MyTasks 
          ? (data.CompletedTasks / data.MyTasks) * 100 
          : 0;
        const generateQualityMetrics = (basePercentage: number) => {
          const metrics = [];
          for (let i = 0; i < 6; i++) {
            const variation = (Math.random() - 0.5) * 30;
            const value = Math.max(0, Math.min(100, basePercentage + variation));
            metrics.push(value);
          }
          return metrics;
        };
        const quality = generateQualityMetrics(completedPercentage);
        cache.qualityData = quality;
        setQualityData(quality);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setQualityData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div className="flex flex-col justify-center items-end gap-0.5 text-right order-1 lg:order-1">
          <h1
            className="mb-1 text-lg lg:text-[22px] leading-7 lg:leading-8"
            style={{
              color: "var(--Prject-Brand-Dark-Blue, #2E327A)",
              fontFamily: '"Noto Kufi Arabic"',
              fontStyle: "normal",
              fontWeight: 600,
              width: "100%",
              display: "inline-block",
              direction: "rtl",
              textAlign: "right",
            }}
          >
            لوحة التحكم
          </h1>
          <p
            className="text-gray-600 text-xs lg:text-sm leading-5 lg:leading-6"
            style={{
              color: "var(--Gray-500, #717680)",
              fontFamily: '"Noto Kufi Arabic"',
              fontStyle: "normal",
              fontWeight: 400,
              direction: "rtl",
              textAlign: "right",
            }}
          >
            نظرة عامة على أداء نظام الجودة
          </p>
        </div>

        <div
          className="flex-1 order-3 lg:order-2 lg:mx-8"
          style={{
            display: "flex",
            maxWidth: "100%",
            height: "42px",
            padding: "12px 16px",
            justifyContent: "flex-end",
            alignItems: "center",
            borderRadius: "12px",
            border: "0.5px solid var(--Gray-200, #E9EAEB)",
            background: "var(--White, #FFF)",
            boxShadow:
              "0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 0 0 0 rgba(0, 0, 0, 0.00), 0 0 0 0 rgba(0, 0, 0, 0.00)",
          }}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ابحث هنا..."
              className="w-full pr-10 text-gray-700 bg-transparent border-0 focus:outline-none text-right text-sm"
              style={{
            background: "transparent",
            fontFamily: '"Noto Kufi Arabic"',
              }}
            />
            <svg
              className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 lg:gap-4 order-2 lg:order-3">
        <div
            className="flex text-gray-600 text-xs lg:text-sm lg:p-2"
            style={{
                display: "flex",
                padding: "6px 4px",
                alignItems: "flex-start",
                gap: "4px",
                borderRadius: "12px",
                border: "0 solid var(--Gray-200, #E9EAEB)",
                background: "#FFF",
                boxShadow:
                    "0 1px 4px 0 rgba(0, 0, 0, 0.08), 0 0 0 0 rgba(0, 0, 0, 0.00), 0 0 0 0 rgba(0, 0, 0, 0.00)",
            }}
        >
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 lg:w-6 lg:h-6">
<path d="M19.5 3H17.25V2.25C17.25 2.05109 17.171 1.86032 17.0303 1.71967C16.8897 1.57902 16.6989 1.5 16.5 1.5C16.3011 1.5 16.1103 1.57902 15.9697 1.71967C15.829 1.86032 15.75 2.05109 15.75 2.25V3H8.25V2.25C8.25 2.05109 8.17098 1.86032 8.03033 1.71967C7.88968 1.57902 7.69891 1.5 7.5 1.5C7.30109 1.5 7.11032 1.57902 6.96967 1.71967C6.82902 1.86032 6.75 2.05109 6.75 2.25V3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM6.75 4.5V5.25C6.75 5.44891 6.82902 5.63968 6.96967 5.78033C7.11032 5.92098 7.30109 6 7.5 6C7.69891 6 7.88968 5.92098 8.03033 5.78033C8.17098 5.63968 8.25 5.44891 8.25 5.25V4.5H15.75V5.25C15.75 5.44891 15.829 5.63968 15.9697 5.78033C16.1103 5.92098 16.3011 6 16.5 6C16.6989 6 16.8897 5.92098 17.0303 5.78033C17.171 5.63968 17.25 5.44891 17.25 5.25V4.5H19.5V7.5H4.5V4.5H6.75ZM19.5 19.5H4.5V9H19.5V19.5ZM13.125 12.375C13.125 12.5975 13.059 12.815 12.9354 13C12.8118 13.185 12.6361 13.3292 12.4305 13.4144C12.225 13.4995 11.9988 13.5218 11.7805 13.4784C11.5623 13.435 11.3618 13.3278 11.2045 13.1705C11.0472 13.0132 10.94 12.8127 10.8966 12.5945C10.8532 12.3762 10.8755 12.15 10.9606 11.9445C11.0458 11.7389 11.19 11.5632 11.375 11.4396C11.56 11.316 11.7775 11.25 12 11.25C12.2984 11.25 12.5845 11.3685 12.7955 11.5795C13.0065 11.7905 13.125 12.0766 13.125 12.375ZM17.25 12.375C17.25 12.5975 17.184 12.815 17.0604 13C16.9368 13.185 16.7611 13.3292 16.5555 13.4144C16.35 13.4995 16.1238 13.5218 15.9055 13.4784C15.6873 13.435 15.4868 13.3278 15.3295 13.1705C15.1722 13.0132 15.065 12.8127 15.0216 12.5945C14.9782 12.3762 15.0005 12.15 15.0856 11.9445C15.1708 11.7389 15.315 11.5632 15.5 11.4396C15.685 11.316 15.9025 11.25 16.125 11.25C16.4234 11.25 16.7095 11.3685 16.9205 11.5795C17.1315 11.7905 17.25 12.0766 17.25 12.375ZM9 16.125C9 16.3475 8.93402 16.565 8.8104 16.75C8.68679 16.935 8.51109 17.0792 8.30552 17.1644C8.09995 17.2495 7.87375 17.2718 7.65552 17.2284C7.43729 17.185 7.23684 17.0778 7.0795 16.9205C6.92217 16.7632 6.81502 16.5627 6.77162 16.3445C6.72821 16.1262 6.75049 15.9 6.83564 15.6945C6.92078 15.4889 7.06498 15.3132 7.24998 15.1896C7.43499 15.066 7.6525 15 7.875 15C8.17337 15 8.45952 15.1185 8.6705 15.3295C8.88147 15.5405 9 15.8266 9 16.125ZM13.125 16.125C13.125 16.3475 13.059 16.565 12.9354 16.75C12.8118 16.935 12.6361 17.0792 12.4305 17.1644C12.225 17.2495 11.9988 17.2718 11.7805 17.2284C11.5623 17.185 11.3618 17.0778 11.2045 16.9205C11.0472 16.7632 10.94 16.5627 10.8966 16.3445C10.8532 16.1262 10.8755 15.9 10.9606 15.6945C11.0458 15.4889 11.19 15.3132 11.375 15.1896C11.56 15.066 11.7775 15 12 15C12.2984 15 12.5845 15.1185 12.7955 15.3295C13.0065 15.5405 13.125 15.8266 13.125 16.125ZM17.25 16.125C17.25 16.3475 17.184 16.565 17.0604 16.75C16.9368 16.935 16.7611 17.0792 16.5555 17.1644C16.35 17.2495 16.1238 17.2718 15.9055 17.2284C15.6873 17.185 15.4868 17.0778 15.3295 16.9205C15.1722 16.7632 15.065 16.5627 15.0216 16.3445C14.9782 16.1262 15.0005 15.9 15.0856 15.6945C15.1708 15.4889 15.315 15.3132 15.5 15.1896C15.685 15.066 15.9025 15 16.125 15C16.4234 15 16.7095 15.1185 16.9205 15.3295C17.1315 15.5405 17.25 15.8266 17.25 16.125Z" fill="#2F6FE8"/>
</svg>
            <span className="hidden sm:inline">{currentDate || 'جاري التحميل...'}</span>
       </div>
          <button
            className="relative flex items-center gap-2.5 p-1.5 lg:p-1.75 rounded-xl border border-solid"
            style={{
              borderColor: "#E2E8F0",
              background: "#FFF",
              boxShadow:
                "0 1px 4px 0 rgba(0, 0, 0, 0.08), 0 0 0 0 rgba(0, 0, 0, 0.00), 0 0 0 0 rgba(0, 0, 0, 0.00)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 18 20" fill="none" className="w-4 h-4.5 lg:w-4.5 lg:h-5">
              <path d="M12.748 18.75C12.748 18.9489 12.669 19.1397 12.5283 19.2803C12.3877 19.421 12.1969 19.5 11.998 19.5H5.99798C5.79906 19.5 5.6083 19.421 5.46765 19.2803C5.32699 19.1397 5.24798 18.9489 5.24798 18.75C5.24798 18.5511 5.32699 18.3603 5.46765 18.2197C5.6083 18.079 5.79906 18 5.99798 18H11.998C12.1969 18 12.3877 18.079 12.5283 18.2197C12.669 18.3603 12.748 18.5511 12.748 18.75ZM17.7964 15.75C17.6663 15.9792 17.4774 16.1696 17.2491 16.3014C17.0209 16.4333 16.7616 16.5018 16.498 16.5H1.49798C1.23429 16.4996 0.97536 16.4298 0.747279 16.2975C0.519198 16.1651 0.330028 15.975 0.198835 15.7463C0.0676423 15.5176 -0.000936882 15.2583 9.66719e-06 14.9946C0.000956216 14.7309 0.0713951 14.4722 0.204227 14.2444C0.724539 13.3481 1.49798 10.8131 1.49798 7.5C1.49798 5.51088 2.28815 3.60322 3.69468 2.1967C5.1012 0.790176 7.00885 0 8.99798 0C10.9871 0 12.8948 0.790176 14.3013 2.1967C15.7078 3.60322 16.498 5.51088 16.498 7.5C16.498 10.8122 17.2724 13.3481 17.7927 14.2444C17.9268 14.4725 17.9978 14.7322 17.9983 14.9968C17.9988 15.2614 17.9288 15.5214 17.7955 15.75H17.7964ZM16.498 15C15.7733 13.7559 14.998 10.8797 14.998 7.5C14.998 5.9087 14.3658 4.38258 13.2406 3.25736C12.1154 2.13214 10.5893 1.5 8.99798 1.5C7.40668 1.5 5.88055 2.13214 4.75534 3.25736C3.63012 4.38258 2.99798 5.9087 2.99798 7.5C2.99798 10.8806 2.22173 13.7569 1.49798 15H16.498Z" fill="#717680"/>
            </svg>
            <span
              className="w-1.5 h-1.5 lg:w-2 lg:h-2 absolute left-1.25 top-0.75 lg:left-1.75 lg:top-1.25 rounded-full border-0"
              style={{
                border: "0 solid #FFF",
                background: "#EF4444"
              }}
            ></span>
          </button>
        </div>
      </div>
      
      {/* Welcome Banner */}
      <div 
        className="mb-6 lg:mb-8 rounded-2xl lg:rounded-3xl p-4 lg:p-8 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden min-h-40 lg:min-h-50"
        style={{
          background: 'linear-gradient(135deg, #4A7DD9 0%, #6A94E3 100%)'
        }}
      >
        {/* Background Wave SVG */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="1125" 
          height="168" 
          viewBox="0 0 1125 168" 
          fill="none"
          className="absolute bottom-0 left-0 right-0 w-full h-auto opacity-10 lg:opacity-14"
        >
          <path 
            d="M1.27441 167.5C240.854 -55.0928 599.972 -55.2362 1198.02 167.5H1.27441Z" 
            fill="#F5F5F5" 
            stroke="#FFF"
            strokeWidth="1"
          />
        </svg>

        <div className="flex-1 text-white text-center lg:text-right relative z-10 mb-4 lg:mb-0">
          <h2 
            className="text-2xl lg:text-[32px] font-bold mb-3 lg:mb-4 leading-9 lg:leading-12"
            style={{
              fontFamily: '"Noto Kufi Arabic"',
              fontWeight: 700
            }}
          >
            مرحباً، {userName}
          </h2>
          <p 
            className="text-sm lg:text-[18px] mb-2 leading-6 lg:leading-7"
            style={{
              fontFamily: '"Noto Kufi Arabic"',
              fontWeight: 400
            }}
          >
            لديك {dashboardData?.UnreadNotifications || 0} إشعار جديد و {dashboardData?.PendingTasks || 0} مهام معلقة تتطلب انتباهك اليوم.
          </p>
          <p 
            className="text-xs lg:text-base mb-4 lg:mb-0 leading-5 lg:leading-6"
            style={{
              fontFamily: '"Noto Kufi Arabic"',
              fontWeight: 400
            }}
          >
            دعنا نبدأ العمل!
          </p>
          <button
            className="mt-4 lg:mt-6 px-4 lg:px-6 py-2 lg:py-3 bg-white text-blue-600 rounded-lg lg:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm lg:text-base"
            style={{
              fontFamily: '"Noto Kufi Arabic"',
              fontWeight: 600
            }}
          >
            مراجعة المهام
          </button>
        </div>
        
        <div className="shrink-0 lg:mr-8 relative z-10 hidden md:block">
          <Image
            src="/Standardized test as method of assessment.png"
            alt="لوحة تحكم - رسم توضيحي"
            width={200}
            height={140}
            className="lg:w-70 lg:h-50"
          />
        </div>
      </div>

      {/* Recent Notifications and Quality Indicators Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Recent Notifications Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl lg:rounded-3xl">
          <div className="flex items-center justify-between px-4 lg:px-6 py-2 lg:py-3">
            <h3
              className="text-sm lg:text-base"
              style={{
                color: '#2E327A',
                fontFamily: '"Noto Kufi Arabic"',
                fontWeight: 600,
                lineHeight: '28px'
              }}
            >
              الإشعارات الحديثة
            </h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-xs lg:text-sm"
              style={{
                fontFamily: '"Noto Kufi Arabic"',
                fontWeight: 500
              }}
            >
              عرض الكل
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" style={{ direction: 'rtl' }}>
              <thead style={{ background: '#E7EDF3'}} className="hidden md:table-header-group">
                <tr style={{ borderBottom: '1px solid #E9EAEB' }}>
                  <th
                    className="p-2 lg:p-3 text-right text-xs lg:text-sm"
                    style={{
                      color: '#717BBC',
                      fontFamily: '"Noto Kufi Arabic"',
                      fontWeight: 500
                    }}
                  >
                    اسم المستخدم
                  </th>
                  <th
                    className="p-2 lg:p-3 text-right text-xs lg:text-sm"
                    style={{
                      color: '#717BBC',
                      fontFamily: '"Noto Kufi Arabic"',
                      fontWeight: 500
                    }}
                  >
                    المؤهل
                  </th>
                  <th
                    className="p-2 lg:p-3 text-right text-xs lg:text-sm"
                    style={{
                      color: '#717BBC',
                      fontFamily: '"Noto Kufi Arabic"',
                      fontWeight: 500
                    }}
                  >
                    نوع الإشعار
                  </th>
                  <th
                    className="p-2 lg:p-3 text-right text-xs lg:text-sm"
                    style={{
                      color: '#717BBC',
                      fontFamily: '"Noto Kufi Arabic"',
                      fontWeight: 500
                    }}
                  >
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification, index) => {
                    // تحديد اللون والأيقونة حسب نوع الإشعار
                    const getNotificationStyle = (type: string) => {
                      switch (type.toLowerCase()) {
                        case 'urgent':
                        case 'عاجل':
                          return {
                            bgColor: '#FEF3F2',
                            iconColor: '#EF4444',
                            textColor: '#EF4444',
                            label: 'تنبيه عاجل'
                          };
                        case 'meeting':
                        case 'اجتماع':
                          return {
                            bgColor: '#F0FDF4',
                            iconColor: '#22C55E',
                            textColor: '#22C55E',
                            label: 'موعد اجتماع'
                          };
                        case 'report':
                        case 'تقرير':
                          return {
                            bgColor: '#FFF4ED',
                            iconColor: '#F97316',
                            textColor: '#F97316',
                            label: 'تسليم تقرير'
                          };
                        default:
                          return {
                            bgColor: '#EEF4FF',
                            iconColor: '#2F6FE8',
                            textColor: '#2F6FE8',
                            label: notification.type || 'إشعار'
                          };
                      }
                    };

                    const style = getNotificationStyle(notification.type);
                    const isLastRow = index === recentNotifications.length - 1;

                    return (
                      <tr key={notification.notification_id} className="block md:table-row mb-3 md:mb-0 border-b md:border-b-0" style={{ borderBottom: isLastRow ? 'none' : '1px solid #F5F5F5' }}>
                        <td className="py-3 px-3 lg:py-4 lg:pr-4 block md:table-cell md:border-b-0">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div 
                              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: style.bgColor }}
                            >
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="lg:w-4 lg:h-4">
                                <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill={style.iconColor}/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <span
                                className="block text-xs lg:text-sm"
                                style={{
                                  color: '#2E327A',
                                  fontFamily: '"Noto Kufi Arabic"',
                                  fontWeight: 500
                                }}
                              >
                                {notification.User?.name || notification.title}
                              </span>
                              <span
                                className="block md:hidden text-xs mt-1"
                                style={{
                                  color: '#717680',
                                  fontFamily: '"Noto Kufi Arabic"',
                                  fontWeight: 400
                                }}
                              >
                                {notification.User?.role || '-'}
                              </span>
                            </div>
                            <span
                              className="block md:hidden px-2 py-1 rounded-lg text-xs whitespace-nowrap"
                              style={{
                                color: style.textColor,
                                background: style.bgColor,
                                fontFamily: '"Noto Kufi Arabic"',
                                fontWeight: 500
                              }}
                            >
                              {style.label}
                            </span>
                          </div>
                        </td>
                        <td
                          className="hidden md:table-cell py-3 px-3 lg:py-4 lg:pr-4 text-xs lg:text-sm"
                          style={{
                            color: '#717680',
                            fontFamily: '"Noto Kufi Arabic"',
                            fontWeight: 400
                          }}
                        >
                          {notification.User?.role || '-'}
                        </td>
                        <td className="hidden md:table-cell py-3 px-3 lg:py-4 lg:pr-4">
                          <span
                            className="px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm"
                            style={{
                              color: style.textColor,
                              background: style.bgColor,
                              fontFamily: '"Noto Kufi Arabic"',
                              fontSize: '14px',
                              fontWeight: 500
                            }}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                              <circle cx="2" cy="2" r="2" fill="currentColor"/>
                              <circle cx="2" cy="8" r="2" fill="currentColor"/>
                              <circle cx="2" cy="14" r="2" fill="currentColor"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  // عرض رسالة عند عدم وجود إشعارات
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="24" fill="#F3F4F6"/>
                          <path d="M24 16V26M24 30H24.01M38 24C38 31.732 31.732 38 24 38C16.268 38 10 31.732 10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p
                          style={{
                            color: '#9CA3AF',
                            fontFamily: '"Noto Kufi Arabic"',
                            fontSize: '14px',
                            fontWeight: 400
                          }}
                        >
                          لا توجد إشعارات حالياً
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Indicators Chart */}
        <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3
              className="text-sm lg:text-base"
              style={{
                color: '#2E327A',
                fontFamily: '"Noto Kufi Arabic"',
                fontWeight: 600,
                lineHeight: '28px'
              }}
            >
              مؤشرات الجودة
            </h3>
            <button
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg border border-gray-200 text-xs lg:text-sm"
              style={{
                fontFamily: '"Noto Kufi Arabic"',
                fontWeight: 400,
                color: '#717680'
              }}
            >
              <span className="hidden sm:inline">آخر 6 أشهر</span>
              <span className="sm:hidden">6 أشهر</span>
              <svg width="10" height="6" viewBox="0 0 12 8" fill="none" className="lg:w-3 lg:h-2">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>



          {/* Chart Area */}
          <div className="relative h-56 lg:h-70">
            <svg width="100%" height="100%" viewBox="0 0 300 280" preserveAspectRatio="none">
              {/* Y-axis labels */}
              <text x="290" y="20" textAnchor="end" className="text-[10px] lg:text-xs" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>100</text>
              <text x="290" y="90" textAnchor="end" className="text-[10px] lg:text-xs" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>75</text>
              <text x="290" y="160" textAnchor="end" className="text-[10px] lg:text-xs" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>50</text>
              <text x="290" y="230" textAnchor="end" className="text-[10px] lg:text-xs" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>25</text>
              <text x="290" y="270" textAnchor="end" className="text-[10px] lg:text-xs" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>0</text>

              {/* Chart area with gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#4A7DD9', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#4A7DD9', stopOpacity: 0.05 }} />
                </linearGradient>
              </defs>

              {qualityData.length > 0 ? (
                <>
                  {/* Generate path dynamically from quality data */}
                  {(() => {
                    const points = qualityData.map((value, index) => {
                      const x = 20 + (index * 48); // توزيع النقاط بالتساوي
                      const y = 250 - (value * 2.3); // تحويل القيمة إلى إحداثيات Y (0-100 -> 250-20)
                      return { x, y };
                    });

                    // إنشاء مسار SVG path
                    const pathD = points.map((point, index) => {
                      if (index === 0) return `M ${point.x} ${point.y}`;
                      return `L ${point.x} ${point.y}`;
                    }).join(' ');

                    // مسار المساحة المملوءة
                    const areaPath = `${pathD} L 260 250 L 20 250 Z`;

                    return (
                      <>
                        {/* Area fill */}
                        <path
                          d={areaPath}
                          fill="url(#chartGradient)"
                        />
                        {/* Line */}
                        <path
                          d={pathD}
                          stroke="#4A7DD9"
                          strokeWidth="3"
                          fill="none"
                        />
                        {/* Points */}
                        {points.map((point, index) => (
                          <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#4A7DD9"
                            stroke="#FFF"
                            strokeWidth="2"
                          />
                        ))}
                      </>
                    );
                  })()}
                </>
              ) : (
                // رسالة عند عدم وجود بيانات
                <g>
                  <text x="150" y="140" textAnchor="middle" style={{ fontSize: '14px', fill: '#9CA3AF', fontFamily: 'Noto Kufi Arabic' }}>
                    لا توجد بيانات لعرضها
                  </text>
                  <circle cx="150" cy="100" r="30" fill="#F3F4F6" opacity="0.5"/>
                  <path d="M150 85 L150 100 M150 110 L150 110.01" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round"/>
                </g>
              )}

              {/* X-axis labels */}
              <text x="20" y="275" textAnchor="middle" className="text-[9px] lg:text-[11px]" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>يونيو</text>
              <text x="68" y="275" textAnchor="middle" className="text-[9px] lg:text-[11px]" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>مايو</text>
              <text x="116" y="275" textAnchor="middle" className="text-[9px] lg:text-[11px]" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>أبريل</text>
              <text x="164" y="275" textAnchor="middle" className="text-[9px] lg:text-[11px]" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>مارس</text>
              <text x="212" y="275" textAnchor="middle" className="text-[9px] lg:text-[11px]" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>فبراير</text>
              <text x="260" y="275" textAnchor="middle" className="text-[9px] lg:text-[11px]" style={{ fill: '#717680', fontFamily: 'Noto Kufi Arabic' }}>يناير</text>
            </svg>
          </div>
        </div>
      </div>



    </DashboardLayout>
  );
}
