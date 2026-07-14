"use client";

import type { ReactNode } from "react";
import { Hash, Phone, User } from "lucide-react";

import { BaseModal } from "@admin-kit/modals/BaseModal";
import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { IconLabelInput } from "@admin-kit/ui/IconLabelInput";

import type { KarvanRequest } from "./requestTypes";

type Props = {
  request: KarvanRequest | null;
  onClose: () => void;
};

function ReviewField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-400">{label}</span>
      {children}
    </div>
  );
}

function ReadOnlyValidInput({
  value,
  placeholder,
  icon,
}: {
  value: string;
  placeholder: string;
  icon?: ReactNode;
}) {
  return (
    <IconLabelInput
      value={value}
      readOnly
      isValid
      icon={icon ?? <span className="size-[18px]" aria-hidden />}
      placeholder={placeholder}
      className="cursor-default"
    />
  );
}

function persian(value: string | number) {
  return toPersianDigits(value);
}

export function KarvanRequestReviewModal({ request, onClose }: Props) {
  if (!request) return null;

  return (
    <BaseModal
      open
      title="بررسی اطلاعات کاروان"
      onClose={onClose}
      panelClassName="max-w-4xl"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReviewField label="نام سرپرست">
          <ReadOnlyValidInput
            value={request.supervisorName}
            placeholder="نام سرپرست"
            icon={<User size={18} />}
          />
        </ReviewField>

        <ReviewField label="نوع رزرو">
          <ReadOnlyValidInput
            value={request.reservationType}
            placeholder="نوع رزرو"
          />
        </ReviewField>

        <ReviewField label="کلاس رزرو">
          <ReadOnlyValidInput
            value={request.reservationClass}
            placeholder="کلاس"
          />
        </ReviewField>

        <ReviewField label="کد رزرو">
          <ReadOnlyValidInput
            value={persian(request.reservationCode)}
            placeholder="کد رزرو"
            icon={<Hash size={18} />}
          />
        </ReviewField>

        <ReviewField label="نام نماینده">
          <ReadOnlyValidInput
            value={request.representativeFirstName}
            placeholder="نام نماینده"
            icon={<User size={18} />}
          />
        </ReviewField>

        <ReviewField label="نام خانوادگی نماینده">
          <ReadOnlyValidInput
            value={request.representativeLastName}
            placeholder="نام خانوادگی"
            icon={<User size={18} />}
          />
        </ReviewField>

        <ReviewField label="تاریخ ورود">
          <ReadOnlyValidInput
            value={persian(request.entryDate)}
            placeholder="تاریخ ورود"
          />
        </ReviewField>

        <ReviewField label="تاریخ خروج">
          <ReadOnlyValidInput
            value={persian(request.exitDate)}
            placeholder="تاریخ خروج"
          />
        </ReviewField>

        <ReviewField label="شماره موبایل">
          <ReadOnlyValidInput
            value={persian(request.mobile)}
            placeholder="شماره موبایل"
            icon={<Phone size={18} />}
          />
        </ReviewField>

        <ReviewField label="مدت اقامت (روز)">
          <ReadOnlyValidInput
            value={persian(request.stayDuration)}
            placeholder="مدت اقامت"
          />
        </ReviewField>

        <ReviewField label="ظرفیت کل">
          <ReadOnlyValidInput
            value={persian(request.totalCapacity)}
            placeholder="ظرفیت کل"
          />
        </ReviewField>

        <ReviewField label="تعداد آقایان">
          <ReadOnlyValidInput
            value={persian(request.maleCount)}
            placeholder="تعداد آقایان"
          />
        </ReviewField>

        <ReviewField label="تعداد بانوان">
          <ReadOnlyValidInput
            value={persian(request.femaleCount)}
            placeholder="تعداد بانوان"
          />
        </ReviewField>
      </div>
    </BaseModal>
  );
}
