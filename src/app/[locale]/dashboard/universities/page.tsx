"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import * as XLSX from 'xlsx';
import type { University } from '@/types/api';

// LocalStorage keys
const LS_KEY = 'universities_data';

// Helper functions for localStorage CRUD
const loadUniversities = (): University[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveUniversities = (data: University[]) => {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
};

const addUniversity = (uni: Omit<University, 'university_id'>) => {
  const current = loadUniversities();
  const newId = current.length > 0 ? Math.max(...current.map(u => u.university_id)) + 1 : 1;
  const newUni: University = { university_id: newId, ...uni };
  const updated = [...current, newUni];
  saveUniversities(updated);
  return newUni;
};

const deleteUniversity = (id: number) => {
  const current = loadUniversities();
  const updated = current.filter(u => u.university_id !== id);
  saveUniversities(updated);
};

export default function UniversitiesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filterStatus] = useState("الكل");
  const [sortBy] = useState("الأحدث");
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState<University | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle edit
  const handleEdit = (universityId: number) => {
    router.push(`/dashboard/universities/edit/${universityId}`);
  };

  // Handle delete - open modal
  const handleDelete = (universityId: number) => {
    const university = universities.find(u => u.university_id === universityId);
    if (university) {
      setUniversityToDelete(university);
      setShowDeleteModal(true);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!universityToDelete) return;
    
    setIsDeleting(true);
    try {
      deleteUniversity(universityToDelete.university_id);
      setUniversities(loadUniversities());
      setShowDeleteModal(false);
      setUniversityToDelete(null);
    } catch {
      alert("حدث خطأ في حذف الجامعة");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUniversityToDelete(null);
  };

  // Handle Print
  const handlePrint = () => {
    // Generate HTML content
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طباعة قائمة الجامعات</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      margin: 1cm 0.8cm;
      size: A4;
    }
    
    body {
      font-family: 'Noto Kufi Arabic', Arial, sans-serif;
      padding: 10px;
      background: #ffffff;
      color: #1a1a1a;
      line-height: 1.3;
      font-size: 11pt;
    }
    
    .header {
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1.5px solid #2c3e50;
      text-align: center;
    }
    
    .institution-name {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 3px;
    }
    
    .document-title {
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
      margin-top: 8px;
    }
    
    .document-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 9px;
      color: #666;
    }
    
    .summary-section {
      background: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 8px 12px;
      margin: 12px 0;
      font-size: 10px;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    
    .summary-label {
      font-size: 9px;
      color: #666;
      display: block;
      margin-bottom: 2px;
    }
    
    .summary-value {
      font-size: 11px;
      color: #2c3e50;
      font-weight: 600;
    }
    
    .table-container {
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 3px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    
    thead {
      background: #D7B896;
      color: #000000;
    }
    
    th {
      padding: 8px 10px;
      text-align: center;
      font-weight: 600;
      font-size: 11px;
      width: 33.33%;
    }
    
    tbody tr {
      border-bottom: 1px solid #eee;
    }
    
    tbody tr:last-child {
      border-bottom: none;
    }
    
    tbody tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    td {
      padding: 6px 10px;
      text-align: center;
      vertical-align: middle;
      width: 33.33%;
    }
    
    .serial-number {
      text-align: center;
      color: #666;
      font-weight: 500;
      font-size: 10px;
    }
    
    .logo-cell {
      text-align: center;
      padding: 4px;
    }
    
    .logo-wrapper {
      width: 30px;
      height: 30px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 3px;
    }
    
    .logo-wrapper img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .logo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    
    .logo-placeholder svg {
      width: 16px;
      height: 16px;
      color: #bbb;
    }
    
    .university-name {
      font-weight: 500;
      color: #2c3e50;
      font-size: 11px;
    }
    
    .footer {
      margin-top: 15px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 8px;
      color: #666;
    }
    
    .footer-info {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .summary-section {
        background: #f8f8f8 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      thead {
        background: #D7B896 !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      tbody tr:nth-child(even) {
        background: #f9f9f9 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .table-container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="institution-name">نظام إدارة الجودة للجامعات</h1>
    <h2 class="document-title">قائمة الجامعات المسجلة</h2>
    <div class="document-meta">
      <span>QUA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</span>
      <span>${new Date().toLocaleDateString('ar-EG')}</span>
      <span>الإصدار 1.0</span>
    </div>
  </div>
  
  <div class="summary-section">
    <div class="summary-grid">
      <div>
        <span class="summary-label">عدد الجامعات</span>
        <span class="summary-value">${universities.length} جامعة</span>
      </div>
      <div>
        <span class="summary-label">تاريخ الطباعة</span>
        <span class="summary-value">${new Date().toLocaleDateString('ar-EG')}</span>
      </div>
      <div>
        <span class="summary-label">وقت الطباعة</span>
        <span class="summary-value">${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div>
        <span class="summary-label">الحالة</span>
        <span class="summary-value">نشط</span>
      </div>
    </div>
  </div>
  
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="serial-number">#</th>
          <th class="logo-cell">الشعار</th>
          <th>اسم الجامعة</th>
        </tr>
      </thead>
      <tbody>
        ${universities.map((uni, index) => `
          <tr>
            <td class="serial-number">${index + 1}</td>
            <td class="logo-cell">
              ${uni.university_logo 
                ? `<div class="logo-wrapper"><img src="${uni.university_logo}" alt="${uni.university_name}" /></div>`
                : ``
              }
            </td>
            <td class="university-name">${uni.university_name}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p>تم إنشاء هذه الوثيقة تلقائياً من نظام إدارة الجودة للجامعات</p>
    <div class="footer-info">
      <span>الصفحة 1 من 1</span>
      <span>© ${new Date().getFullYear()}</span>
      <span>${new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</span>
    </div>
  </div>
</body>
</html>
    `;

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Write content to iframe
    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Wait for content to load then print
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          
          // Remove iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 500);
      };
    }
  };

  // Handle Export to Excel
  const handleExportExcel = () => {
    if (universities.length === 0) {
      alert("لا توجد بيانات لتصديرها");
      return;
    }

    // Prepare data for Excel
    const data = universities.map((uni, index) => ({
      'الرقم': index + 1,
      'اسم الجامعة': uni.university_name,
      'اللوجو': uni.university_logo || ''
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 10 },  // الرقم
      { wch: 40 },  // اسم الجامعة
      { wch: 50 }   // اللوجو
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الجامعات');

    // Generate file name with date
    const fileName = `الجامعات_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  // Handle Import from Excel
  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        // Read file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        let successCount = 0;
        let errorCount = 0;

        for (const row of jsonData) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const university_name = (row as any)['اسم الجامعة'];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const university_logo = (row as any)['اللوجو'] || undefined;
            if (university_name && typeof university_name === 'string' && university_name.trim()) {
              addUniversity({ 
                university_name: university_name.trim(), 
                university_logo: university_logo && typeof university_logo === 'string' ? university_logo.trim() : undefined 
              });
              successCount++;
            }
          } catch {
            errorCount++;
          }
        }

        setUniversities(loadUniversities());
        alert(`تم الاستيراد بنجاح!\nتم إضافة: ${successCount} جامعة\nفشل: ${errorCount}`);
      } catch {
        alert("حدث خطأ في استيراد الملف. تأكد من صيغة الملف.");
      }
    };
    input.click();
  };

  // Handle Download Template
  const handleDownloadTemplate = () => {
    // Create template data with example rows
    const templateData = [
      {
        'الرقم': 1,
        'اسم الجامعة': 'جامعة القاهرة',
        'اللوجو': 'https://example.com/logo1.png'
      },
      {
        'الرقم': 2,
        'اسم الجامعة': 'جامعة الإسكندرية',
        'اللوجو': 'https://example.com/logo2.png'
      },
      {
        'الرقم': 3,
        'اسم الجامعة': 'الجامعة الأمريكية',
        'اللوجو': 'https://example.com/logo3.png'
      }
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 10 },  // الرقم
      { wch: 40 },  // اسم الجامعة
      { wch: 50 }   // اللوجو
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'نموذج الجامعات');

    // Save file
    XLSX.writeFile(wb, 'نموذج_الجامعات.xlsx');
  };

  // Fetch universities from localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const data = loadUniversities();
      setUniversities(data);
      setError(null);
    } catch {
      setError("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 lg:mb-6 gap-3 lg:gap-4">
        <div className="text-right w-full lg:w-auto">
          <h1
            className="text-lg lg:text-2xl font-bold mb-1 lg:mb-2"
            style={{
              color: "#2E327A",
              fontFamily: '"Noto Kufi Arabic"',
            }}
          >
            إدارة الجامعات
          </h1>
          <p
            className="text-xs lg:text-base"
            style={{
              color: "#717680",
              fontFamily: '"Noto Kufi Arabic"',
            }}
          >
            {loading ? "جاري التحميل..." : error ? error : `${universities.length} جامعة مسجلة في النظام.`}
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/universities/create")}
          className="w-full lg:w-auto px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
          style={{
            background: "#2F6FE8",
            color: "#FFF",
            borderRadius: "8px",
            fontFamily: '"Noto Kufi Arabic"',
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          <span className="transition-transform duration-300 group-hover:rotate-180">+</span>
          <span>إضافة جامعة جديدة</span>
        </button>
      </div>

      {/* Filters and Controls */}
      <div 
        className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-6 p-3 lg:p-4 rounded-xl"
        style={{
          background: "#FFF",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* View Mode and Filters - Order 1 on mobile, 2 on desktop */}
        <div className="flex items-center gap-2 lg:gap-3 order-1 lg:order-2 flex-wrap sm:flex-nowrap overflow-x-auto">
          {/* View Mode Toggle */}
          <div
            className="flex items-center gap-1 p-1 rounded-lg shrink-0"
            style={{
              background: "#FFF",
              border: "1px solid #E9EAEB",
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 lg:p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-blue-50" : ""
              }`}
              aria-label="عرض شبكي"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={viewMode === "grid" ? "#4A7DD9" : "#9CA3AF"}
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 lg:p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-blue-50" : ""
              }`}
              aria-label="عرض قائمة"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={viewMode === "list" ? "#4A7DD9" : "#9CA3AF"}
                strokeWidth="2"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shrink-0"
            style={{
              background: "#FFF",
              border: "1px solid #E9EAEB",
              fontFamily: '"Noto Kufi Arabic"',
              fontSize: "13px",
              color: "#2E327A",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A7DD9"
              strokeWidth="2"
            >
              <path d="M3 6h18M7 12h10m-7 6h4" />
            </svg>
            <span className="whitespace-nowrap">{sortBy}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* Filter Dropdown */}
          <div
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shrink-0"
            style={{
              background: "#FAFAFA",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              fontFamily: '"Noto Kufi Arabic"',
              fontSize: "13px",
              color: "#2E327A",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A7DD9"
              strokeWidth="2"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="whitespace-nowrap">{filterStatus}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Search - Order 2 on mobile, 1 on desktop */}
        <div className="flex-1 order-2 lg:order-1">
          <div
            className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg"
            style={{
              background: "#FAFAFA",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="ابحث عن جامعة..."
              className="flex-1 bg-transparent border-0 outline-none text-sm text-right"
              style={{
                fontFamily: '"Noto Kufi Arabic"',
                color: "#2E327A",
              }}
            />
          </div>
        </div>
      </div>

      {/* Universities Count and Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-4">
        {/* Count */}
        <div
          className="text-sm"
          style={{
            color: "#717680",
            fontFamily: '"Noto Kufi Arabic"',
          }}
        >
          العدد: {universities.length} جامعة
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
            style={{
              background: "#E3F2FD",
              color: "#1976D2",
              fontFamily: '"Noto Kufi Arabic"',
              fontSize: "13px",
              fontWeight: 500,
            }}
            title="طباعة"
          >
            <svg className="transition-transform duration-300 hover:scale-110" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>طباعة</span>
          </button>

          {/* Export Excel Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
            style={{
              background: "#E8F5E9",
              color: "#388E3C",
              fontFamily: '"Noto Kufi Arabic"',
              fontSize: "13px",
              fontWeight: 500,
            }}
            title="تصدير Excel"
          >
            <svg className="transition-transform duration-300 hover:translate-y-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>تصدير Excel</span>
          </button>

          {/* Import Excel Button */}
          <button
            onClick={handleImportExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
            style={{
              background: "#FFF3E0",
              color: "#F57C00",
              fontFamily: '"Noto Kufi Arabic"',
              fontSize: "13px",
              fontWeight: 500,
            }}
            title="استيراد من Excel"
          >
            <svg className="transition-transform duration-300 hover:-translate-y-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>استيراد Excel</span>
          </button>

          {/* Download Template Button */}
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 cursor-pointer"
            style={{
              background: "#F3E5F5",
              color: "#7B1FA2",
              fontFamily: '"Noto Kufi Arabic"',
              fontSize: "13px",
              fontWeight: 500,
            }}
            title="تحميل النموذج"
          >
            <svg className="transition-transform duration-300 hover:rotate-12" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span>تحميل النموذج</span>
          </button>
        </div>
      </div>

      {/* Universities Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8" style={{ color: "#717680", fontFamily: '"Noto Kufi Arabic"' }}>
              جاري تحميل البيانات...
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8" style={{ color: "#C62828", fontFamily: '"Noto Kufi Arabic"' }}>
              {error}
            </div>
          ) : universities.length === 0 ? (
            <div className="col-span-full text-center py-8" style={{ color: "#717680", fontFamily: '"Noto Kufi Arabic"' }}>
              لا توجد جامعات مسجلة
            </div>
          ) : (
            universities.map((university) => (
              <div
                key={university.university_id}
                className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 hover:shadow-lg transition-shadow relative"
                style={{
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* أزرار التعديل والحذف */}
                <div className="absolute top-3 lg:top-4 left-3 lg:left-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(university.university_id);
                    }}
                    className="p-1.5 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                    title="تعديل"
                  >
                    <svg className="transition-transform duration-300 hover:rotate-12" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A7DD9" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(university.university_id);
                    }}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                    title="حذف"
                  >
                    <svg className="transition-transform duration-300 hover:rotate-12" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>

                {/* اللوجو */}
                <div className="flex justify-center mb-4">
                  {university.university_logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={university.university_logo}
                      alt={university.university_name}
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-lg flex items-center justify-center"
                      style={{
                        background: "#E7EDF3",
                      }}
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4A7DD9"
                        strokeWidth="2"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* اسم الجامعة */}
                <h3
                  className="text-sm lg:text-base mb-3 text-center leading-relaxed"
                  style={{
                    color: "#2E327A",
                    fontFamily: '"Noto Kufi Arabic"',
                    fontWeight: 600,
                  }}
                >
                  {university.university_name}
                </h3>
              </div>
            ))
          )}
        </div>
      )}

      {/* Universities Table/List View */}
      {viewMode === "list" && (
        <>
          {loading ? (
            <div className="text-center py-8 bg-white rounded-2xl" style={{ color: "#717680", fontFamily: '"Noto Kufi Arabic"' }}>
              جاري تحميل البيانات...
            </div>
          ) : error ? (
            <div className="text-center py-8 bg-white rounded-2xl" style={{ color: "#C62828", fontFamily: '"Noto Kufi Arabic"' }}>
              {error}
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl" style={{ color: "#717680", fontFamily: '"Noto Kufi Arabic"' }}>
              لا توجد جامعات مسجلة
            </div>
          ) : (
            <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl overflow-hidden">
            <table className="w-full" style={{ direction: "rtl" }}>
              <thead
                style={{
                  background: "#E7EDF3",
                }}
              >
                <tr>
                  <th
                    className="p-4 text-right text-sm font-medium"
                    style={{
                      color: "#717BBC",
                      fontFamily: '"Noto Kufi Arabic"',
                    }}
                  >
                    اللوجو
                  </th>
                  <th
                    className="p-4 text-right text-sm font-medium"
                    style={{
                      color: "#717BBC",
                      fontFamily: '"Noto Kufi Arabic"',
                    }}
                  >
                    اسم الجامعة
                  </th>
                  <th
                    className="p-4 text-right text-sm font-medium"
                    style={{
                      color: "#717BBC",
                      fontFamily: '"Noto Kufi Arabic"',
                    }}
                  >
                    خيارات
                  </th>
                </tr>
              </thead>
              <tbody>
                {universities.map((university, index) => {
                  const isLastRow = index === universities.length - 1;

                  return (
                    <tr
                      key={university.university_id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{
                        borderBottom: isLastRow ? "none" : "1px solid #F5F5F5",
                      }}
                    >
                      <td className="p-4">
                        {university.university_logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={university.university_logo}
                            alt={university.university_name}
                            className="w-12 h-12 object-contain rounded-lg"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{
                              background: "#E7EDF3",
                            }}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#4A7DD9"
                              strokeWidth="2"
                            >
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                              <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td
                        className="p-4 text-sm font-medium"
                        style={{
                          color: "#2E327A",
                          fontFamily: '"Noto Kufi Arabic"',
                        }}
                      >
                        {university.university_name}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-start">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(university.university_id);
                            }}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                            title="تعديل"
                          >
                            <svg className="transition-transform duration-300 hover:rotate-12" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A7DD9" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(university.university_id);
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                            title="حذف"
                          >
                            <svg className="transition-transform duration-300 hover:rotate-12" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {universities.map((university) => (
                <div
                  key={university.university_id}
                  className="bg-white rounded-xl p-4 relative"
                  style={{
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* أزرار التعديل والحذف */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(university.university_id);
                      }}
                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                      title="تعديل"
                    >
                      <svg className="transition-transform duration-300 hover:rotate-12" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A7DD9" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(university.university_id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                      title="حذف"
                    >
                      <svg className="transition-transform duration-300 hover:rotate-12" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>

                  {/* اللوجو */}
                  <div className="flex justify-center mb-3">
                    {university.university_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={university.university_logo}
                        alt={university.university_name}
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center"
                        style={{
                          background: "#E7EDF3",
                        }}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#4A7DD9"
                          strokeWidth="2"
                        >
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* اسم الجامعة */}
                  <h3
                    className="text-sm font-semibold text-center leading-relaxed"
                    style={{
                      color: "#2E327A",
                      fontFamily: '"Noto Kufi Arabic"',
                    }}
                  >
                    {university.university_name}
                  </h3>
                </div>
            ))}
          </div>
          {/* End Mobile Card View */}
          {/* End Desktop Table View */}
          </>
          )}
        </>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal && universityToDelete !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف جامعة"
        itemName={universityToDelete?.university_name}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
