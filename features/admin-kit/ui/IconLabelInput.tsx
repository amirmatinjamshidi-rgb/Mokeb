"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";

import { cn } from "@admin-kit/shared/lib/utils";

export type IconLabelInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  icon: ReactNode;
  isValid?: boolean;
};

export const IconLabelInput = forwardRef<HTMLInputElement, IconLabelInputProps>(
  function IconLabelInput(
    { icon, isValid, className, dir = "rtl", ...rest },
    ref,
  ) {
    return (
      <div
        dir="ltr"
        className={cn(
          "flex h-14 w-full items-center gap-2.5 rounded-2xl border border-gray-300 bg-white px-4 shadow-md shadow-gray-300 transition-colors",
          className,
        )}
      >
        {isValid ? (
          <CircleCheck
            className="size-5 shrink-0 text-[#175E47]"
            stroke="#175E47"
            aria-hidden
          />
        ) : (
          <span className="size-5 shrink-0" aria-hidden />
        )}
        <input
          ref={ref}
          type="text"
          dir={dir}
          className="h-full min-w-0 flex-1 bg-transparent text-right text-sm text-gray-500 outline-none placeholder:text-gray-400"
          {...rest}
        />
        <span className="flex shrink-0 items-center text-[#61756F]">{icon}</span>
      </div>
    );
  },
);
