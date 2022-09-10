import { Spinner } from "./Spinner";
import { XIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { ReactNode } from "react";
import toast, { Toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

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
        `w-80 p-2 px-2 gap-2 items-center max-w-md shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-white ring-opacity-10`,
        type === "error" && "bg-red-600",
        type === "success" && "bg-green-600",
        type === "loading" && "bg-salmon-800"
      )}
    >
      <div>
        <TypeIcon type={type} />
      </div>
      <div className="grow flex flex-col justify-center ">
        <div className="text-sm font-bold text-white">{title}</div>
        {description && (
          <div className="text-xs text-zinc-100">{description}</div>
        )}
      </div>
      <button
        onClick={() => toast.remove(t.id)}
        className="text-white outline-none"
      >
        <XIcon className="h-6 w-6" />
      </button>
    </div>
  );
};
