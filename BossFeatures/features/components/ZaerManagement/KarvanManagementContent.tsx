"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, Inbox, Search, UserPlus, Users, XCircle } from "lucide-react";
import { FloatingLabelSearch } from "@/boss-features/UI/FloationgLabelSearch";
import {
  Table,
  TablePagination,
  TableRowActionsMenu,
  usePagination,
  type Column,
} from "@admin-kit/index";
import { toPersianDigits } from "@/boss-features/lib/format";
import type { ProfileFormValues } from "../../lib/profileSchema";
import {
  genderLabel,
  splitFullName,
  type Accompany,
} from "../ManagementSchema";
import { ZaerManagementFormModal } from "./ZaerManagementFormModal";
import { AccompanyViewModal } from "../ManagementViewModal";

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
  initialAccompanies?: Accompany[];
  isLoading?: boolean;
  /** Controlled search (wired to API Search when provided). */
  search?: string;
  onSearchChange?: (value: string) => void;
  onAdd?: (values: ProfileFormValues) => Promise<unknown>;
  onDelete?: (row: Accompany) => Promise<unknown>;
  onExcelUpload?: (file: File) => void | Promise<unknown>;
  uploading?: boolean;
  adding?: boolean;
};

export function MyAccompanyContent({
  initialAccompanies = [],
  isLoading,
  search: controlledSearch,
  onSearchChange,
  onAdd,
  onDelete,
  onExcelUpload,
  uploading,
  adding,
}: Props) {
  const [accompanies, setAccompanies] = useState(initialAccompanies);
  const [localSearch, setLocalSearch] = useState("");
  const searchValue = controlledSearch ?? localSearch;
  const setSearchValue = onSearchChange ?? setLocalSearch;
  const [formOpen, setFormOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<Accompany | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAccompanies(initialAccompanies);
  }, [initialAccompanies]);

  const filtered = useMemo(() => {
    // When search is controlled by parent (API search), don't re-filter locally.
    if (onSearchChange) return accompanies;
    const query = searchValue.trim().toLowerCase();
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
  }, [accompanies, searchValue, onSearchChange]);

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    setPage,
    setSize,
  } = usePagination(filtered, 20);

  useEffect(() => {
    setPage(1);
  }, [searchValue, setPage]);

  const tableRows = paginatedItems.map((row, index) => ({
    ...row,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const handleAdd = async (values: ProfileFormValues) => {
    setActionError(null);
    setActionMessage(null);
    try {
      if (onAdd) {
        await onAdd(values);
      } else {
        setAccompanies((prev) => [
          ...prev,
          { ...values, id: values.nationalCode || String(Date.now()) },
        ]);
      }
      setFormOpen(false);
      setActionMessage("همسفر با موفقیت افزوده شد.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "افزودن همسفر ناموفق بود.",
      );
      throw err;
    }
  };

  const handleDelete = async (row: Accompany) => {
    const ok = window.confirm(
      `آیا از حذف «${row.fullName || row.nationalCode}» مطمئن هستید؟`,
    );
    if (!ok) return;
    setActionError(null);
    setActionMessage(null);
    try {
      if (onDelete) {
        await onDelete(row);
      } else {
        setAccompanies((prev) => prev.filter((a) => a.id !== row.id));
      }
      setActionMessage("همسفر حذف شد.");
      if (viewTarget?.id === row.id) setViewTarget(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "حذف همسفر ناموفق بود.",
      );
    }
  };

  const handleExcelUpload = async (file: File) => {
    setActionError(null);
    setActionMessage(null);
    try {
      if (onExcelUpload) {
        await onExcelUpload(file);
        setActionMessage("فایل اکسل با موفقیت بارگذاری شد.");
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "بارگذاری اکسل ناموفق بود.",
      );
    }
  };

  const columns = buildColumns({
    onView: setViewTarget,
    onDelete: (row) => void handleDelete(row),
  });

  const actionBtnClass =
    "inline-flex h-[40px] min-h-[40px] w-full max-w-[353px] min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-[#175E47] px-4 text-sm font-medium leading-[22px] text-[#175E47] transition-colors hover:bg-[#F5F9F6] disabled:cursor-not-allowed disabled:opacity-50";

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <h1
        dir="rtl"
        className="flex w-full items-center gap-2 p-8 text-2xl font-bold text-gray-500 sm:text-3xl"
      >
        <Users className="size-7 sm:size-8" /> مدیریت زائران کاروان
      </h1>

      {actionMessage ? (
        <p className="px-8 text-sm text-[#175E47]">{actionMessage}</p>
      ) : null}
      {actionError ? (
        <p className="px-8 text-sm text-red-500">{actionError}</p>
      ) : null}

      <div
        className="flex w-full flex-col gap-16 p-4 md:flex-row md:items-stretch md:justify-between"
        dir="rtl"
      >
        <FloatingLabelSearch
          id="accompany-search"
          label="جستجو (نام / کد ملی)"
          value={searchValue}
          onChange={setSearchValue}
          icon={<Search className="size-5" />}
          containerClassName="min-w-0 flex-1 max-w-[373px] "
        />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-8 md:flex-row md:items-stretch">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden w-full max-w-[353px]"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleExcelUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className={actionBtnClass}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Inbox className="size-4 shrink-0" />
            <span className="min-w-0 truncate text-center">
              {uploading
                ? "در حال بارگذاری…"
                : "بارگزاری اکسل لیست اکسل همسفران"}
            </span>
          </button>
          <button
            type="button"
            className={actionBtnClass}
            disabled={adding}
            onClick={() => setFormOpen(true)}
          >
            <UserPlus className="size-4 shrink-0" />
            <span className="min-w-0 truncate text-center">
              {adding ? "در حال ثبت…" : "افزودن همسفر جدید"}
            </span>
          </button>
        </div>
      </div>

      <Table
        data={tableRows}
        columns={columns}
        size="lg"
        className="w-full"
        dir="rtl"
      />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />
      <ZaerManagementFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(values) => void handleAdd(values)}
      />

      <AccompanyViewModal
        accompany={viewTarget}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}
