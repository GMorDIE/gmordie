import { ReactComponent as Spinner } from "../assets/spinner.svg";
import { XIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import toast, { Toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

const TypeIcon = ({ type }: { type?: ToastType }) => {
  switch (type) {
    case "error":
      return (
        <div className="flex flex-col justify-center items-center">
          <XCircleIcon className="h-10 w-10 text-white" />
        </div>
      );
    case "success":
      return (
        <div className="flex flex-col justify-center items-center">
          <CheckCircleIcon className="h-10 w-10 text-white" />
        </div>
      );

    case "loading":
      return (
        <div className="flex flex-col justify-center items-center">
          <Spinner />
        </div>
      );
    default:
      return null;
  }
};

type ToastProps = {
  t: Toast;
  title: string;
  description?: string;
  type?: ToastType;
};

export const ToastContent = ({ t, title, description, type }: ToastProps) => {
  return (
    <div
      className={clsx(
        t.visible ? "animate-enter" : "animate-leave",
        `w-80 max-w-md bg-salmon shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-white ring-opacity-10`,
        type === "error" && "bg-red-500",
        type === "success" && "bg-green-600"
      )}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex gap-3">
          <TypeIcon type={type} />
          <div className="grow">
            <p className="text-sm font-bold text-white">{title}</p>
            {description && (
              <p className="mt-1 text-sm text-zinc-100">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full  rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white outline-none"
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
