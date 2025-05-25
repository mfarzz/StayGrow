"use client";

import { useState, useCallback } from "react";

interface NotificationState {
  show: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  description?: string;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    title: "",
    message: "",
    description: "",
  });

  const showNotification = useCallback(
    (
      type: "success" | "error" | "warning" | "info",
      title: string,
      message: string,
      description?: string
    ) => {
      setNotification({
        show: true,
        type,
        title,
        message,
        description,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      show: false,
    }));
  }, []);

  const showSuccess = useCallback(
    (title: string, message: string, description?: string) => {
      showNotification("success", title, message, description);
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message: string, description?: string) => {
      showNotification("error", title, message, description);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, description?: string) => {
      showNotification("warning", title, message, description);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, description?: string) => {
      showNotification("info", title, message, description);
    },
    [showNotification]
  );

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}