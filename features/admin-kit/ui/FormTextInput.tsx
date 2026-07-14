/* eslint-disable react-hooks/refs */
"use client";

import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { isControlledInputValid } from "../shared/lib/inputValidation";

import { cn } from "../shared/lib/utils";
import {
  filterPassportId,
  normalizeDigitsInput,
  stripDigitsFromText,
} from "../shared/lib/formInputFilters";
import { InputValidTick } from "./InputValidTick";

type ValueFilterKind = "none" | "digits" | "noDigits" | "passportId";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "type" | "defaultValue" | "onChange" | "value"
>;

type FormTextInputProps<T extends FieldValues> = NativeInputProps & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  placeholder: string;
  required?: boolean;
  label?: string;
  rightIcon?: LucideIcon;
  leftIcon?: LucideIcon;
  rightIconClassName?: string;
  leftIconClassName?: string;
  showLabel?: boolean;
  showMandatory?: boolean;
  showLabelInInput?: boolean;
  showIconL?: boolean;
  showIconR?: boolean;
  showLine?: boolean;
  showText?: boolean;
  text?: string;
  showText2?: boolean;
  text2?: string;
  showHelper?: boolean;
  helperText?: string;
  showCounter?: boolean;
  maxLength?: number;
  valueFilter?: ValueFilterKind;
  inputType?: InputHTMLAttributes<HTMLInputElement>["type"];
};

export default function FormTextInput<T extends FieldValues>({
  name,
  control,
  rules,
  placeholder,
  required = true,
  label,
  rightIcon: RightIcon,
  leftIcon: LeftIcon,
  rightIconClassName,
  leftIconClassName,
  showLabel = false,
  showMandatory = true,
  showLabelInInput = true,
  showIconL = false,
  showIconR = true,
  showLine = false,
  showText = false,
  text = "",
  showText2 = false,
  text2 = "",
  showHelper = false,
  helperText = "",
  showCounter = false,
  maxLength,
  valueFilter = "none",
  inputType: inputTypeProp,
  className,
  disabled,
  ...rest
}: FormTextInputProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      ...(required ? { required: "پر کردن این فیلد الزامی است" } : {}),
      ...rules,
    },
  });

  const value = String(field.value ?? "");
  const isValid = isControlledInputValid({
    value,
    fieldState,
    required,
  });
  const displayPlaceholder =
    showLabelInInput && showMandatory && required
      ? `${placeholder} *`
      : placeholder;

  const applyFilter = (raw: string) => {
    if (valueFilter === "digits") {
      let v = normalizeDigitsInput(raw);
      if (typeof maxLength === "number") v = v.slice(0, maxLength);
      return v;
    }
    if (valueFilter === "noDigits") return stripDigitsFromText(raw);
    if (valueFilter === "passportId") {
      let v = filterPassportId(raw);
      if (typeof maxLength === "number") v = v.slice(0, maxLength);
      return v;
    }
    return raw;
  };

  const inputType =
    inputTypeProp ?? (valueFilter === "digits" ? "tel" : "text");
  const inputMode =
    valueFilter === "digits"
      ? ("numeric" as const)
      : valueFilter === "passportId"
        ? ("text" as const)
        : undefined;

  return (
    <div className={cn("w-full min-w-0 max-w-full", className)}>
      {showLabel && label ? (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {showMandatory && required ? (
            <span className="mr-1 text-red-500">*</span>
          ) : null}
        </label>
      ) : null}

      <div
        dir="ltr"
        className={cn(
          "flex h-14 w-full items-center gap-2.5 rounded-2xl border border-gray-300 shadow-md shadow-gray-300 px-4",
          "bg-white",
          "transition-colors",
          fieldState.error
            ? "border-red-500 ring-1 ring-red-500"
            : isValid
              ? "border-[#175E47] ring-1 ring-[#175E47]/35"
              : "focus-within:border-[#DBBC59] focus-within:ring-1 focus-within:ring-[#DBBC59]",
          disabled ? "opacity-60" : "",
        )}
      >
        <InputValidTick show={isValid} />

        {showIconL && LeftIcon ? (
          <LeftIcon
            className={cn("h-5 w-5 shrink-0 text-[#61756F]", leftIconClassName)}
          />
        ) : null}

        <input
          {...rest}
          type={inputType}
          inputMode={inputMode}
          ref={field.ref}
          name={field.name}
          value={value}
          onChange={(e) => field.onChange(applyFilter(e.target.value))}
          onBlur={field.onBlur}
          disabled={disabled}
          maxLength={valueFilter === "digits" || valueFilter === "passportId" ? undefined : maxLength}
          placeholder={displayPlaceholder}
          className={cn(
            "h-full w-full bg-transparent outline-none",
            "text-right text-sm text-gray-500 placeholder:text-gray-400",
          )}
          dir="rtl"
        />

        {showIconR && RightIcon ? (
          <RightIcon
            className={cn(
              "h-5 w-5 shrink-0 text-[#61756F]",
              rightIconClassName,
            )}
          />
        ) : null}
      </div>

      {showLine ? <div className="mt-1 h-px w-full bg-[#DBBC59]" /> : null}

      {fieldState.error?.message ? (
        <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>
      ) : null}

      {showHelper && helperText ? (
        <p className="mt-1 text-xs text-[#61756F]">{helperText}</p>
      ) : null}

      {showCounter && typeof maxLength === "number" ? (
        <p className="mt-1 text-xs text-[#61756F]">
          {value.length}/{maxLength}
        </p>
      ) : null}

      {showText && text ? (
        <p className="mt-1 text-xs text-[#61756F]">{text}</p>
      ) : null}
      {showText2 && text2 ? (
        <p className="mt-1 text-xs text-[#61756F]">{text2}</p>
      ) : null}
    </div>
  );
}
