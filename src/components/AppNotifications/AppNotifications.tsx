import { useLayoutEffect, useRef, useState } from "react";

import "./AppNotifications.css";

import type {
  NotificationPayload,
  ConfirmPayload,
  NotificationType,
} from "../../utils/notifications";

interface ToastItem {
  id: number;
  message: string;
  type: NotificationType;
}

interface ConfirmState {
  message: string;
  title: string;
  confirmText: string;
  cancelText: string;
  resolve: (value: boolean) => void;
}

const getNotificationType = (message: string): NotificationType => {
  const text = message.toLowerCase();

  if (
    text.includes("не вдалося") ||
    text.includes("помилка") ||
    text.includes("закінчилась") ||
    text.includes("не відповідає") ||
    text.includes("немає")
  ) {
    return "error";
  }

  if (
    text.includes("введіть") ||
    text.includes("оберіть") ||
    text.includes("увійдіть") ||
    text.includes("напишіть")
  ) {
    return "warning";
  }

  if (
    text.includes("успіш") ||
    text.includes("додано") ||
    text.includes("оновлено") ||
    text.includes("оформлено") ||
    text.includes("оплачено") ||
    text.includes("скасовано") ||
    text.includes("видалено") ||
    text.includes("активовано") ||
    text.includes("деактивовано")
  ) {
    return "success";
  }

  return "info";
};

const AppNotifications = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmData, setConfirmData] = useState<ConfirmState | null>(null);
  const toastId = useRef(1);

  const addToast = (message: string, type?: NotificationType) => {
    const trimmedMessage = String(message || "Повідомлення").trim();
    const id = toastId.current++;

    setToasts((prev) => [
      ...prev,
      {
        id,
        message: trimmedMessage,
        type: type || getNotificationType(trimmedMessage),
      },
    ]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3500);
  };

  useLayoutEffect(() => {
    const nativeAlert = window.alert;

    window.alert = (message?: unknown) => {
      addToast(String(message || "Повідомлення"));
    };

    const notificationListener = (event: Event) => {
      const { message, type } = (event as CustomEvent<NotificationPayload>).detail;
      addToast(message, type);
    };

    const confirmListener = (event: Event) => {
      const detail = (event as CustomEvent<ConfirmPayload>).detail;

      setConfirmData({
        message: detail.message,
        title: detail.title || "Підтвердження",
        confirmText: detail.confirmText || "Так",
        cancelText: detail.cancelText || "Скасувати",
        resolve: detail.resolve,
      });
    };

    window.addEventListener("app-notification", notificationListener);
    window.addEventListener("app-confirm", confirmListener);

    return () => {
      window.alert = nativeAlert;
      window.removeEventListener("app-notification", notificationListener);
      window.removeEventListener("app-confirm", confirmListener);
    };
  }, []);

  const closeConfirm = (value: boolean) => {
    if (!confirmData) return;

    confirmData.resolve(value);
    setConfirmData(null);
  };

  return (
    <>
      <div className="app-toast-list">
        {toasts.map((toast) => (
          <div
            className={`app-toast app-toast-${toast.type}`}
            key={toast.id}
          >
            <button
              className="app-toast-close"
              onClick={() =>
                setToasts((prev) => prev.filter((item) => item.id !== toast.id))
              }
            >
              ×
            </button>

            <div className="app-toast-title">
              {toast.type === "success" && "Готово"}
              {toast.type === "error" && "Помилка"}
              {toast.type === "warning" && "Увага"}
              {toast.type === "info" && "Повідомлення"}
            </div>

            <div className="app-toast-message">{toast.message}</div>
          </div>
        ))}
      </div>

      {confirmData && (
        <div className="app-confirm-overlay">
          <div className="app-confirm-window">
            <button
              className="app-confirm-close"
              onClick={() => closeConfirm(false)}
            >
              ×
            </button>

            <h3>{confirmData.title}</h3>
            <p>{confirmData.message}</p>

            <div className="app-confirm-actions">
              <button
                className="app-confirm-cancel"
                onClick={() => closeConfirm(false)}
              >
                {confirmData.cancelText}
              </button>

              <button
                className="app-confirm-ok"
                onClick={() => closeConfirm(true)}
              >
                {confirmData.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppNotifications;
