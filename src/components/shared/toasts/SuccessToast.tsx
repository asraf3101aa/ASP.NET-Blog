import { toast } from "react-toastify";
import styles from "@/style.module.css";
import { ToastCloseButton } from "./ToastCloseButton";

interface ToastMessage {
  Message: string;
}

export const SuccessToast = ({ Message }: ToastMessage) => {
  toast.success(Message, {
    className: styles.toastSuccess,
    closeButton: ToastCloseButton,
    icon: () => <img src="/assets/icons/Tick.svg" />,
    progressStyle: { background: "#35D797" },
  });
};
