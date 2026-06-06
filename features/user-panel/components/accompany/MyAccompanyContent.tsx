"use client";

import { useMemo, useRef, useState } from "react";
import { Eye, Inbox, Search, UserPlus, Users, XCircle } from "lucide-react";
import { FloatingLabelSearch } from "@/features/shared/ui/FloatingLabelSearch";
import { Table, type Column } from "@/features/shared/table/MainTable";
import {
  TablePagination,
  usePagination,
} from "@/features/shared/table/TablePagination";
import { TableRowActionsMenu } from "@/features/shared/table/TableRowActionsMenu";
import { toPersianDigits } from "@/features/shared/lib/format";
import type { ProfileFormValues } from "../../lib/profileSchema";
import {
  genderLabel,
  splitFullName,
  type Accompany,
} from "../../lib/accompanySchema";
import { AccompanyFormModal } from "./AccompanyFormModal";
import { AccompanyViewModal } from "./AccompanyViewModal";
import type { ReservationFilterValues } from "../reservations/ReservationFilters";

function persianCell(value: string | number) {
  return toPersianDigits(value);
}

function buildColumns(handlers: {
  onView: (row: Accompany) => void;
  onDelete: (row: Accompany) => void;
}): Column<Accompany & { radif: number }>[] {
  return [
    {
      key: "radif",
      header: "ردیف",
      colClassName: "text-center",
      cell: (row) => persianCell(row.radif),
    },
    {
      key: "firstName",
      header: "نام",
      colClassName: "text-center",
      cell: (row) => splitFullName(row.fullName).firstName,
    },
    {
      key: "lastName",
      header: "نام خانوادگی",
      colClassName: "text-center",
      cell: (row) => splitFullName(row.fullName).lastName,
    },
    {
      key: "gender",
      header: "جنسیت",
      colClassName: "text-center",
      cell: (row) => genderLabel(row.gender),
    },
    {
      key: "nationalCode",
      header: "کد ملی",
      colClassName: "text-center",
      cell: (row) => persianCell(row.nationalCode),
    },
    {
      key: "passportNumber",
      header: "شماره پاسپورت",
      colClassName: "text-center",
      cell: (row) => persianCell(row.passportNumber),
    },
    {
      key: "Operation",
      header: "عملیات",
      colClassName: "text-center",
      cellClassName: "overflow-visible",
      cell: (row) => (
        <TableRowActionsMenu
          items={[
            {
              label: "مشاهده جزییات",
              icon: Eye,
              onClick: () => handlers.onView(row),
            },
            {
              label: "حذف همسفر",
              icon: XCircle,
              onClick: () => handlers.onDelete(row),
            },
          ]}
        />
      ),
    },
  ];
}

type Props = {
  initialAccompanies: Accompany[];
};

export function MyAccompanyContent({ initialAccompanies }: Props) {
  const [accompanies, setAccompanies] = useState(initialAccompanies);
  const [filters, setFilters] = useState<ReservationFilterValues>({
    search: "",
    status: "all",
    sort: "newest",
  });
  const [formOpen, setFormOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<Accompany | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return accompanies.filter((row) => {
      if (!query) return true;
      const { firstName, lastName } = splitFullName(row.fullName);
      return (
        row.nationalCode.includes(query) ||
        row.passportNumber.toLowerCase().includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        row.fullName.includes(query)
      );
    });
  }, [accompanies, filters.search]);

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    setPage,
    setSize,
  } = usePagination(filtered, 20);

  const tableRows = paginatedItems.map((row, index) => ({
    ...row,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const handleAdd = (values: ProfileFormValues) => {
    setAccompanies((prev) => [...prev, { ...values, id: Date.now() }]);
  };

  const handleDelete = (row: Accompany) => {
    setAccompanies((prev) => prev.filter((a) => a.id !== row.id));
  };

  const handleExcelUpload = (file: File) => {
    console.log("excel upload", file.name);
  };

  const columns = buildColumns({
    onView: setViewTarget,
    onDelete: handleDelete,
  });

  const actionBtnClass =
    "inline-flex h-[40px] items-center gap-2 rounded-xl border border-[#175E47] px-4 text-sm font-medium leading-[22px] text-[#175E47] transition-colors hover:bg-[#F5F9F6]";

  return (
    <div className="flex w-full flex-col gap-8">
      <h1 className="flex w-full items-center gap-2 text-2xl font-bold text-gray-500 sm:text-3xl">
        <Users className="size-7 sm:size-8" /> همراهان من
      </h1>

      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <FloatingLabelSearch
          id="accompany-search"
          label="کد رزرو"
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
          icon={<Search className="size-5" />}
          containerClassName="md:max-w-md min-w-0 flex-1"
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleExcelUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className={actionBtnClass}
            onClick={() => fileInputRef.current?.click()}
          >
            <Inbox className="size-4 shrink-0" />
            بارگزاری اکسل لیست اکسل همسفران
          </button>
          <button
            type="button"
            className={actionBtnClass}
            onClick={() => setFormOpen(true)}
          >
            <UserPlus className="size-4 shrink-0" />
            افزودن همسفر جدید
          </button>
        </div>
      </div>

      <Table data={tableRows} columns={columns} size="lg" className="w-full" />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />
      <AccompanyFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />

      <AccompanyViewModal
        accompany={viewTarget}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}
