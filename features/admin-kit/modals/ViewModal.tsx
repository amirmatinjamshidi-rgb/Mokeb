"use client";

import { toPersianDigits } from "@admin-kit/shared/lib/format";
import {
  genderLabel,
  nationalityLabel,
  type Accompany,
} from "@admin-kit/schemas/managementSchema";
import { BaseModal } from "@admin-kit/modals/BaseModal";

type Props = {
  accompany: Accompany | null;
  onClose: () => void;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-[#FAFAFA] px-4 py-3">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-500">{value}</span>
    </div>
  );
}

function SectionDivider() {
  return <div className="my-6 h-px border border-[#CBA52C]" />;
}

export function ViewModal({ accompany, onClose }: Props) {
  if (!accompany) return null;

  return (
    <BaseModal
      open
      title="مشاهده جزییات همسفر"
      onClose={onClose}
      panelClassName="max-w-4xl"
    >
      <section className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#175E47]">اطلاعات شخصی</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoRow label="نام و نام خانوادگی" value={accompany.fullName} />
          <InfoRow label="نام پدر" value={accompany.fatherName} />
          <InfoRow label="جنسیت" value={genderLabel(accompany.gender)} />
          <InfoRow
            label="تاریخ تولد"
            value={toPersianDigits(accompany.birthDate)}
          />
          <InfoRow label="شهر" value={accompany.city} />
        </div>
      </section>

      <SectionDivider />

      <section className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#175E47]">اطلاعات شناسایی</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoRow
            label="ملیت"
            value={nationalityLabel(accompany.nationality)}
          />
          <InfoRow
            label="کد ملی"
            value={toPersianDigits(accompany.nationalCode)}
          />
          <InfoRow
            label="شماره پاسپورت"
            value={toPersianDigits(accompany.passportNumber)}
          />
          <InfoRow
            label="تاریخ انقضای پاسپورت"
            value={toPersianDigits(accompany.passportExpiry)}
          />
        </div>
      </section>

      <SectionDivider />

      <section className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#175E47]">اطلاعات سلامت</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoRow
            label="گروه خونی"
            value={toPersianDigits(accompany.bloodType)}
          />
          <InfoRow
            label="سابقه بیماری"
            value={accompany.diseaseHistory || "—"}
          />
        </div>
      </section>

      <SectionDivider />

      <section className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-[#175E47]">اطلاعات تماس</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoRow
            label="شماره موبایل اول"
            value={toPersianDigits(accompany.mobile1)}
          />
          <InfoRow
            label="شماره موبایل دوم"
            value={toPersianDigits(accompany.mobile2)}
          />
          <InfoRow
            label="تلفن آشنا در ایران"
            value={toPersianDigits(accompany.relativePhone)}
          />
        </div>
      </section>
    </BaseModal>
  );
}

/** @deprecated Use ViewModal */
export const AccompanyViewModal = ViewModal;
