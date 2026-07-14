"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, SquareCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@admin-kit/shared/lib/utils";
import { SETTINGS_SECTION_BOX_CLASS } from "@admin-kit/settings/box-classes/settingsSectionBox";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@admin-kit/schemas/karvanInformationSchema";
import {
  useChangePrincipalPassword,
  usePrincipalSettingsProfile,
} from "@admin-kit/settings/usePrincipalSettings";

type Props = {
  className?: string;
  phone?: string;
};

export function UserInfo({ className, phone }: Props) {
  const { data, isLoading } = usePrincipalSettingsProfile();
  const changePassword = useChangePrincipalPassword();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const displayPhone = phone ?? data?.phone ?? "—";
  const isActive = data?.isActive ?? true;

  const { register, handleSubmit, reset, formState } =
    useForm<ChangePasswordFormValues>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setStatus(null);
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setStatus("رمز عبور با موفقیت تغییر کرد.");
      reset();
      setOpen(false);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "تغییر رمز ناموفق بود.");
    }
  };

  return (
    <div className={cn(SETTINGS_SECTION_BOX_CLASS, "gap-4", className)} dir="rtl">
      <div className="flex flex-row items-center gap-2">
        <FileText className="size-5 text-gray-500" aria-hidden />
        <p className="text-lg font-medium text-gray-500">اطلاعات ورود</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری…</p>
      ) : null}

      <div className="flex w-full flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex h-full max-h-10 w-full max-w-109.75 items-center gap-6 text-gray-500">
          <p>شماره موبایل اصلی:</p>
          <p dir="ltr">{displayPhone || "—"}</p>
        </div>
        <div className="flex h-full max-h-10 w-full max-w-109.75 flex-row items-center gap-6 text-gray-500">
          <p>وضعیت حساب :</p>
          <p className="flex flex-row items-center gap-2">
            <SquareCheck
              className="size-4"
              stroke={isActive ? "#23D283" : "#D22B23"}
            />
            <span
              className={cn(
                "text-sm font-medium",
                isActive ? "text-[#23D283]" : "text-[#D22B23]",
              )}
            >
              {isActive ? "فعال" : "غیرفعال"}
            </span>
          </p>
        </div>
      </div>

      {status ? (
        <p
          className={cn(
            "text-sm",
            status.includes("موفق") ? "text-[#175E47]" : "text-red-500",
          )}
        >
          {status}
        </p>
      ) : null}

      {!open ? (
        <button
          type="button"
          dir="rtl"
          onClick={() => {
            setStatus(null);
            setOpen(true);
          }}
          className="flex h-14.5 w-full max-w-99.5 items-center justify-center gap-2 self-end rounded-xl border border-[#175E47] text-sm font-medium text-[#175E47]"
        >
          تغییر رمز عبور
        </button>
      ) : (
        <form
          className="flex w-full max-w-99.5 flex-col gap-3 self-end"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <input
            type="password"
            placeholder="رمز فعلی"
            className="h-12 rounded-xl border border-gray-200 px-4 text-sm"
            {...register("currentPassword")}
          />
          {formState.errors.currentPassword ? (
            <p className="text-xs text-red-500">
              {formState.errors.currentPassword.message}
            </p>
          ) : null}
          <input
            type="password"
            placeholder="رمز جدید"
            className="h-12 rounded-xl border border-gray-200 px-4 text-sm"
            {...register("newPassword")}
          />
          {formState.errors.newPassword ? (
            <p className="text-xs text-red-500">
              {formState.errors.newPassword.message}
            </p>
          ) : null}
          <input
            type="password"
            placeholder="تکرار رمز جدید"
            className="h-12 rounded-xl border border-gray-200 px-4 text-sm"
            {...register("confirmPassword")}
          />
          {formState.errors.confirmPassword ? (
            <p className="text-xs text-red-500">
              {formState.errors.confirmPassword.message}
            </p>
          ) : null}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#175E47] text-sm font-medium text-white disabled:opacity-60"
            >
              {changePassword.isPending ? "در حال ذخیره…" : "ثبت رمز جدید"}
            </button>
            <button
              type="button"
              className="flex h-12 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              انصراف
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserInfo;
