import { toast } from 'react-toastify';

const showSuccess = (message: string) => {
  toast.success(message);
};

const showError = (message: string) => {
  toast.error(message);
};

const showInfo = (message: string) => {
  toast.info(message);
};

const showWarning = (message: string) => {
  toast.warning(message);
};

export const Toast = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
};
