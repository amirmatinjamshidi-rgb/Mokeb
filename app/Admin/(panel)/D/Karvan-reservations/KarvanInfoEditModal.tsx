"use client";

import { useEffect, type ReactNode } from "react";
import { Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { BaseModal } from "@admin-kit/modals/BaseModal";
import Button from "@admin-kit/ui/Button";
import FormTextInput from "@admin-kit/ui/FormTextInput";

import type { ReservationRow } from "./mockEntryExitRows";

export type KarvanInfoFormValues = {
  representativeFirstName: string;
  representativeLastName: string;
  entryDate: string;
  exitDate: string;
  mobile: string;
  stayDuration: string;
  maleCount: string;
  femaleCount: string;
};

type Props = {
  row: ReservationRow | null;
  onClose: () => void;
  onSave: (id: string, values: KarvanInfoFormValues) => void;
};

function EditableField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-[#FAFAFA] px-4 py-3">
      <span className="text-xs text-gray-400">{label}</span>
      {children}
    </div>
  );
}

export function KarvanInfoEditModal({ row, onClose, onSave }: Props) {
  const { control, handleSubmit, reset } = useForm<KarvanInfoFormValues>({
    defaultValues: {
      representativeFirstName: "",
      representativeLastName: "",
      entryDate: "",
      exitDate: "",
      mobile: "",
      stayDuration: "",
      maleCount: "",
      femaleCount: "",
    },
  });

  useEffect(() => {
    if (!row) return;
    reset({
      representativeFirstName: row.representativeFirstName,
      representativeLastName: row.representativeLastName,
      entryDate: row.entryDate,
      exitDate: row.exitDate,
      mobile: row.mobile,
      stayDuration: row.stayDuration,
      maleCount: String(row.maleCount),
      femaleCount: String(row.femaleCount),
    });
  }, [row, reset]);

  if (!row) return null;

  const submit = (values: KarvanInfoFormValues) => {
    onSave(row.id, values);
    onClose();
  };

  return (
    <BaseModal
      open={Boolean(row)}
      title="مشاهده اطلاعات کاروان"
      onClose={onClose}
      panelClassName="max-w-4xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            color="white"
            border="gray"
            text="none"
            radius="md"
            size="md"
            width="auto"
            className="!text-gray-500"
            onClick={onClose}
          >
            انصراف
          </Button>
          <Button
            type="button"
            color="darkGreen"
            text="white"
            radius="md"
            border="none"
            size="md"
            width="auto"
            onClick={handleSubmit(submit)}
          >
            ثبت تغییرات
          </Button>
        </div>
      }
    >
      <form
        onSubmit={handleSubmit(submit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        noValidate
      >
        <EditableField label="نام نماینده">
          <FormTextInput
            name="representativeFirstName"
            control={control}
            placeholder="نام نماینده"
            rightIcon={User}
            showLabelInInput={false}
            valueFilter="noDigits"
          />
        </EditableField>

        <EditableField label="نام خانوادگی">
          <FormTextInput
            name="representativeLastName"
            control={control}
            placeholder="نام خانوادگی"
            rightIcon={User}
            showLabelInInput={false}
            valueFilter="noDigits"
          />
        </EditableField>

        <EditableField label="تاریخ ورود">
          <FormTextInput
            name="entryDate"
            control={control}
            placeholder="1404/03/12"
            showIconR={false}
            showLabelInInput={false}
            valueFilter="none"
          />
        </EditableField>

        <EditableField label="تاریخ خروج">
          <FormTextInput
            name="exitDate"
            control={control}
            placeholder="1404/03/18"
            showIconR={false}
            showLabelInInput={false}
            valueFilter="none"
          />
        </EditableField>

        <EditableField label="شماره موبایل">
          <FormTextInput
            name="mobile"
            control={control}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            rightIcon={Phone}
            showLabelInInput={false}
            valueFilter="digits"
            maxLength={11}
          />
        </EditableField>

        <EditableField label="مدت اقامت">
          <FormTextInput
            name="stayDuration"
            control={control}
            placeholder="تعداد روز"
            showIconR={false}
            showLabelInInput={false}
            valueFilter="digits"
          />
        </EditableField>

        <EditableField label="تعداد آقایان">
          <FormTextInput
            name="maleCount"
            control={control}
            placeholder="0"
            showIconR={false}
            showLabelInInput={false}
            valueFilter="digits"
          />
        </EditableField>

        <EditableField label="تعداد بانوان">
          <FormTextInput
            name="femaleCount"
            control={control}
            placeholder="0"
            showIconR={false}
            showLabelInInput={false}
            valueFilter="digits"
          />
        </EditableField>
      </form>
    </BaseModal>
  );
}
