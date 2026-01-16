"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/authService";
import { userTypesApi, UserType } from "@/services/userTypesService";
import { universitiesApi, University } from "@/services/universitiesService";
import { facultiesApi, Faculty } from "@/services/facultiesService";
import { programsApi, Program } from "@/services/programsService";
import SearchableSelect from "@/components/SearchableSelect";

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    gender: "",
    password: "",
    universityId: "",
    facultyId: "",
    userTypeId: "",
    department: "",
    level: "",
    standardId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Fetch user types on component mount
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const types = await userTypesApi.getAll(true); // Skip authentication for public signup page
        setUserTypes(types);
      } catch (err) {
        console.error("Error fetching user types:", err);
        setError("فشل في تحميل أنواع المستخدمين. يرجى المحاولة مرة أخرى.");
      }
    };
    
    fetchUserTypes();
  }, []);

  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const unis = await universitiesApi.getAll(true); // Skip authentication for public signup page
        setUniversities(unis);
      } catch (err) {
        console.error("Error fetching universities:", err);
        // Don't show error to user, just log it
      }
    };
    
    fetchUniversities();
  }, []);

  // Fetch faculties when university changes
  useEffect(() => {
    const fetchFaculties = async () => {
      if (!formData.universityId) {
        setFaculties([]);
        return;
      }
      
      try {
        const universityId = parseInt(formData.universityId);
        const facs = await facultiesApi.getByUniversityId(universityId, true); // Skip authentication for public signup page
        setFaculties(facs);
        
        // Reset faculty selection when university changes
        const currentFacultyId = formData.facultyId;
        if (currentFacultyId) {
          const facultyStillValid = facs.some((f: Faculty) => f.faculty_id.toString() === currentFacultyId);
          if (!facultyStillValid) {
            setFormData(prev => ({ ...prev, facultyId: "" }));
          }
        }
      } catch (err) {
        console.error("Error fetching faculties:", err);
        // Set empty array on error
        setFaculties([]);
      }
    };
    
    fetchFaculties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.universityId]);

  // Fetch programs when faculty changes
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!formData.facultyId) {
        setPrograms([]);
        return;
      }
      
      try {
        const facultyId = parseInt(formData.facultyId);
        
        // Determine program type based on user type
        const selectedUserType = userTypes.find(type => type.userTypeId.toString() === formData.userTypeId);
        const userTypeName = selectedUserType?.userTypeName || "";
        
        let progs: Program[] = [];
        
        // Map user types to program types
        // Assuming: 1 = بكالوريوس, 2 = ماجستير, 3 = دكتوراه
        if (userTypeName === "طالب بكالوريوس") {
          progs = await programsApi.getByFacultyAndType(facultyId, 1, true); // البرامج البكالوريوس
        } else if (userTypeName === "طالب دراسات عليا" || userTypeName === "طالب ماجستير") {
          progs = await programsApi.getByFacultyAndType(facultyId, 2, true); // برامج الماجستير
        } else if (userTypeName === "طالب دكتوراه") {
          progs = await programsApi.getByFacultyAndType(facultyId, 3, true); // برامج الدكتوراه
        } else {
          // For other user types, get all programs
          progs = await programsApi.getByFacultyId(facultyId, true);
        }
        
        setPrograms(progs);
        
        // Reset department/program selection when faculty changes
        const currentDepartment = formData.department;
        if (currentDepartment) {
          const departmentStillValid = progs.some((p: Program) => p.program_id.toString() === currentDepartment);
          if (!departmentStillValid) {
            setFormData(prev => ({ ...prev, department: "" }));
          }
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
        // Set empty array on error
        setPrograms([]);
      }
    };
    
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.facultyId, formData.userTypeId]);

  // Helper function to determine which fields should be shown based on user type
  const getFieldsToShow = () => {
    const selectedUserType = userTypes.find(type => type.userTypeId.toString() === formData.userTypeId);
    const userTypeName = selectedUserType?.userTypeName || "";

    // مشرف عام - Step 1 only
    if (userTypeName === "مشرف عام") {
      return { showUniversity: false, showFaculty: false, showDepartment: false, showLevel: false, showStandard: false, maxSteps: 1 };
    }
    
    // إداري جامعة - University only
    if (userTypeName === "إداري جامعة") {
      return { showUniversity: true, showFaculty: false, showDepartment: false, showLevel: false, showStandard: false, maxSteps: 2 };
    }
    
    // إداري كلية, دكتور, أستاذ, أستاذ مساعد, معيد, مدرس مساعد, موظف - University and Faculty
    if (["إداري كلية", "دكتور", "أستاذ", "أستاذ مساعد", "معيد", "مدرس مساعد", "موظف"].includes(userTypeName)) {
      return { showUniversity: true, showFaculty: true, showDepartment: false, showLevel: false, showStandard: false, maxSteps: 2 };
    }
    
    // طالب بكالوريوس - All fields including level and standard
    if (userTypeName === "طالب بكالوريوس") {
      return { showUniversity: true, showFaculty: true, showDepartment: true, showLevel: true, showStandard: true, maxSteps: 3 };
    }
    
    // خريج, طالب دراسات عليا - University, Faculty, and Department
    if (["خريج", "طالب دراسات عليا"].includes(userTypeName)) {
      return { showUniversity: true, showFaculty: true, showDepartment: true, showLevel: false, showStandard: false, maxSteps: 2 };
    }
    
    // زائر - University and Faculty
    if (userTypeName === "زائر") {
      return { showUniversity: true, showFaculty: true, showDepartment: false, showLevel: false, showStandard: false, maxSteps: 2 };
    }

    // Default: show all
    return { showUniversity: true, showFaculty: true, showDepartment: true, showLevel: true, showStandard: true, maxSteps: 3 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError("");
    
    try {
      const registerData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        userTypeId: parseInt(formData.userTypeId),
        universityId: formData.universityId ? parseInt(formData.universityId) : undefined,
      };
      
      const response = await authApi.register(registerData);
      
      console.log("Registration successful:", response);
      
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const errorMessage = err instanceof Error ? err.message : "فشل إنشاء الحساب. حاول مرة أخرى.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    const fieldsConfig = getFieldsToShow();
    
    // Validate current step before moving forward
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.nationalId || !formData.gender || !formData.password || !formData.userTypeId) {
        setError("الرجاء ملء جميع الحقول المطلوبة");
        return;
      }
      
      if (fieldsConfig.maxSteps === 1) {
        void handleSubmit({ preventDefault: () => {} } as React.FormEvent);
        return;
      }
    } else if (currentStep === 2) {
      if (fieldsConfig.showUniversity && !formData.universityId) {
        setError("الرجاء اختيار الجامعة");
        return;
      }
      if (fieldsConfig.showFaculty && !formData.facultyId) {
        setError("الرجاء اختيار الكلية");
        return;
      }
      if (fieldsConfig.showDepartment && !formData.department) {
        setError("الرجاء اختيار القسم");
        return;
      }
      if (fieldsConfig.showLevel && !formData.level) {
        setError("الرجاء اختيار الفرقة");
        return;
      }
    }
    setError("");
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-400 via-blue-500 to-blue-600 px-4 py-12 relative overflow-hidden">
      {/* Decorative circles in background */}
      <div className="absolute top-20 right-20 bg-white/5 rounded-full" style={{ width: '381px', height: '381px', animation: 'float 6s ease-in-out infinite' }}></div>
      <div className="absolute bottom-20 left-20 bg-white/5 rounded-full" style={{ width: '381px', height: '381px', animation: 'floatSlow 8s ease-in-out infinite', animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/4 bg-white/5 rounded-full" style={{ width: '381px', height: '381px', animation: 'float 7s ease-in-out infinite', animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 bg-white/5 rounded-full" style={{ width: '381px', height: '381px', animation: 'floatSlow 9s ease-in-out infinite', animationDelay: '3s' }}></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-30px) translateX(10px);
          }
        }
      `}</style>

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="mb-10">
  <div className="max-w-2xl mx-auto">
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-center">
        <div
        style={{
          display: "flex",
          width: "33px",
          height: "33px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={`rounded-full border-2  ${
          currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-400 bg-white'
        }`}>
          1
        </div>
        <div className={`mt-2 text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          الخطوة
        </div>
      </div>

      {getFieldsToShow().maxSteps > 1 && (
        <>
          <div className="flex-1 -mt-6 h-0.5">
            <div className={`h-full transition-all ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
          </div>

          <div className="flex flex-col items-center">
            <div
            style={{
              display: "flex",
              width: "33px",
              height: "33px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={`rounded-full border-2 ${
              currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-400 bg-white'
            }`}>
              2
            </div>
            <div className={`mt-2 text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              الخطوة
            </div>
          </div>
        </>
      )}

      {getFieldsToShow().maxSteps > 2 && (
        <>
          <div className="flex-1 -mt-6 h-0.5">
            <div className={`h-full transition-all ${
              currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
          </div>

          <div className="flex flex-col  items-center">
            <div
            style={{
              display: "flex",
              width: "33px",
              height: "33px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={`rounded-full border-2 ${
              currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-400 bg-white'
            }`}>
              3
            </div>
            <div className={`mt-2 text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              الخطوة
            </div>
          </div>
        </>
      )}
    </div>
  </div>
</div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
<h2
  style={{
    color: "var(--Prject-Brand-Normal-Blue, #2F6FE8)",
    textAlign: "right",
    fontFamily: '"Noto Kufi Arabic"',
    fontSize: "19px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "38px",
  }}
>
  المعلومات الأساسية
</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
style={{
  color: " #A4A7AE",
  textAlign: "right",
  fontFamily: "Noto Kufi Arabic",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  padding: "8px",
  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
  border: "1px solid #E9EAEB",
  borderRadius: "8px",
  background: "#FAFAFA",
 width: "100%",
  lineHeight: "24px"
}}
                    placeholder="ادخل اسمك رباعي"
                  />
                </div>

                <div>
                  <SearchableSelect
                    id="userTypeId"
                    name="userTypeId"
                    value={formData.userTypeId}
                    onChange={(value: string) => setFormData({ ...formData, userTypeId: value })}
                    label="نوع المستخدم"
                    required
                    placeholder="اختر نوعك"
                    options={userTypes.map((type) => ({
                      value: type.userTypeId.toString(),
                      label: type.userTypeName,
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
style={{
  color: " #A4A7AE",
  textAlign: "right",
  fontFamily: "Noto Kufi Arabic",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  padding: "8px",
  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
  border: "1px solid #E9EAEB",
  borderRadius: "8px",
  background: "#FAFAFA",
 width: "100%",
  lineHeight: "24px"
}}                    placeholder="rashad@ieee.org"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
style={{
  color: " #A4A7AE",
  textAlign: "right",
  fontFamily: "Noto Kufi Arabic",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  padding: "8px",
  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
  border: "1px solid #E9EAEB",
  borderRadius: "8px",
  background: "#FAFAFA",
 width: "100%",
  lineHeight: "24px"
}}                      placeholder="0-111-2345-6789"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                    الرقم القومي <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nationalId"
                    name="nationalId"
                    type="text"
                    required
                    value={formData.nationalId}
                    onChange={handleChange}
style={{
  color: " #A4A7AE",
  textAlign: "right",
  fontFamily: "Noto Kufi Arabic",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  padding: "8px",
  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
  border: "1px solid #E9EAEB",
  borderRadius: "8px",
  background: "#FAFAFA",
 width: "100%",
  lineHeight: "24px"
}}                    placeholder="ادخل الرقم القومي"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    الجنس <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">ذكر</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">أنثى</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
style={{
  color: " #A4A7AE",
  textAlign: "right",
  fontFamily: "Noto Kufi Arabic",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  padding: "8px",
  boxShadow: "0 1px 2px 0 rgba(18, 18, 23, 0.05)",
  border: "1px solid #E9EAEB",
  borderRadius: "8px",
  background: "#FAFAFA",
 width: "100%",
  lineHeight: "24px"
}}                  placeholder="ادخل كلمة المرور"
                  dir="ltr"
                />
                <button type="button" className="text-blue-600 text-sm mt-2 hover:underline">
                  تعيين كلمة المرور؟
                </button>
              </div>

              <div className="flex items-start gap-3  rounded-lg">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                  أوافق على الشروط والأحكام وسياسة الخصوصية
                </label>
              </div>

              <div className="flex justify-between gap-4 pt-4">
                <p className="text-gray-700 text-sm flex items-center">
                  لديك حساب بالفعل؟{" "}
                  <Link 
                    href="/login"
                    className="text-blue-600 hover:underline mr-1"
                  >
                    تسجيل الدخول
                  </Link>
                </p>
                
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!agreeToTerms}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  التالي
                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">البيانات الأكاديمية</h2>
              
              {getFieldsToShow().showUniversity && (
                <div>
                  <SearchableSelect
                    id="universityId"
                    name="universityId"
                    value={formData.universityId}
                    onChange={(value: string) => setFormData({ ...formData, universityId: value })}
                    label="الجامعة"
                    required
                    placeholder="اختر جامعتك"
                    options={universities.map((uni) => ({
                      value: uni.university_id.toString(),
                      label: uni.university_name,
                    }))}
                  />
                </div>
              )}

              {getFieldsToShow().showFaculty && (
                <div>
                  <SearchableSelect
                    id="facultyId"
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={(value: string) => setFormData({ ...formData, facultyId: value })}
                    label="الكلية"
                    required
                    placeholder="اختر كليتك"
                    options={faculties.map((faculty) => ({
                      value: faculty.faculty_id.toString(),
                      label: faculty.faculty_name,
                    }))}
                    disabled={!formData.universityId || faculties.length === 0}
                  />
                  {!formData.universityId && (
                    <p className="text-sm text-gray-500 mt-1">الرجاء اختيار الجامعة أولاً</p>
                  )}
                  {formData.universityId && faculties.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">لا توجد كليات متاحة لهذه الجامعة</p>
                  )}
                </div>
              )}

              {getFieldsToShow().showDepartment && (
                <div>
                  <SearchableSelect
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={(value: string) => setFormData({ ...formData, department: value })}
                    label="القسم"
                    required
                    placeholder="اختر قسمك"
                    options={programs.map((program) => ({
                      value: program.program_id.toString(),
                      label: program.program_name,
                    }))}
                    disabled={!formData.facultyId || programs.length === 0}
                  />
                  {!formData.facultyId && (
                    <p className="text-sm text-gray-500 mt-1">الرجاء اختيار الكلية أولاً</p>
                  )}
                  {formData.facultyId && programs.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">لا توجد أقسام متاحة لهذه الكلية</p>
                  )}
                </div>
              )}

              {getFieldsToShow().showLevel && (
                <div>
                  <SearchableSelect
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={(value: string) => setFormData({ ...formData, level: value })}
                    label="الفرقة"
                    required
                    placeholder="اختر الفرقة"
                    options={[
                      { value: "1", label: "الفرقة الإعدادية" },
                      { value: "2", label: "الفرقة الأولى" },
                      { value: "3", label: "الفرقة الثانية" },
                      { value: "4", label: "الفرقة الثالثة" },
                      { value: "5", label: "الفرقة الرابعة" },
                      { value: "6", label: "الفرقة الخامسة" },
                    ]}
                  />
                </div>
              )}

              <div className="flex justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  السابق
                </button>
                
                {getFieldsToShow().maxSteps === 2 ? (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    التالي
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">تكملة البيانات الأكاديمية</h2>
              
              {/* Standard Selection - Only for طالب بكالوريوس */}
              {getFieldsToShow().showStandard && (
                <div>
                  <SearchableSelect
                    id="standardId"
                    name="standardId"
                    value={formData.standardId}
                    onChange={(value: string) => setFormData({ ...formData, standardId: value })}
                    label="اختيار المعيار المطلوب تحقيقه"
                    required
                    placeholder="اختر المعيار المطلوب تحقيقه"
                    options={[
                      { value: "1", label: "المعيار الأول: الرؤية والرسالة" },
                      { value: "2", label: "المعيار الثاني: القيادة والحوكمة" },
                      { value: "3", label: "المعيار الثالث: أعضاء هيئة التدريس" },
                      { value: "4", label: "المعيار الرابع: الموارد المادية والمالية" },
                      { value: "5", label: "المعيار الخامس: المعايير الأكاديمية" },
                      { value: "6", label: "المعيار السادس: البرامج التعليمية" },
                      { value: "7", label: "المعيار السابع: التدريس والتعلم" },
                      { value: "8", label: "المعيار الثامن: الطلاب والخريجون" },
                      { value: "9", label: "المعيار التاسع: البحث العلمي والأنشطة العلمية" },
                      { value: "10", label: "المعيار العاشر: الدراسات العليا" },
                      { value: "11", label: "المعيار الحادي عشر: التقييم المستمر" },
                    ]}
                  />
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">مراجعة البيانات</h3>

              {/* Review Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info Card */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900">المعلومات الشخصية</h4>
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                    >
                      تعديل
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الاسم الكامل</span>
                      <span className="font-medium text-gray-900">{formData.fullName || "فاطمة علي"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني</span>
                      <span className="font-medium text-gray-900 text-left" dir="ltr">{formData.email || "fatma.business@gmail.com"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم الهاتف</span>
                      <span className="font-medium text-gray-900" dir="ltr">{formData.phone || "01112345678"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الرقم القومي</span>
                      <span className="font-medium text-gray-900" dir="ltr">{formData.nationalId || "30000000555000884"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الجنس</span>
                      <span className="font-medium text-gray-900">{formData.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Info Card */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900">المعلومات الأكاديمية</h4>
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                    >
                      تعديل
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الجامعة</span>
                      <span className="font-medium text-gray-900">جامعة القاهرة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الكلية</span>
                      <span className="font-medium text-gray-900">كلية الشريعة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">نوع المستخدم</span>
                      <span className="font-medium text-gray-900">طالب</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">القسم الدراسية</span>
                      <span className="font-medium text-gray-900">الثانية</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  السابق
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
