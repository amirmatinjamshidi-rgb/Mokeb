"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import FormTextInput from "@admin-kit/ui/FormTextInput";
import { cn } from "@admin-kit/shared/lib/utils";
import { useReservationRulesStore } from "@admin-kit/settings/useReservationRulesStore";

import { SETTINGS_ACTION_BTN_CLASS, SETTINGS_PANEL_CLASS } from "./settingsStyles";
import { UserSquareIcon } from "./settingsIcons";

type PublicRulesForm = {
  pilgrimDeadlineMinutes: string;
  maxPersonsPerReservation: string;
  maxStayDays: string;
};

type CaravanRulesForm = {
  pilgrimDeadlineDays: string;
  maxStayDays: string;
};

function RuleRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:h-14 sm:flex-row sm:items-center sm:gap-10">
      <p className="shrink-0 text-sm font-medium text-gray-600 sm:min-w-[280px]">
        {label}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function RulesPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(SETTINGS_PANEL_CLASS, "flex flex-col gap-8 p-6 sm:p-8")}
      dir="rtl"
    >
      <h3 className="text-base font-bold text-[#175E47]">{title}</h3>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

export function ReservationRulesTab() {
  const publicRules = useReservationRulesStore((s) => s.publicRules);
  const caravanRules = useReservationRulesStore((s) => s.caravanRules);
  const setPublicRules = useReservationRulesStore((s) => s.setPublicRules);
  const setCaravanRules = useReservationRulesStore((s) => s.setCaravanRules);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const publicForm = useForm<PublicRulesForm>({
    defaultValues: {
      pilgrimDeadlineMinutes: String(publicRules.pilgrimDeadlineMinutes),
      maxPersonsPerReservation: String(publicRules.maxPersonsPerReservation),
      maxStayDays: String(publicRules.maxStayDays),
    },
    mode: "onChange",
  });

  const caravanForm = useForm<CaravanRulesForm>({
    defaultValues: {
      pilgrimDeadlineDays: String(caravanRules.pilgrimDeadlineDays),
      maxStayDays: String(caravanRules.maxStayDays),
    },
    mode: "onChange",
  });

  useEffect(() => {
    publicForm.reset({
      pilgrimDeadlineMinutes: String(publicRules.pilgrimDeadlineMinutes),
      maxPersonsPerReservation: String(publicRules.maxPersonsPerReservation),
      maxStayDays: String(publicRules.maxStayDays),
    });
  }, [publicRules, publicForm]);

  useEffect(() => {
    caravanForm.reset({
      pilgrimDeadlineDays: String(caravanRules.pilgrimDeadlineDays),
      maxStayDays: String(caravanRules.maxStayDays),
    });
  }, [caravanRules, caravanForm]);

  const inputClass = "[&_input]:h-14 [&_div]:h-14 [&_div]:rounded-xl";

  const savePublic = publicForm.handleSubmit((values) => {
    setPublicRules({
      pilgrimDeadlineMinutes: Number(values.pilgrimDeadlineMinutes) || 30,
      maxPersonsPerReservation:
        Number(values.maxPersonsPerReservation) || 10,
      maxStayDays: Number(values.maxStayDays) || 7,
    });
    setSavedMessage("قوانین رزرو عمومی ذخیره شد و در فرم رزرو اعمال می‌شود.");
  });

  const saveCaravan = caravanForm.handleSubmit((values) => {
    setCaravanRules({
      pilgrimDeadlineDays: Number(values.pilgrimDeadlineDays) || 3,
      maxStayDays: Number(values.maxStayDays) || 14,
    });
    setSavedMessage("قوانین رزرو کاروان ذخیره شد و در پنل کاروان اعمال می‌شود.");
  });

  return (
    <div className="flex w-full flex-col gap-8">
      {savedMessage ? (
        <p className="text-sm text-[#175E47]">{savedMessage}</p>
      ) : null}

      <RulesPanel title="قوانین رزرو عمومی">
        <RuleRow label="مهلت ثبت اطلاعات زایران (دقیقه)">
          <FormTextInput
            name="pilgrimDeadlineMinutes"
            control={publicForm.control}
            placeholder="دقیقه"
            rightIcon={UserSquareIcon}
            valueFilter="digits"
            className={inputClass}
          />
        </RuleRow>

        <RuleRow label="حداکثر نفرات هر رزرو عمومی (نفر)">
          <FormTextInput
            name="maxPersonsPerReservation"
            control={publicForm.control}
            placeholder="نفر"
            rightIcon={UserSquareIcon}
            valueFilter="digits"
            className={inputClass}
          />
        </RuleRow>

        <RuleRow label="حداکثر مدت اقامت (روز)">
          <FormTextInput
            name="maxStayDays"
            control={publicForm.control}
            placeholder="روز"
            rightIcon={UserSquareIcon}
            valueFilter="digits"
            className={inputClass}
          />
        </RuleRow>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void savePublic()}
            className={cn(
              SETTINGS_ACTION_BTN_CLASS,
              "border-[#175E47] bg-[#175E47] text-white",
            )}
          >
            ذخیره قوانین عمومی
          </button>
        </div>
      </RulesPanel>

      <RulesPanel title="قوانین رزرو کاروان">
        <RuleRow label="مهلت ثبت اطلاعات زایران (روز)">
          <FormTextInput
            name="pilgrimDeadlineDays"
            control={caravanForm.control}
            placeholder="روز"
            rightIcon={UserSquareIcon}
            valueFilter="digits"
            className={inputClass}
          />
        </RuleRow>

        <RuleRow label="حداکثر مدت اقامت (روز)">
          <FormTextInput
            name="maxStayDays"
            control={caravanForm.control}
            placeholder="روز"
            rightIcon={UserSquareIcon}
            valueFilter="digits"
            className={inputClass}
          />
        </RuleRow>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void saveCaravan()}
            className={cn(
              SETTINGS_ACTION_BTN_CLASS,
              "border-[#175E47] bg-[#175E47] text-white",
            )}
          >
            ذخیره قوانین کاروان
          </button>
        </div>
      </RulesPanel>
    </div>
  );
}
