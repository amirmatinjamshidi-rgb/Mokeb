"use client";

import type { ReactNode } from "react";

import { BaseModal } from "@admin-kit/modals/BaseModal";
import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";
import type { AdminUserRow } from "@admin-kit/api/hooks";

type Props = {
  user: AdminUserRow | null;
  onClose: () => void;
};

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-[#FAFAFA] px-4 py-3">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-500">{value}</span>
    </div>
  );
}

function accountTypeLabel(accountType: AdminUserRow["accountType"]) {
  return accountType === "caravan" ? "کاروان" : "کاربر";
}

export function UserViewModal({ user, onClose }: Props) {
  if (!user) return null;

  return (
    <BaseModal
      open
      title="مشاهده اطلاعات کاربر"
      onClose={onClose}
      panelClassName="max-w-2xl"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoRow label="نام" value={user.firstName} />
        <InfoRow label="نام خانوادگی" value={user.lastName} />
        <InfoRow
          label="کد ملی"
          value={toPersianDigits(user.nationalCode)}
        />
        <InfoRow label="شماره موبایل" value={toPersianDigits(user.mobile)} />
        <InfoRow label="نوع حساب" value={accountTypeLabel(user.accountType)} />
        <InfoRow
          label="وضعیت"
          value={
            <span
              className={cn(
                "font-medium",
                user.status === "فعال" ? "text-[#279F78]" : "text-[#D22B23]",
              )}
            >
              {user.status}
            </span>
          }
        />
      </div>
    </BaseModal>
  );
}
