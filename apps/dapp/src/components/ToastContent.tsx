import { XIcon } from "@heroicons/react/solid";
import toast, { Toast } from "react-hot-toast";

type ToastProps = { t: Toast; title: string; description?: string };

export const ToastContent = ({ t, title, description }: ToastProps) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } w-72 max-w-md bg-salmon shadow-2xl rounded-lg pointer-events-auto flex ring-1 ring-white ring-opacity-10`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
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
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 text-white"
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
