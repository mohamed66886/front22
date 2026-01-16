import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn"
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(2px);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      <div
        className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full relative"
        style={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          animation: "slideUp 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 p-0 hover:opacity-80 hover:rotate-90 transition-all duration-300 cursor-pointer"
          aria-label="إغلاق"
          disabled={isDeleting}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C62828"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center animate-pulse"
            style={{
              background: "#FEE2E2",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C62828"
              strokeWidth="2"
              className="sm:w-10 sm:h-10 animate-bounce"
              style={{
                animationDuration: "1s",
              }}
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-3"
          style={{
            color: "#2E327A",
            fontFamily: '"Noto Kufi Arabic"',
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <p
          className="text-center mb-6 sm:mb-7 text-sm sm:text-base"
          style={{
            color: "#717680",
            fontFamily: '"Noto Kufi Arabic"',
            lineHeight: "1.7",
          }}
        >
          {message}{" "}
          {itemName && (
            <span
              style={{
                color: "#2E327A",
                fontWeight: 700,
              }}
            >
              &quot;{itemName}&quot;
            </span>
          )}
          ؟
          <br />
          لن تتمكن من التراجع عن هذا الإجراء.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base font-semibold cursor-pointer active:scale-95"
            style={{
              background: "#FFF",
              border: "2px solid #E9EAEB",
              color: "#2E327A",
              fontFamily: '"Noto Kufi Arabic"',
            }}
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base font-semibold cursor-pointer active:scale-95"
            style={{
              background: "#C62828",
              color: "#FFF",
              fontFamily: '"Noto Kufi Arabic"',
            }}
          >
            {isDeleting ? (
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
                <span>جاري الحذف...</span>
              </>
            ) : (
              "تأكيد الحذف"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
