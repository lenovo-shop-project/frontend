export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationPayload {
  message: string;
  type?: NotificationType;
}

export interface ConfirmPayload {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  resolve: (value: boolean) => void;
}

export const showNotification = (
  message: string,
  type: NotificationType = "info"
) => {
  window.dispatchEvent(
    new CustomEvent<NotificationPayload>("app-notification", {
      detail: {
        message,
        type,
      },
    })
  );
};

export const showConfirm = (
  message: string,
  title = "Підтвердження",
  confirmText = "Так",
  cancelText = "Скасувати"
): Promise<boolean> => {
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent<ConfirmPayload>("app-confirm", {
        detail: {
          message,
          title,
          confirmText,
          cancelText,
          resolve,
        },
      })
    );
  });
};