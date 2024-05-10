import { toast } from "react-toastify";
import styles from "@/style.module.css";
import { ToastCloseButton } from "./ToastCloseButton";

interface InfoToastProps {
  Title: string;
  Body: string;
}

export const InfoToast = ({ Title, Body }: InfoToastProps) => {
  const Message = `${Title.toUpperCase()} | ${Body}`;
  toast.info(Message, {
    className: styles.toastSuccess,
    closeButton: ToastCloseButton,
    icon: () => <img src="/assets/icons/Info.svg" />,
    progressStyle: { background: "#1976d2" },
  });
};
