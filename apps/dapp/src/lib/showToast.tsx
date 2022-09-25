import { ToastContent, ToastProps } from "../components/ToastContent";
import toast, { Toast } from "react-hot-toast";

type ToastOptions = Partial<
  Pick<
    Toast,
    | "id"
    | "icon"
    | "duration"
    | "ariaProps"
    | "className"
    | "style"
    | "position"
    | "iconTheme"
  >
>;

export const showToast = (props: ToastProps, options: ToastOptions = {}) => {
  return toast.custom((t) => <ToastContent t={t} {...props} />, options);
};
