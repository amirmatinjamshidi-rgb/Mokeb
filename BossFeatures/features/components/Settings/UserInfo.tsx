import React from "react";
import { cn } from "@/boss-features/lib/utils";
import Document from "@/public/document.png";
import { SquareCheck } from "lucide-react";
import Image from "next/image";
import { SETTINGS_SECTION_BOX_CLASS } from "@/boss-features/components/Settings/BOX-CLASSES/settingsSectionBox";

type Props = {
  className?: string;
};
export default function UserInfo({ className }: Props) {
  return (
    <div className={cn(SETTINGS_SECTION_BOX_CLASS, className)}>
      <div className="flex flex-row items-center gap-2">
        <Image src={Document} alt="document" width={20} height={20} />
        <p className="text-lg font-medium text-gray-500 ">اطلاعات ورود </p>
      </div>
      <div className="flex w-full flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-26.75 text-gray-500 w-full max-w-109.75 h-full max-h-10">
          <p>شماره موبایل اصلی:</p>
          <p>09123456789</p>
        </div>
        <div className="flex flex-row items-center gap-26.75 text-gray-500 w-full max-w-109.75 h-full max-h-10">
          <p>وضعیت حساب :</p>
          <p className="flex flex-row items-center gap-2">
            <SquareCheck className="size-4" stroke="#23D283" />
            <span className="text-sm font-medium text-[#23D283]">فعال</span>
          </p>
        </div>
      </div>
      <button
        dir="rtl"
        className="flex h-14.5 w-full max-w-99.5 self-end items-center justify-center gap-2 rounded-xl border border-[#175E47] text-sm font-medium text-[#175E47]"
      >
        تغییر شماره ورود
      </button>
    </div>
  );
}
