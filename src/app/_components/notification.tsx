"use client";

import { useEffect } from "react";

export interface NotificationProps {
  show: boolean;
  onClose: () => void;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  description?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const iconMap = {
  success: (
    <svg
      className="h-6 w-6 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-6 w-6 text-red-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="h-6 w-6 text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  ),
  info: (
    <svg
      className="h-6 w-6 text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const colorMap = {
  success: {
    border: "border-emerald-500",
    bg: "bg-white",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    descriptionColor: "text-gray-500",
  },
  error: {
    border: "border-red-500",
    bg: "bg-white",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    descriptionColor: "text-gray-500",
  },
  warning: {
    border: "border-yellow-500",
    bg: "bg-white",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    descriptionColor: "text-gray-500",
  },
  info: {
    border: "border-blue-500",
    bg: "bg-white",
    titleColor: "text-gray-900",
    messageColor: "text-gray-600",
    descriptionColor: "text-gray-500",
  },
};

export default function Notification({
  show,
  onClose,
  type = "success",
  title,
  message,
  description,
  autoClose = true,
  autoCloseDelay = 5000,
}: NotificationProps) {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, autoCloseDelay, onClose]);

  if (!show) return null;

  const colors = colorMap[type];
  const icon = iconMap[type];

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in-right">
      <div
        className={`${colors.bg} border-l-4 ${colors.border} rounded-lg shadow-xl p-4`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-semibold ${colors.titleColor}`}>
              {title}
            </p>
            <p className={`mt-1 text-sm ${colors.messageColor}`}>{message}</p>
            {description && (
              <p className={`mt-2 text-xs ${colors.descriptionColor}`}>
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}