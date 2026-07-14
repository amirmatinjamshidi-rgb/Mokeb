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

export function SendSucces({
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
        "flex w-full min-h-[190px] flex-col items-center justify-center gap-4 rounded-3xl border-2 border-[#E5E7EB] bg-white px-4 py-3 sm:gap-3 sm:px-8 sm:py-4 shadow-lg shadow-gray-200",
        className,
      )}
    >
      <CheckCircleOutlineIcon
        sx={{ fontSize: 40, color: "#2EDC8D" }}
        className="shrink-0"
      />

      <span className="text-lg font-bold text-[#2EDC8D] md:text-xl">
      درخواست رزرو با موفقیت ارسال شد ..
      </span>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
    <span className="text-sm font-medium text-gray-400">
    پس از بررسی توسط موکب ، نتیجه از طریق پیامک و پنل کاربری به شما اطلاع خواهد شد.
    </span>
      </div>
    </div>
  );
}
