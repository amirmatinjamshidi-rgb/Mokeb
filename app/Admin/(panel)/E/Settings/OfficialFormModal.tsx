"use client";

import { Phone, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import FormTextInput from "@admin-kit/ui/FormTextInput";
import { cn } from "@admin-kit/shared/lib/utils";
import type { AdminOfficialRow } from "@admin-kit/api/hooks";

import {
  SETTINGS_ACTION_BTN_CLASS,
} from "./settingsStyles";
import { SettingsModalShell } from "./SettingsModalShell";

export type OfficialFormValues = {
  firstName: string;
  lastName: string;
  mobile: string;
};

const defaultValues: OfficialFormValues = {
  firstName: "",
  lastName: "",
  mobile: "",
};

type AddProps = {
  mode: "add";
  open: boolean;
  onClose: () => void;
  onSubmit: (values: OfficialFormValues) => void;
  isSubmitting?: boolean;
};

type EditProps = {
  mode: "edit";
  open: boolean;
  row: AdminOfficialRow | null;
  onClose: () => void;
  onSubmit: (values: OfficialFormValues) => void;
  isSubmitting?: boolean;
};

type Props = AddProps | EditProps;

function ModalActions({
  onClose,
  submitLabel,
  onSubmit,
  disabled,
}: {
  onClose: () => void;
  submitLabel: string;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        className={cn(
          SETTINGS_ACTION_BTN_CLASS,
          "border-[#175E47] bg-white text-[#175E47]",
        )}
      >
        انصراف
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={cn(
          SETTINGS_ACTION_BTN_CLASS,
          "border-[#175E47] bg-[#175E47] text-white disabled:opacity-60",
        )}
      >
        {submitLabel}
      </button>
    </>
  );
}

export function OfficialFormModal(props: Props) {
  const { open, onClose, onSubmit, isSubmitting, mode } = props;
  const editRow = props.mode === "edit" ? props.row : null;
  const { control, handleSubmit, reset } = useForm<OfficialFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && editRow) {
      reset({
        firstName: editRow.firstName,
        lastName: editRow.lastName,
        mobile: editRow.mobile,
      });
      return;
    }
    reset(defaultValues);
  }, [open, mode, editRow, reset]);

  const title = mode === "add" ? "افزودن مسئول" : "ویرایش مسئول";
  const submitLabel = mode === "add" ? "افزودن" : "ذخیره";

  return (
    <SettingsModalShell
      open={open}
      title={title}
      onClose={onClose}
      className="max-w-[560px]"
      footer={
        <ModalActions
          onClose={onClose}
          submitLabel={isSubmitting ? "در حال ذخیره…" : submitLabel}
          disabled={isSubmitting}
          onSubmit={() => void handleSubmit(onSubmit)()}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <FormTextInput
          name="firstName"
          control={control}
          placeholder="نام"
          rightIcon={User}
          disabled={isSubmitting}
          valueFilter="noDigits"
          rules={{ required: "نام را وارد کنید" }}
        />
        <FormTextInput
          name="lastName"
          control={control}
          placeholder="نام خانوادگی"
          rightIcon={User}
          disabled={isSubmitting}
          valueFilter="noDigits"
          rules={{ required: "نام خانوادگی را وارد کنید" }}
        />
        <FormTextInput
          name="mobile"
          control={control}
          placeholder="شماره موبایل"
          rightIcon={Phone}
          disabled={isSubmitting}
          valueFilter="digits"
          maxLength={11}
          rules={{
            required: "شماره موبایل را وارد کنید",
            minLength: { value: 10, message: "شماره موبایل معتبر نیست" },
          }}
        />
      </div>
    </SettingsModalShell>
  );
}
