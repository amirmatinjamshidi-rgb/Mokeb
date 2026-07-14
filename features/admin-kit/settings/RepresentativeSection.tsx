"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { cn } from "@admin-kit/shared/lib/utils";
import { SETTINGS_SECTION_BOX_CLASS } from "@admin-kit/settings/box-classes/settingsSectionBox";
import FormTextInput from "@admin-kit/ui/FormTextInput";
import {
  representativeDefaultValues,
  representativeSchema,
  type RepresentativeFormValues,
} from "@admin-kit/schemas/karvanInformationSchema";
import {
  usePrincipalSettingsProfile,
  useSaveRepresentative,
} from "@admin-kit/settings/usePrincipalSettings";

type Props = {
  className?: string;
};

export default function RepresentativeSection({ className }: Props) {
  const { data, isLoading } = usePrincipalSettingsProfile();
  const save = useSaveRepresentative();
  const [status, setStatus] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<RepresentativeFormValues>({
    resolver: zodResolver(representativeSchema),
    defaultValues: representativeDefaultValues,
  });

  useEffect(() => {
    if (data?.representative) {
      reset({ ...representativeDefaultValues, ...data.representative });
    }
  }, [data?.representative, reset]);

  const onSubmit = async (values: RepresentativeFormValues) => {
    setStatus(null);
    try {
      await save.mutateAsync(values);
      setStatus("اطلاعات نماینده ذخیره شد.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "ذخیره ناموفق بود.");
    }
  };

  return (
    <form
      className={cn(
        SETTINGS_SECTION_BOX_CLASS,
        "gap-4 text-sm text-gray-500",
        className,
      )}
      dir="rtl"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex flex-row items-center gap-12">
        <p className="flex items-center gap-2 text-lg font-medium text-gray-500">
          <User className="size-5 shrink-0" aria-hidden />
          نماینده کاروان
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری…</p>
      ) : null}

      <div className="flex w-full flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex h-full max-h-10 w-full max-w-109.75 items-center gap-8 text-gray-500">
          <p className="w-21 shrink-0">نام نماینده</p>
          <FormTextInput
            name="fullName"
            control={control}
            placeholder="نام و نام خانوادگی"
            rightIcon={User}
            disabled={save.isPending}
            valueFilter="noDigits"
          />
        </div>
        <div className="flex h-full max-h-10 w-full max-w-109.75 flex-row items-center gap-8 text-gray-500">
          <p className="shrink-0">شماره موبایل</p>
          <FormTextInput
            name="mobile"
            control={control}
            placeholder="شماره موبایل"
            rightIcon={Phone}
            disabled={save.isPending}
            valueFilter="digits"
            maxLength={11}
          />
        </div>
      </div>

      {status ? (
        <p
          className={cn(
            "text-sm",
            status.includes("ذخیره شد") ? "text-[#175E47]" : "text-red-500",
          )}
        >
          {status}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={save.isPending}
        className="flex h-14.5 w-full max-w-99.5 items-center justify-center gap-2 self-end rounded-xl border border-[#175E47] bg-[#175E47] text-sm font-medium text-white disabled:opacity-60"
      >
        {save.isPending ? "در حال ذخیره…" : "ثبت اطلاعات کاربری"}
      </button>
    </form>
  );
}
