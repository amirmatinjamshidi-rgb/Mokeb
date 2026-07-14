"use client";

import { Table, type Column } from "@admin-kit/index";
import { toPersianDigits } from "@/features/shared/lib/format";

export type PilgrimRow = {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  nationalCode: string;
  passportNumber?: string;
};

function genderLabel(g: PilgrimRow["gender"]) {
  return g === "female" ? "زن" : "مرد";
}

const columns: Column<PilgrimRow & { radif: number }>[] = [
  {
    key: "radif",
    header: "ردیف",
    colClassName: "text-center",
    cell: (row) => toPersianDigits(row.radif),
  },
  {
    key: "firstName",
    header: "نام",
    colClassName: "text-center",
    cell: (row) => row.firstName,
  },
  {
    key: "lastName",
    header: "نام خانوادگی",
    colClassName: "text-center",
    cell: (row) => row.lastName,
  },
  {
    key: "gender",
    header: "جنسیت",
    colClassName: "text-center",
    cell: (row) => genderLabel(row.gender),
  },
  {
    key: "nationalCode",
    header: "کد ملی / پاسپورت",
    colClassName: "text-center",
    cell: (row) =>
      toPersianDigits(row.nationalCode || row.passportNumber || "—"),
  },
];

type Props = {
  pilgrims: PilgrimRow[];
  className?: string;
};

export function PilgrimsTable({ pilgrims, className }: Props) {
  if (!pilgrims.length) {
    return (
      <p className="py-6 text-center text-sm text-[#61756F]">
        لیست زائران خالی است.
      </p>
    );
  }

  const rows = pilgrims.map((p, i) => ({ ...p, radif: i + 1 }));

  return (
    <Table
      data={rows}
      columns={columns}
      size="lg"
      className={className ?? "w-full"}
    />
  );
}
