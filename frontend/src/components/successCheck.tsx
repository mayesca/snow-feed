import React, { useEffect } from "react";

interface SuccessCheckProps {
  onComplete: () => void;
}

export const SuccessCheck: React.FC<SuccessCheckProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500); // Disappear after 1.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="animate-fade-out animate-bounce">
        <div className="bg-green-100 rounded-full p-4">
          <svg
            className="w-16 h-16 text-green-500 animate-check"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
