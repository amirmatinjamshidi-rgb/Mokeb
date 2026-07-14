"use client";

import {  Receipt, UserRound, UsersRound } from "lucide-react";
import { useForm } from "react-hook-form";

import FormTextInput from "@admin-kit/ui/FormTextInput";
import { cn } from "@admin-kit/shared/lib/utils";
import { PersianDateField } from "@/features/shared/ui/PersianDateField";

import { GenderRadioField } from "./GenderRadioField";
import type { CapacityGender, CapacityRow } from "./mockCapacityData";
import {
  SETTINGS_ACTION_BTN_CLASS,
  SETTINGS_INFO_BOX_CLASS,
} from "./settingsStyles";
import { SettingsModalShell } from "./SettingsModalShell";

export type CapacityFormValues = {
  classLabel: string;
  capacity: string;
  classLevel: string;
  gender: CapacityGender;
  /** Optional UUID when backend create does not return room id. */
  roomId: string;
  /** Target availability date (ISO YYYY-MM-DD) for activate / ChangeDate. */
  targetDate: string;
};

const defaultValues: CapacityFormValues = {
  classLabel: "",
  capacity: "",
  classLevel: "",
  gender: "مرد",
  roomId: "",
  targetDate: "",
};

type AddProps = {
  mode: "add";
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CapacityFormValues) => void;
  submitting?: boolean;
  defaultDate?: string;
};

type EditProps = {
  mode: "edit";
  open: boolean;
  row: CapacityRow | null;
  onClose: () => void;
  onSubmit: (values: CapacityFormValues) => void;
  submitting?: boolean;
  defaultDate?: string;
};

type Props = AddProps | EditProps;

function ModalActions({
  onClose,
  submitLabel,
  onSubmit,
  submitting,
}: {
  onClose: () => void;
  submitLabel: string;
  onSubmit: () => void;
  submitting?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className={cn(
          SETTINGS_ACTION_BTN_CLASS,
          "border-[#175E47] bg-white text-[#175E47]",
        )}
      >
        انصراف
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className={cn(
          SETTINGS_ACTION_BTN_CLASS,
          "border-[#175E47] bg-[#175E47] text-white",
        )}
      >
        {submitting ? "در حال ثبت…" : submitLabel}
      </button>
    </>
  );
}

function EditSummaryBox({ row }: { row: CapacityRow }) {
  const items = [
    {
      label: " کلاس ظرفیت",
      value: `${row.capacity} نفر`,
      color: "#2E7DDC",
      Icon: UsersRound,
    },
    {
      label: "جنسیت",
      value: row.gender,
      color: "#23D283",
      Icon: UserRound,
    },
    {
      label: "نوع رزرو",
      value: row.reservationKind,
      color: "#CBA52C",
      Icon: Receipt,
    },
  ];

  return (
    <div className={SETTINGS_INFO_BOX_CLASS}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <item.Icon className="size-5 shrink-0 text-gray-400" aria-hidden />
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <span
              className="pr-7 text-sm font-semibold"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CapacityFormModal(props: Props) {
  const isEdit = props.mode === "edit";
  const row = isEdit ? props.row : null;
  const submitting = props.submitting;
  const defaultDate = props.defaultDate ?? "";

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CapacityFormValues>({
      defaultValues: { ...defaultValues, targetDate: defaultDate },
      values: row
        ? {
            classLabel: row.className,
            capacity: String(row.capacity),
            classLevel: row.reservationKind,
            gender: row.gender,
            roomId: String((row as { roomId?: string }).roomId ?? row.id ?? ""),
            targetDate: defaultDate,
          }
        : { ...defaultValues, targetDate: defaultDate },
    });

  const targetDate = watch("targetDate");

  if (!props.open) return null;
  if (isEdit && !row) return null;

  const submit = (values: CapacityFormValues) => {
    props.onSubmit(values);
    if (!submitting) {
      reset({ ...defaultValues, targetDate: defaultDate });
    }
  };

  const inputClass = "[&_input]:h-14 [&_div]:h-14 [&_div]:rounded-xl";

  return (
    <SettingsModalShell
      open={props.open}
      title={isEdit ? "فعال‌سازی / ویرایش تاریخ" : "افزودن ظرفیت"}
      onClose={props.onClose}
      footer={
        <ModalActions
          onClose={props.onClose}
          submitLabel={isEdit ? "ذخیره تغییرات" : "افزودن"}
          onSubmit={handleSubmit(submit)}
          submitting={submitting}
        />
      }
    >
      {isEdit && row ? <EditSummaryBox row={row} /> : null}

      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        {!isEdit ? (
          <FormTextInput
            name="classLabel"
            control={control}
            placeholder="اسم کلاس"
            rightIcon={UserRound}
            className={inputClass}
          />
        ) : null}

        <FormTextInput
          name="capacity"
          control={control}
          placeholder="ظرفیت"
          rightIcon={UsersRound}
          valueFilter="digits"
          className={inputClass}
        />

        <FormTextInput
          name="classLevel"
          control={control}
          placeholder="نوع رزرو"
          rightIcon={Receipt}
          className={inputClass}
        />

        <div className="sm:col-span-2">
          <PersianDateField
            value={targetDate}
            onChange={(iso) => setValue("targetDate", iso ?? "", { shouldDirty: true })}
            outputFormat="iso"
            placeholder={isEdit ? "تاریخ جدید ظرفیت" : "تاریخ فعال‌سازی ظرفیت"}
          />
        </div>

        <FormTextInput
          name="roomId"
          control={control}
          placeholder="شناسه اتاق (UUID) — اگر بک‌اند UUID برنگرداند اینجا بگذارید"
          rightIcon={UsersRound}
          className={cn(inputClass, "sm:col-span-2")}
        />

        <div className={cn("flex h-14 items-center", !isEdit && "sm:col-span-2")}>
          <GenderRadioField control={control} />
        </div>
      </form>
    </SettingsModalShell>
  );
}
