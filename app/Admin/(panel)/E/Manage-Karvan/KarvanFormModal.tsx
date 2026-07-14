"use client";

import { CreditCard, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { BaseModal } from "@admin-kit/modals/BaseModal";
import FormTextInput from "@admin-kit/ui/FormTextInput";
import { cn } from "@admin-kit/shared/lib/utils";
import type { AdminUserRow } from "@admin-kit/api/hooks";

export type KarvanFormValues = {
  name: string;
  familyName: string;
  nationalCode: string;
  phoneNumber: string;
};

const defaultValues: KarvanFormValues = {
  name: "",
  familyName: "",
  nationalCode: "",
  phoneNumber: "",
};

type Props = {
  open: boolean;
  row: AdminUserRow | null;
  onClose: () => void;
  onSubmit: (values: KarvanFormValues) => void;
  isSubmitting?: boolean;
};

const ACTION_BTN_CLASS =
  "flex h-12 w-full flex-1 items-center justify-center rounded-lg border text-sm font-semibold transition-colors";

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
    <div className="flex w-full flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        className={cn(ACTION_BTN_CLASS, "border-[#175E47] bg-white text-[#175E47]")}
      >
        انصراف
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={cn(
          ACTION_BTN_CLASS,
          "border-[#175E47] bg-[#175E47] text-white disabled:opacity-60",
        )}
      >
        {submitLabel}
      </button>
    </div>
  );
}

export function KarvanFormModal({
  open,
  row,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const { control, handleSubmit, reset } = useForm<KarvanFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (row) {
      reset({
        name: row.firstName,
        familyName: row.lastName,
        nationalCode: row.nationalCode,
        phoneNumber: row.mobile,
      });
      return;
    }
    reset(defaultValues);
  }, [open, row, reset]);

  if (!open || !row) return null;

  return (
    <BaseModal
      open
      title="ویرایش اطلاعات کاروان"
      onClose={onClose}
      panelClassName="max-w-[560px]"
      footer={
        <ModalActions
          onClose={onClose}
          submitLabel={isSubmitting ? "در حال ذخیره…" : "ذخیره تغییرات"}
          disabled={isSubmitting}
          onSubmit={() => void handleSubmit(onSubmit)()}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <FormTextInput
          name="name"
          control={control}
          placeholder="نام"
          rightIcon={User}
          disabled={isSubmitting}
          valueFilter="noDigits"
          rules={{ required: "نام را وارد کنید" }}
        />
        <FormTextInput
          name="familyName"
          control={control}
          placeholder="نام خانوادگی"
          rightIcon={User}
          disabled={isSubmitting}
          valueFilter="noDigits"
          rules={{ required: "نام خانوادگی را وارد کنید" }}
        />
        <FormTextInput
          name="nationalCode"
          control={control}
          placeholder="کد ملی"
          rightIcon={CreditCard}
          disabled={isSubmitting}
          valueFilter="digits"
          maxLength={10}
          rules={{ required: "کد ملی را وارد کنید" }}
        />
        <FormTextInput
          name="phoneNumber"
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
    </BaseModal>
  );
}
