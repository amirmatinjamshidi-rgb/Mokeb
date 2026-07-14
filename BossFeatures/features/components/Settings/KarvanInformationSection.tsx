"use client";

import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { MapPin, Phone, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { INFORMATION_SECTION_BOX_CLASS } from "@/boss-features/components/Settings/BOX-CLASSES/Informationbox";
import {
  karvanInformationDefaultValues,
  karvanInformationSchema,
  type KarvanInformationFormValues,
} from "@/boss-features/components/Settings/karvanInformationSchema";
import { cn } from "@/boss-features/lib/utils";
import { colors } from "@/boss-features/reservation/tokens";
import FormTextInput from "../FormTextInput";

const radioGreenSx = {
  padding: "6px",
  color: colors.neutral04,
  "&.Mui-checked": { color: colors.primary08 },
  "&.Mui-disabled": { color: colors.neutral04, opacity: 0.45 },
} as const;

type Props = {
  className?: string;
  disabled?: boolean;
};

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <p className="shrink-0 text-sm font-medium text-gray-700 sm:w-36">
        {label}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function KarvanInformationSection({
  className,
  disabled = false,
}: Props) {
  const { control } = useForm<KarvanInformationFormValues>({
    resolver: zodResolver(karvanInformationSchema),
    defaultValues: karvanInformationDefaultValues,
    mode: "onChange",
  });

  return (
    <div className={cn(INFORMATION_SECTION_BOX_CLASS, className)} dir="rtl">
      <FieldRow label="نام کاروان">
        <FormTextInput
          name="caravanName"
          control={control}
          placeholder="نام کاروان"
          rightIcon={User}
          disabled={disabled}
          valueFilter="noDigits"
        />
      </FieldRow>

      <FieldRow label="نام مسئول کاروان">
        <FormTextInput
          name="supervisorName"
          control={control}
          placeholder="نام و نام خانوادگی"
          rightIcon={User}
          disabled={disabled}
          valueFilter="noDigits"
        />
      </FieldRow>

      <FieldRow label="شماره موبایل">
        <FormTextInput
          name="mobile"
          control={control}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          rightIcon={Phone}
          disabled={disabled}
          valueFilter="digits"
          maxLength={11}
        />
      </FieldRow>

      <FieldRow label="تلفن ثابت">
        <FormTextInput
          name="landline"
          control={control}
          placeholder="اختیاری"
          rightIcon={Phone}
          disabled={disabled}
          required={false}
          showMandatory={false}
          valueFilter="digits"
        />
      </FieldRow>

      <FieldRow label="نشانی">
        <FormTextInput
          name="address"
          control={control}
          placeholder="آدرس کامل"
          rightIcon={MapPin}
          disabled={disabled}
          valueFilter="none"
        />
      </FieldRow>

      <FieldRow label="جنسیت">
        <Controller
          name="gender"
          control={control}
          render={({ field: f, fieldState }) => (
            <div className="w-full">
              <div
                className={cn(
                  "flex h-14 items-center justify-end rounded-2xl  px-4 ",
                  fieldState.error && "border-red-500 ring-1 ring-red-500",
                )}
              >
                <RadioGroup
                  row
                  name={f.name}
                  onBlur={f.onBlur}
                  onChange={(e) => f.onChange(e.target.value)}
                  ref={f.ref}
                  value={
                    f.value === "female" || f.value === "mixed"
                      ? f.value
                      : "male"
                  }
                >
                  <FormControlLabel
                    value="male"
                    control={
                      <Radio
                        size="small"
                        disabled={disabled}
                        sx={radioGreenSx}
                      />
                    }
                    label="مرد"
                    sx={{
                      marginInlineEnd: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                        color: colors.neutral08,
                      },
                    }}
                  />
                  <FormControlLabel
                    value="female"
                    control={
                      <Radio
                        size="small"
                        disabled={disabled}
                        sx={radioGreenSx}
                      />
                    }
                    label="زن"
                    sx={{
                      marginInlineEnd: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                        color: colors.neutral08,
                      },
                    }}
                  />
                  <FormControlLabel
                    value="mixed"
                    control={
                      <Radio
                        size="small"
                        disabled={disabled}
                        sx={radioGreenSx}
                      />
                    }
                    label="مختلط"
                    sx={{
                      marginInlineEnd: 0,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                        color: colors.neutral08,
                      },
                    }}
                  />
                </RadioGroup>
              </div>
              {fieldState.error?.message ? (
                <p className="mt-1 text-xs text-red-500">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </FieldRow>
    </div>
  );
}
