"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import type { University } from '@/types/api';

const LS_KEY = 'universities_data';
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
const getUniversityById = (id: number): University | undefined => {
  return loadUniversities().find(u => u.university_id === id);
};
const updateUniversity = (id: number, uni: Omit<University, 'university_id'>) => {
  const current = loadUniversities();
  const updated = current.map(u =>
    u.university_id === id ? { university_id: id, ...uni } : u
  );
  saveUniversities(updated);
};

export default function EditUniversityPage() {
  const router = useRouter();
  const params = useParams();
  const universityId = Number(params.id);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    university_name: "",
    logo_url: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);

  // Fetch university data
  useEffect(() => {
    if (universityId) {
      setLoading(true);
      const university = getUniversityById(universityId);
      if (university) {
        setFormData({
          university_name: university.university_name,
          logo_url: university.university_logo || "",
        });
        if (university.university_logo) {
          setCurrentLogo(university.university_logo);
          setLogoPreview(university.university_logo);
          setUploadMethod("url");
        }
        setError(null);
      } else {
        setError("لم يتم العثور على الجامعة المطلوبة");
      }
      setLoading(false);
    }
  }, [universityId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update logo preview when URL changes
    if (name === "logo_url" && value) {
      setLogoPreview(value);
    } else if (name === "logo_url" && !value) {
      setLogoPreview(currentLogo);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار صورة صالحة');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
      }

      setLogoFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setCurrentLogo(null);
    setFormData((prev) => ({ ...prev, logo_url: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.university_name.trim()) {
      setError("يرجى إدخال اسم الجامعة");
      return;
    }

    try {
      // First, upload the logo if exists
      let logoUrl = currentLogo || undefined;
      
      if (uploadMethod === "url" && formData.logo_url.trim()) {
        // Use direct URL
        logoUrl = formData.logo_url.trim();
      } else if (uploadMethod === "file" && logoFile) {
        // Upload file
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('file', logoFile);

          // Upload file to backend
          const token = localStorage.getItem('accessToken');
          const uploadResponse = await fetch('http://localhost:5000/api/Files/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formDataUpload,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'فشل رفع الصورة');
          }

          const uploadData = await uploadResponse.json();
          // Use the file_url from the response (full URL)
          logoUrl = uploadData.file_url || uploadData.file_path || `http://localhost:5000${uploadData.file_path}`;
          console.log("Logo uploaded successfully:", logoUrl);
        } catch (uploadErr) {
          console.error("Error uploading file:", uploadErr);
          setError("فشل رفع الصورة. سيتم تحديث الجامعة بدون تغيير اللوجو.");
          // Continue with current logo
          logoUrl = currentLogo || undefined;
        }
      } else if (!logoFile && !formData.logo_url.trim()) {
        // User removed logo
        logoUrl = undefined;
      }

      // Update university with logo URL
      startTransition(() => {
        updateUniversity(universityId, {
          university_name: formData.university_name.trim(),
          university_logo: logoUrl || logoPreview || ""
        });
        router.push("/dashboard/universities");
      });
    } catch (err) {
      console.error("Error updating university:", err);
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ أثناء تحديث الجامعة. يرجى المحاولة مرة أخرى.";
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <svg
              className="animate-spin mx-auto mb-4"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A7DD9"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p
              className="text-base"
              style={{
                color: "#717680",
                fontFamily: '"Noto Kufi Arabic"',
              }}
            >
              جاري تحميل البيانات...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="رجوع"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2E327A"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <h1
                className="text-2xl font-bold"
                style={{
                  color: "#2E327A",
                  fontFamily: '"Noto Kufi Arabic"',
                }}
              >
                تعديل بيانات الجامعة
              </h1>
            </div>
            <p
              className="text-base mr-14"
              style={{
                color: "#717680",
                fontFamily: '"Noto Kufi Arabic"',
              }}
            >
              قم بتعديل بيانات الجامعة
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit}>
          <div
            className="bg-white rounded-2xl p-6 lg:p-8 mb-6"
            style={{
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Error Message */}
            {error && (
              <div
                className="mb-6 p-4 rounded-lg flex items-start gap-3"
                style={{
                  background: "#FEE",
                  border: "1px solid #FCC",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C62828"
                  strokeWidth="2"
                  className="shrink-0 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p
                  className="text-sm"
                  style={{
                    color: "#C62828",
                    fontFamily: '"Noto Kufi Arabic"',
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* University Name Field */}
            <div className="mb-6">
              <label
                htmlFor="university_name"
                className="block text-sm font-medium mb-2 text-right"
                style={{
                  color: "#2E327A",
                  fontFamily: '"Noto Kufi Arabic"',
                }}
              >
                اسم الجامعة <span style={{ color: "#C62828" }}>*</span>
              </label>
              <input
                type="text"
                id="university_name"
                name="university_name"
                value={formData.university_name}
                onChange={handleInputChange}
                placeholder="مثال: جامعة القاهرة"
                required
                className="w-full px-4 py-3 rounded-lg text-right outline-none transition-all"
                style={{
                  background: "#FAFAFA",
                  border: "1px solid #E9EAEB",
                  fontFamily: '"Noto Kufi Arabic"',
                  color: "#2E327A",
                }}
                disabled={isPending}
              />
            </div>

            {/* University Logo Field */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-3 text-right"
                style={{
                  color: "#2E327A",
                  fontFamily: '"Noto Kufi Arabic"',
                }}
              >
                لوجو الجامعة (اختياري)
              </label>

              {/* Upload Method Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod("file");
                    setFormData((prev) => ({ ...prev, logo_url: "" }));
                    setLogoPreview(currentLogo);
                    setLogoFile(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    uploadMethod === "file"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    fontFamily: '"Noto Kufi Arabic"',
                    fontSize: "13px",
                  }}
                >
                  رفع ملف
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMethod("url");
                    setLogoFile(null);
                    if (currentLogo) {
                      setLogoPreview(currentLogo);
                      setFormData((prev) => ({ ...prev, logo_url: currentLogo }));
                    } else {
                      setLogoPreview(null);
                      setFormData((prev) => ({ ...prev, logo_url: "" }));
                    }
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    uploadMethod === "url"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    fontFamily: '"Noto Kufi Arabic"',
                    fontSize: "13px",
                  }}
                >
                  رابط URL
                </button>
              </div>
              
              {uploadMethod === "file" ? (
                !logoPreview ? (
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    style={{
                      borderColor: "#E9EAEB",
                      background: "#FAFAFA",
                    }}
                    onClick={() => document.getElementById('university_logo')?.click()}
                  >
                    <input
                      type="file"
                      id="university_logo"
                      name="university_logo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isPending}
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
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
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium mb-1"
                          style={{
                            color: "#2E327A",
                            fontFamily: '"Noto Kufi Arabic"',
                          }}
                        >
                          انقر لرفع صورة أو اسحبها هنا
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: "#717680",
                            fontFamily: '"Noto Kufi Arabic"',
                          }}
                        >
                          PNG, JPG, GIF (حجم أقصى 5 ميجابايت)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border rounded-lg p-4"
                    style={{
                      borderColor: "#E9EAEB",
                      background: "#FAFAFA",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-20 h-20 object-contain rounded-lg"
                          style={{
                            background: "#FFF",
                            border: "1px solid #E9EAEB",
                          }}
                        />
                      </div>
                      <div className="flex-1 text-right">
                        <p
                          className="text-sm font-medium mb-1"
                          style={{
                            color: "#2E327A",
                            fontFamily: '"Noto Kufi Arabic"',
                          }}
                        >
                          {logoFile?.name || "اللوجو الحالي"}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: "#717680",
                            fontFamily: '"Noto Kufi Arabic"',
                          }}
                        >
                          {logoFile ? `${(logoFile.size / 1024).toFixed(2)} كيلوبايت` : "صورة محفوظة"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        disabled={isPending}
                        className="shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="حذف الصورة"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#C62828"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div>
                  <input
                    type="url"
                    id="logo_url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-3 rounded-lg text-right outline-none transition-all mb-3"
                    style={{
                      background: "#FAFAFA",
                      border: "1px solid #E9EAEB",
                      fontFamily: '"Noto Kufi Arabic"',
                      color: "#2E327A",
                    }}
                    disabled={isPending}
                  />
                  {logoPreview && (
                    <div
                      className="border rounded-lg p-4 flex items-center justify-center"
                      style={{
                        borderColor: "#E9EAEB",
                        background: "#FAFAFA",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-24 h-24 object-contain rounded-lg"
                        onError={() => setLogoPreview(null)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>


          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              style={{
                background: "#FFF",
                border: "1px solid #E9EAEB",
                color: "#2E327A",
                fontFamily: '"Noto Kufi Arabic"',
                fontWeight: 600,
              }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: "#2F6FE8",
                color: "#FFF",
                fontFamily: '"Noto Kufi Arabic"',
                fontWeight: 600,
              }}
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>حفظ التغييرات</span>
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
