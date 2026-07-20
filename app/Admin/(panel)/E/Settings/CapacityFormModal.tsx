"use client";

import { Receipt, UserRound, UsersRound } from "lucide-react";
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
  /** Present on edit; on add the backend returns UUID from POST /Room. */
  roomId: string;
  /** Enter date (ISO YYYY-MM-DD) — same pattern as general reservation. */
  enterDate: string;
  /** Exit date (ISO YYYY-MM-DD, inclusive). */
  exitDate: string;
};

const defaultValues: CapacityFormValues = {
  classLabel: "",
  capacity: "",
  classLevel: "",
  gender: "مرد",
  roomId: "",
  enterDate: "",
  exitDate: "",
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
      defaultValues: {
        ...defaultValues,
        enterDate: defaultDate,
        exitDate: defaultDate,
      },
      values: row
        ? {
            classLabel: row.className,
            capacity: String(row.capacity),
            classLevel: row.reservationKind,
            gender: row.gender,
            roomId: String((row as { roomId?: string }).roomId ?? row.id ?? ""),
            enterDate: defaultDate,
            exitDate: defaultDate,
          }
        : {
            ...defaultValues,
            enterDate: defaultDate,
            exitDate: defaultDate,
          },
    });

  const enterDate = watch("enterDate");
  const exitDate = watch("exitDate");

  if (!props.open) return null;
  if (isEdit && !row) return null;

  const submit = (values: CapacityFormValues) => {
    if (values.exitDate && values.enterDate && values.exitDate < values.enterDate) {
      return;
    }
    props.onSubmit(values);
    if (!submitting) {
      reset({
        ...defaultValues,
        enterDate: defaultDate,
        exitDate: defaultDate,
      });
    }
  };

  const inputClass = "[&_input]:h-14 [&_div]:h-14 [&_div]:rounded-xl";
  const dateRangeError =
    enterDate && exitDate && exitDate < enterDate
      ? "تاریخ خروج باید هم‌زمان یا بعد از تاریخ ورود باشد"
      : null;

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

        <div>
          <PersianDateField
            value={enterDate}
            onChange={(iso) => {
              const next = iso ?? "";
              setValue("enterDate", next, { shouldDirty: true });
              if (!exitDate || (exitDate && next && exitDate < next)) {
                setValue("exitDate", next, { shouldDirty: true });
              }
            }}
            outputFormat="iso"
            placeholder="تاریخ ورود ظرفیت"
          />
        </div>

        <div>
          <PersianDateField
            value={exitDate}
            onChange={(iso) =>
              setValue("exitDate", iso ?? "", { shouldDirty: true })
            }
            outputFormat="iso"
            placeholder="تاریخ خروج ظرفیت"
          />
        </div>

        {dateRangeError ? (
          <p className="text-sm text-red-600 sm:col-span-2">{dateRangeError}</p>
        ) : null}

        {isEdit ? (
          <FormTextInput
            name="roomId"
            control={control}
            placeholder="شناسه اتاق (UUID)"
            rightIcon={UsersRound}
            className={cn(inputClass, "sm:col-span-2")}
          />
        ) : null}

        <div className={cn("flex h-14 items-center", "sm:col-span-2")}>
          <GenderRadioField control={control} />
        </div>
      </form>
    </SettingsModalShell>
  );
}
