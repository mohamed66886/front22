import React, { useState } from "react";
import Modal from "./Modal";
import OptionCard from "./OptionCard";

interface ExampleModalUsageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExampleModalUsage({
  isOpen,
  onClose,
}: ExampleModalUsageProps) {
  const [selectedOption, setSelectedOption] = useState<string>("program-based");

  const handleContinue = () => {
    console.log("Selected option:", selectedOption);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="قبل إنشاء مهمة جديدة!"
      subtitle="فضلاً، اختر نموذج المهمة المطلوب للبدء في تعبئة البيانات:"
      maxWidth="max-w-4xl"
    >
      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <OptionCard
          title="نموذج البرامج الأكاديمية"
          subtitle="(Program-Based)"
          selected={selectedOption === "program-based"}
          onClick={() => setSelectedOption("program-based")}
          variant="primary"
        />
        <OptionCard
          title="نموذج المؤسسة"
          subtitle="(Institutional-Based)"
          selected={selectedOption === "institutional-based"}
          onClick={() => setSelectedOption("institutional-based")}
          variant="secondary"
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
        style={{
          background: "#10B981",
          color: "#FFF",
          fontFamily: '"Noto Kufi Arabic"',
        }}
      >
        متابعة
      </button>
    </Modal>
  );
}
