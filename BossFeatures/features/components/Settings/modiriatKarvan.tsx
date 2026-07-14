import { cn } from "@/boss-features/lib/utils";
import { Phone, User } from "lucide-react";
import { SETTINGS_SECTION_BOX_CLASS } from "@/boss-features/components/Settings/BOX-CLASSES/settingsSectionBox";
import FormTextInput from "../FormTextInput";
import { useForm } from "react-hook-form";

type Props = {
  className?: string;
};
export default function ModiriatKarvan({ className }: Props) {
  return (
    <div
      className={cn(
        SETTINGS_SECTION_BOX_CLASS,
        "text-sm text-gray-500",
        className,
      )}
    >
      <div className="flex flex-row items-center gap-12">
        <p className="flex items-center gap-2 text-lg font-medium text-gray-500">
          <User className="size-5 shrink-0" aria-hidden />
          نماینده کاروان
        </p>
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <div className="flex h-full max-h-10 w-full max-w-109.75 items-center gap-16 text-gray-500">
          <p className=" w-21 text-stretch">نام نماینده</p>
          <FormTextInput
            name="fullName"
            control={useForm().control}
            placeholder="علی صادقی"
            rightIcon={User}
            disabled={false}
            valueFilter="noDigits"
          />
        </div>
        <div className="flex h-full max-h-10 w-full max-w-109.75 flex-row items-center gap-26.75 text-gray-500">
          <p>شماره موبایل</p>

          <FormTextInput
            name="fullName"
            control={useForm().control}
            placeholder="شماره موبایل"
            rightIcon={Phone}
            disabled={false}
            valueFilter="digits"
            maxLength={11}
          />
        </div>
      </div>
      <button
        dir="rtl"
        type="button"
        className="flex h-14.5 w-full max-w-99.5 self-end items-center justify-center gap-2 rounded-xl border border-[#175E47] text-sm font-medium text-white bg-[#175E47]"
      >
        تغییر شماره ورود
      </button>
    </div>
  );
}
