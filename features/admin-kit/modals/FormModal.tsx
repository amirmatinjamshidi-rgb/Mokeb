"use client";

import type { ReactNode } from "react";

import Button from "@admin-kit/ui/Button";
import { BaseModal } from "@admin-kit/modals/BaseModal";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
};

/** Generic form modal — pass your RHF fields as `children`. */
export function FormModal({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = "ثبت",
  cancelLabel = "انصراف",
  isSubmitting = false,
}: Props) {
  return (
    <BaseModal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            color="white"
            border="gray"
            text="none"
            radius="md"
            size="md"
            width="auto"
            className="!text-gray-500"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            color="darkGreen"
            text="white"
            radius="md"
            border="none"
            size="md"
            width="auto"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {submitLabel}
          </Button>
        </div>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-6"
        noValidate
      >
        {children}
      </form>
    </BaseModal>
  );
}
