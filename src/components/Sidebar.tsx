"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  UsersIcon,
  BellIcon,
  Cog6ToothIcon,
  FolderIcon,
  BuildingLibraryIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  subItems?: MenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "",
    items: [
      { name: "الصفحة الرئيسية", href: "/dashboard", icon: HomeIcon },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { 
        name: "إدارة الحسابات", 
        icon: UsersIcon,
        subItems: [
          { name: "إنشاء", href: "/dashboard/accounts/create", icon: DocumentTextIcon },
          { name: "إدارة", href: "/dashboard/accounts/manage", icon: Cog6ToothIcon },
          { name: "نوع المستخدم", href: "/dashboard/user-types", icon: UsersIcon },
        ]
      },
    ],
  },
  {
    title: "",
    items: [
      { name: "بيانات الوحدة", href: "/dashboard/unit-data", icon: FolderIcon },
      { name: "الجامعات", href: "/dashboard/universities", icon: BuildingLibraryIcon },
      { 
        name: "الكليات", 
        icon: BuildingLibraryIcon,
        subItems: [
          { name: "إدارة الكليات", href: "/dashboard/faculties", icon: BuildingLibraryIcon },
          { name: "إدارة الأقسام", href: "/dashboard/departments", icon: FolderIcon },
          { name: "إدارة الكورسات", href: "/dashboard/courses", icon: DocumentTextIcon },
        ]
      },
      { name: "تعديل الاستبيان", href: "/dashboard/survey", icon: DocumentTextIcon },
    ],
  },
  {
    title: "العمليات",
    items: [
      { name: "إدارة المهام", href: "/dashboard/tasks", icon: CheckCircleIcon },
      { name: "إنشاء ملفات", href: "/dashboard/files", icon: FolderIcon },
      { name: "الشكاوى والمقترحات", href: "/dashboard/complaints", icon: BellIcon },
      { name: "الذكريات", href: "/dashboard/memories", icon: CalendarIcon },
    ],
  },
  {
    title: "عام",
    items: [
      { name: "المطبوعات", href: "/dashboard/prints", icon: DocumentTextIcon },
      { name: "من نحن", href: "/dashboard/about", icon: UsersIcon },
      { name: "اتصل بنا", href: "/dashboard/contact", icon: BellIcon },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ isOpen = true, onClose, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  const toggleDropdown = (itemName: string) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  const handleNavigation = (href: string) => {
    startTransition(() => {
      router.push(href);
      if (onClose) {
        // تأخير بسيط لضمان بدء التنقل قبل إغلاق القائمة
        setTimeout(() => onClose(), 50);
      }
    });
  };



  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 flex flex-col bg-white
          transition-all duration-300 ease-in-out
          lg:top-0 lg:right-0 lg:h-screen 
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          top-0 right-0 h-screen w-72
        `}
        style={{ backgroundColor: '#D6E9F8' }}
      >
        {/* Header - Desktop */}
        <div className="hidden lg:flex shrink-0 items-center justify-between p-4 border-b border-gray-300/60">
          {!collapsed && (
            <div className="flex-1">
              <h2 className="text-base font-bold text-gray-800">نظام ضمان الجودة</h2>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-white/70 transition-all"
            title={collapsed ? "توسيع القائمة" : "تصغير القائمة"}
          >
            {collapsed ? (
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Header - Mobile */}
        <div className="lg:hidden shrink-0 flex items-center justify-between p-4 border-b border-gray-300/60 bg-white/80 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-gray-800">القائمة الرئيسية</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="إغلاق القائمة"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.title && (
                <h3 className={`text-xs font-bold text-gray-600 mb-2 px-2 uppercase tracking-wide ${collapsed ? 'lg:hidden' : ''}`}>
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const isActive = item.href ? pathname === item.href : false;
                  const isParentActive = item.subItems?.some(sub => pathname === sub.href);
                  const Icon = item.icon;
                  const isDropdownOpen = openDropdown === item.name;

                  return (
                    <li key={itemIndex}>
                      {item.subItems ? (
                        // Dropdown item
                        <div>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className={`
                              w-full flex items-center justify-between px-3 py-2.5 
                              transition-all duration-200 rounded-lg
                              ${
                                isParentActive
                                  ? "bg-white text-blue-700 font-semibold shadow-sm"
                                  : "text-gray-700 hover:bg-white/60"
                              }
                              ${collapsed ? "lg:justify-center lg:px-2" : ""}
                            `}
                            title={collapsed ? item.name : undefined}
                          >
                            <div className={`flex items-center gap-3 ${collapsed ? 'lg:gap-0' : ''}`}>
                              <Icon className={`
                                ${collapsed ? "lg:w-6 lg:h-6" : "w-5 h-5"} 
                                ${isParentActive ? "text-blue-700" : "text-gray-600"}
                                shrink-0
                              `} />
                              <span className={`
                                text-sm
                                ${isParentActive ? "font-semibold" : "font-medium"} 
                                ${collapsed ? "lg:hidden" : ""}
                              `}>
                                {item.name}
                              </span>
                            </div>
                            {!collapsed && (
                              <>
                                {isDropdownOpen ? (
                                  <ChevronUpIcon className={`w-4 h-4 ${isParentActive ? "text-blue-700" : "text-gray-400"}`} />
                                ) : (
                                  <ChevronDownIcon className={`w-4 h-4 ${isParentActive ? "text-blue-700" : "text-gray-400"}`} />
                                )}
                              </>
                            )}
                          </button>
                          
                          {/* Dropdown items */}
                          <div 
                            className={`
                              overflow-hidden transition-all duration-300 ease-in-out
                              ${isDropdownOpen && !collapsed ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}
                            `}
                          >
                            <ul className="space-y-1 pr-4">
                              {item.subItems.map((subItem, subIndex) => {
                                const isSubActive = pathname === subItem.href;
                                const SubIcon = subItem.icon;
                                
                                return (
                                  <li key={subIndex}>
                                    <button
                                      onClick={() => handleNavigation(subItem.href!)}
                                      disabled={isPending}
                                      className={`
                                        w-full flex items-center justify-between px-3 py-2 
                                        transition-all duration-200 rounded-lg
                                        ${
                                          isSubActive
                                            ? "bg-white text-blue-700 font-semibold shadow-sm"
                                            : "text-gray-700 hover:bg-white/60"
                                        }
                                        ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}
                                      `}
                                    >
                                      <div className="flex items-center gap-2">
                                        <SubIcon className={`w-4 h-4 ${isSubActive ? "text-blue-700" : "text-gray-600"} shrink-0`} />
                                        <span className={`text-sm ${isSubActive ? "font-semibold" : "font-medium"}`}>
                                          {subItem.name}
                                        </span>
                                      </div>
                                      <ChevronLeftIcon className={`w-3 h-3 ${isSubActive ? "text-blue-700" : "text-gray-400"}`} />
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        // Regular link item
                        <button
                          onClick={() => handleNavigation(item.href!)}
                          disabled={isPending}
                          className={`
                            w-full flex items-center justify-between px-3 py-2.5 
                            transition-all duration-200 rounded-lg
                            ${
                              isActive
                                ? "bg-white text-blue-700 font-semibold shadow-sm"
                                : "text-gray-700 hover:bg-white/60"
                            }
                            ${collapsed ? "lg:justify-center lg:px-2" : ""}
                            ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}
                          `}
                          title={collapsed ? item.name : undefined}
                        >
                          <div className={`flex items-center gap-3 ${collapsed ? 'lg:gap-0' : ''}`}>
                            <Icon className={`
                              ${collapsed ? "lg:w-6 lg:h-6" : "w-5 h-5"} 
                              ${isActive ? "text-blue-700" : "text-gray-600"}
                              shrink-0
                            `} />
                            <span className={`
                              text-sm
                              ${isActive ? "font-semibold" : "font-medium"} 
                              ${collapsed ? "lg:hidden" : ""}
                            `}>
                              {item.name}
                            </span>
                          </div>
                          {!collapsed && (
                            <ChevronLeftIcon className={`w-3 h-3 ${isActive ? "text-blue-700" : "text-gray-400"}`} />
                          )}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-3 border-t">
          <button
            className={`
              w-full py-2.5 px-3 bg-white text-red-600 rounded-lg 
              font-bold hover:bg-red-50 hover:text-red-700
              transition-all shadow-sm 
              flex items-center gap-2
              ${collapsed ? "lg:justify-center lg:px-2" : "justify-center"}
            `}
          >
            <ArrowRightOnRectangleIcon className={`${collapsed ? "lg:w-6 lg:h-6" : "w-5 h-5"}`} />
            <span className={`text-sm ${collapsed ? "lg:hidden" : ""}`}>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Mobile Sidebar Toggle Button Component
export function SidebarToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <header className="lg:hidden w-full bg-white shadow-sm z-20 px-4 py-3 sticky top-0">
      <div className="flex items-center justify-between">
        <button
          onClick={onClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          aria-label="فتح القائمة"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">نظام ضمان الجودة</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </header>
  );
}
