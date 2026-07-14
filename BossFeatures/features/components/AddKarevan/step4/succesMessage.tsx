"use client";

import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { cn } from "@/boss-features/lib/utils";

type Props = {
  className?: string;

  reserveCode?: string;
};

const FALLBACK_RESERVE_CODE = "TRK-9876";

export function ReserveSuccessMessage({
  className,
  reserveCode = FALLBACK_RESERVE_CODE,
}: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!reserveCode) return;
    navigator.clipboard.writeText(reserveCode).then(() => {
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div
      dir="rtl"
      className={cn(
        "mx-auto flex w-full max-w-form-row min-h-[190px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-[#E5E7EB] bg-green-100 px-4 py-6 sm:gap-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      <CheckCircleOutlineIcon
        sx={{ fontSize: 40, color: "#2EDC8D" }}
        className="shrink-0"
      />

      <span className="text-lg font-bold text-[#2EDC8D] md:text-xl">
        رزرو شما با موفقیت انجام شد.
      </span>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        <span className="whitespace-nowrap text-sm font-medium text-gray-700 md:text-base">
          کد رزرو : {reserveCode}
        </span>

        <button
          onClick={handleCopy}
          className="flex shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-[#2EDC8D] focus:outline-none"
          title="کپی کد رزرو"
          type="button"
        >
          {isCopied ? (
            <CheckIcon sx={{ fontSize: 20, color: "#2EDC8D" }} />
          ) : (
            <ContentCopyIcon sx={{ fontSize: 20 }} />
          )}
        </button>
      </div>
    </div>
  );
}
