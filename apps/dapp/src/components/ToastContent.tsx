import { Spinner } from "./Spinner";
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { ReactNode } from "react";
import toast, { Toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "pending";

const TypeIcon = ({ type }: { type?: ToastType }) => {
  switch (type) {
    case "error":
      return (
        <div className="flex flex-col justify-center items-center w-10 h-10">
          <XCircleIcon className="h-10 w-10 text-white" />
        </div>
      );
    case "success":
      return (
        <div className="flex flex-col justify-center items-center w-10 h-10">
          <CheckCircleIcon className="h-10 w-10 text-white" />
        </div>
      );
    case "loading":
    case "pending":
      return (
        <div className="flex flex-col justify-center items-center w-10 h-10">
          <Spinner className="h-8 w-8 text-white" />
        </div>
      );
    default:
      return null;
  }
};

export type ToastProps = {
  title: ReactNode;
  description?: ReactNode;
  type?: ToastType;
};

export type ToastContentProps = ToastProps & {
  t: Toast;
};

export const ToastContent = ({
  t,
  title,
  description,
  type,
}: ToastContentProps) => {
  return (
    <div
      className={clsx(
        t.visible ? "animate-enter" : "animate-leave",
        `w-80 p-2 px-2 gap-2 items-center max-w-md rounded-lg pointer-events-auto flex ring-1 ring-white ring-opacity-10 transition-colors duration-500 shadow-2xl `,
        type === "error" && "bg-red-700",
        type === "success" && "bg-green-700",
        type === "pending" && "bg-teal-700",
        type === "loading" && "bg-sky-700"
      )}
    >
      <div>
        <TypeIcon type={type} />
      </div>
      <div className="grow flex flex-col justify-center ">
        <div className="text-base font-bold text-white">{title}</div>
        {description && (
          <div className="text-sm text-zinc-100 font-medium">{description}</div>
        )}
      </div>
      <button
        onClick={() => toast.remove(t.id)}
        className="text-white outline-none"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};
