"use client";

import { ChevronUp } from "lucide-react";
import { cn } from "@/features/shared/lib/utils";
import { colors } from "../tokens";

type Props = {
  className?: string;
};

export function ScrollToTopButton({ className }: Props) {
  return (
    <button
      type="button"
      aria-label="بازگشت به بالا"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      // style={{
      //   width: 56,
      //   height: 56,
      //   borderRadius: "9999px",
      //   backgroundColor: colors.warning05,
      //   boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
      // }}
      className={cn(
        "flex items-center justify-center text-[#2D2D2D] transition hover:brightness-95 w-14 h-14 rounded-2xl border-3 border-[#f0c434] ",
        className,
      )}
    >
      <ChevronUp className="size-6" strokeWidth={4} stroke="#f0c434" />
    </button>
  );
}
