import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  subtitle?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-4xl",
  subtitle,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl w-full ${maxWidth} relative`}
        style={{
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-0 hover:opacity-80 transition-opacity z-10"
          aria-label="إغلاق"
        >
          <svg
            width="32"
            height="32"
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

        {/* Content */}
        <div className="px-8 py-8 lg:px-12 lg:py-12">
          {/* Title */}
          <h2
            className="text-2xl lg:text-3xl font-bold text-center mb-3"
            style={{
              color: "#2E327A",
              fontFamily: '"Noto Kufi Arabic"',
            }}
          >
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="text-center mb-8 text-base lg:text-lg"
              style={{
                color: "#717680",
                fontFamily: '"Noto Kufi Arabic"',
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Children */}
          {children}
        </div>
      </div>
    </div>
  );
}
