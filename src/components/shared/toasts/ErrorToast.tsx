import { toast } from "react-toastify";
import styles from "@/style.module.css";
import { ToastCloseButton } from "./ToastCloseButton";

interface ToastMessage {
  Message: string;
}

export const ErrorToast = ({ Message }: ToastMessage) => {
  toast.error(Message, {
    className: styles.toastError,
    closeButton: ToastCloseButton,
    icon: () => <img src="/assets/icons/Error.svg" />,
    progressStyle: { background: "#E72A11" },
  });
};
