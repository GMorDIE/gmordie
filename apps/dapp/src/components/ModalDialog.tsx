import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, ReactNode, useCallback } from "react";

type ModalDialog = {
  isOpen: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose?: () => void;
};

export const ModalDialog: FC<ModalDialog> = ({
  isOpen,
  title,
  children,
  onClose,
}) => {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog open onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className=" z-20 fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className=" z-30 fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="space-y-4 w-full max-w-sm overflow-hidden rounded-md bg-background p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6">
                  {title}
                </Dialog.Title>
                <div className="text-sm">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
