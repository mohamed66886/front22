import React from "react";

interface OptionCardProps {
  title: string;
  subtitle: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function OptionCard({
  title,
  subtitle,
  selected = false,
  onClick,
  variant = "secondary",
}: OptionCardProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-2xl transition-all text-center ${
        selected
          ? isPrimary
            ? "border-2"
            : "border-2"
          : "border-2 border-transparent hover:border-gray-200"
      }`}
      style={{
        background: selected
          ? isPrimary
            ? "#E3F2FD"
            : "#F5F5F5"
          : "#FAFAFA",
        borderColor: selected
          ? isPrimary
            ? "#4A7DD9"
            : "#E9EAEB"
          : "transparent",
      }}
    >
      <h3
        className="text-lg lg:text-xl font-bold mb-2"
        style={{
          color: selected && isPrimary ? "#4A7DD9" : "#2E327A",
          fontFamily: '"Noto Kufi Arabic"',
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm lg:text-base"
        style={{
          color: "#717680",
          fontFamily: '"Noto Kufi Arabic"',
        }}
      >
        {subtitle}
      </p>
    </button>
  );
}
