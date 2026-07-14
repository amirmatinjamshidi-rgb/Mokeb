"use client";

import { forwardRef } from "react";
import { Droplets } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { BLOOD_TYPE_OPTIONS } from "@/features/shared/constants/bloodTypes";
import { cn } from "@/features/shared/lib/utils";

export type BloodTypeSelectProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  /** When true, first option is empty placeholder. */
  allowEmpty?: boolean;
  emptyLabel?: string;
};

export const BloodTypeSelect = forwardRef<
  HTMLSelectElement,
  BloodTypeSelectProps
>(function BloodTypeSelect(
  {
    value,
    onChange,
    onBlur,
    name,
    error,
    disabled,
    className,
    allowEmpty = false,
    emptyLabel = "انتخاب گروه خونی",
  },
  ref,
) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="flex items-center gap-2 text-right text-xs text-[#6B8079]">
        <Droplets className="size-3.5" aria-hidden />
        گروه خونی
      </span>
      <select
        ref={ref}
        name={name}
        value={value}
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-14 w-full rounded-xl border border-[#FAFAFA] bg-white px-4 text-sm text-[#1F2937] shadow-md shadow-gray-300 outline-none focus:border-amber-500",
          error && "border-[#D22B23]",
          disabled && "opacity-60",
        )}
      >
        {allowEmpty ? (
          <option value="">{emptyLabel}</option>
        ) : null}
        {BLOOD_TYPE_OPTIONS.map((bt) => (
          <option key={bt} value={bt}>
            {bt}
          </option>
        ))}
      </select>
    </label>
  );
});

BloodTypeSelect.displayName = "BloodTypeSelect";

type FormBloodTypeSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  disabled?: boolean;
  allowEmpty?: boolean;
  className?: string;
};

export function FormBloodTypeSelect<T extends FieldValues>({
  name,
  control,
  disabled,
  allowEmpty = true,
  className,
}: FormBloodTypeSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("w-full", className)}>
          <BloodTypeSelect
            name={field.name}
            value={String(field.value ?? "")}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            error={!!fieldState.error}
            disabled={disabled}
            allowEmpty={allowEmpty}
          />
          {fieldState.error?.message ? (
            <p className="mt-1.5 text-right text-xs text-red-600">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
