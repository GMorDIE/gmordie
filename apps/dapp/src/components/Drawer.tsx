import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { default as clsx } from "clsx";
import { ReactNode } from "react";

type DrawerProps = {
  show?: boolean;
  onDismiss?: () => void;
  title?: string;
  children: ReactNode;
  lightDismiss?: boolean;
};

export const Drawer = ({
  show = false,
  children,
  title,
  onDismiss,
  lightDismiss,
}: DrawerProps) => {
  return (
    <Transition show={show}>
      {/* Background overlay */}
      {lightDismiss && (
        <Transition.Child
          data-testid="sidepanel-overlay"
          className={clsx(
            "fixed z-40 top-0 left-0 w-full h-full bg-zinc-900 bg-opacity-50",
            onDismiss ? "cursor-pointer" : ""
          )}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          onClick={onDismiss}
        ></Transition.Child>
      )}

      {/* Sliding sidebar */}
      <Transition.Child
        data-testid="sidepanel-panel"
        className="z-50 max-w-[100vw] shadow-2xl fixed top-0 right-0 h-screen bg-zinc-800 flex flex-col w-full sm:w-96"
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="flex w-full h-12 bg-zinc-900 text-white">
          <div className="flex-grow pl-4 pr-1 flex w-full items-center">
            <h3 data-testid="sidepanel-title" className="text-xl grow">
              {title}
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="transition h-10 p-2 bg-opacity-0 hover:bg-opacity-20 active:bg-opacity-20"
              >
                <XIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
        <div className="flex-grow overflow-y-hidden text-base font-normal text-zinc-200">
          {children}
        </div>
      </Transition.Child>
    </Transition>
  );
};
