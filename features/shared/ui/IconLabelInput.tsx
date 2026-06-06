"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/features/shared/lib/utils";
import { InputValidTick } from "@/features/shared/ui/InputValidTick";

export type IconLabelInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "size"
> & {
  // label: ReactNode;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  isValid?: boolean;
};

export const IconLabelInput = forwardRef<HTMLInputElement, IconLabelInputProps>(
  function IconLabelInput(
    {
      // label,
      icon,
      className,
      inputClassName,
      labelClassName,
      isValid = false,
      disabled,
      ...inputProps
    },
    ref,
  ) {
    return (
      <div
        dir="rtl"
        className={cn(
          "flex h-14 w-full min-w-0 items-center justify-between gap-3",
          "rounded-xl border border-[#FAFAFA] bg-white p-4 shadow-md shadow-gray-300",
          "focus-within:border-amber-500",
          "transition-colors",
          disabled && "opacity-60",
          className,
        )}
      >
        <div className="flex shrink-0 items-center gap-2">
          {icon && (
            <span
              className="flex shrink-0 text-[#61756F] [&_svg]:size-5"
              aria-hidden={typeof icon !== "string"}
            >
              {icon}
            </span>
          )}

          {/* <span
            className={cn(
              "whitespace-nowrap text-sm font-medium leading-none text-[#175E47]",
              labelClassName,
            )}
          >
            {label}
          </span> */}
        </div>

        <input
          ref={ref}
          disabled={disabled}
          className={cn(
            "min-w-0 flex-1 bg-transparent",
            "text-right text-sm text-[#1F2937]",
            "outline-none",
            "placeholder:text-[#61756F]",
            inputClassName,
          )}
          {...inputProps}
        />

        <InputValidTick show={isValid} />
      </div>
    );
  },
);

IconLabelInput.displayName = "IconLabelInput";
