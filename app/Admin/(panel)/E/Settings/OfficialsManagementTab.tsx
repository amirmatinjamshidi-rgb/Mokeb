"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { CloseCircle, Edit2 } from "iconsax-reactjs";
import { Plus, Search } from "lucide-react";

import {
  FloatingLabelSearch,
  PageToolbar,
  Table,
  TableRowActionsMenu,
  pageToolbarActionClass,
  type Column,
} from "@admin-kit/index";
import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";
import {
  type AdminOfficialRow,
  useAddOfficial,
  useDeleteOfficial,
  useEditOfficial,
  useOfficials,
} from "@admin-kit/api/hooks";

import {
  OfficialFormModal,
  type OfficialFormValues,
} from "./OfficialFormModal";

function createIconsaxIcon(
  Icon: ComponentType<{
    className?: string;
    variant?: "Outline";
    color?: string;
    size?: string | number;
  }>,
) {
  return function IconsaxMenuIcon({ className }: { className?: string }) {
    return (
      <Icon variant="Outline" className={className} color="currentColor" size={16} />
    );
  };
}

const EditIcon = createIconsaxIcon(Edit2);
const CloseCircleIcon = createIconsaxIcon(CloseCircle);

type TableRow = AdminOfficialRow & { radif: number };

function buildColumns(handlers: {
  onEdit: (row: TableRow) => void;
  onDelete: (row: TableRow) => void;
}): Column<TableRow>[] {
  return [
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
      cell: (row) => row.firstName || "—",
    },
    {
      key: "lastName",
      header: "نام خانوادگی",
      colClassName: "text-center",
      cell: (row) => row.lastName || "—",
    },
    {
      key: "mobile",
      header: "شماره موبایل",
      colClassName: "text-center",
      cell: (row) => (row.mobile ? toPersianDigits(row.mobile) : "—"),
    },
    {
      key: "actions",
      header: "عملیات",
      colClassName: "text-center",
      cellClassName: "overflow-visible",
      cell: (row) => (
        <TableRowActionsMenu
          items={[
            {
              label: "ویرایش",
              icon: EditIcon,
              onClick: () => handlers.onEdit(row),
            },
            {
              label: "حذف",
              icon: CloseCircleIcon,
              onClick: () => handlers.onDelete(row),
            },
          ]}
        />
      ),
    },
  ];
}

export function OfficialsManagementTab() {
  const { data: rows = [], isLoading, error } = useOfficials();
  const addOfficial = useAddOfficial();
  const editOfficial = useEditOfficial();
  const deleteOfficial = useDeleteOfficial();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<
    | { mode: "add" }
    | { mode: "edit"; row: AdminOfficialRow }
    | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return rows;
    return rows.filter((row) => {
      const hay = `${row.firstName} ${row.lastName} ${row.mobile}`;
      return hay.includes(q);
    });
  }, [rows, search]);

  const tableRows: TableRow[] = useMemo(
    () => filtered.map((row, index) => ({ ...row, radif: index + 1 })),
    [filtered],
  );

  const columns = useMemo(
    () =>
      buildColumns({
        onEdit: (row) => {
          setActionError(null);
          setModal({ mode: "edit", row });
        },
        onDelete: (row) => {
          const ok = window.confirm(
            `مسئول «${row.firstName} ${row.lastName}» از صفحه درباره ما حذف شود؟`,
          );
          if (!ok) return;
          setActionError(null);
          void deleteOfficial.mutateAsync(row.id).catch((err: unknown) => {
            setActionError(
              err instanceof Error ? err.message : "حذف ناموفق بود.",
            );
          });
        },
      }),
    [deleteOfficial],
  );

  const isSaving = addOfficial.isPending || editOfficial.isPending;

  const handleSubmit = async (values: OfficialFormValues) => {
    setActionError(null);
    try {
      if (modal?.mode === "add") {
        await addOfficial.mutateAsync({
          name: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phoneNumber: values.mobile.trim(),
        });
      } else if (modal?.mode === "edit") {
        await editOfficial.mutateAsync({
          officialId: modal.row.id,
          name: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phoneNumber: values.mobile.trim(),
        });
      }
      setModal(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "ذخیره ناموفق بود.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-6" dir="rtl">
      <PageToolbar
        search={
          <FloatingLabelSearch
            id="officials-search"
            label="جستجو"
            value={search}
            onChange={setSearch}
            icon={<Search className="size-5" aria-hidden />}
            containerClassName="w-full shadow-sm shadow-gray-300 border-white"
          />
        }
        actions={
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setModal({ mode: "add" });
            }}
            className={cn(
              pageToolbarActionClass,
              "bg-[#175E47] text-white hover:bg-[#1F7E5F]",
            )}
          >
            <Plus className="size-5" aria-hidden />
            افزودن مسئول
          </button>
        }
      />

      <p className="text-sm text-[#61756F]">
        مسئولان اضافه‌شده در صفحه «درباره ما» به‌صورت باکس تماس نمایش داده می‌شوند.
      </p>

      {isLoading ? (
        <p className="text-sm text-[#61756F]">در حال بارگذاری…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-[#D22B23]">
          {error instanceof Error ? error.message : "بارگذاری ناموفق بود."}
        </p>
      ) : null}
      {actionError ? (
        <p className="text-sm text-[#D22B23]">{actionError}</p>
      ) : null}

      {!isLoading && !error ? (
        tableRows.length === 0 ? (
          <p className="text-sm text-[#61756F]">مسئولی ثبت نشده است.</p>
        ) : (
          <Table data={tableRows} columns={columns} size="lg" className="w-full" />
        )
      ) : null}

      {modal?.mode === "add" ? (
        <OfficialFormModal
          mode="add"
          open
          onClose={() => setModal(null)}
          onSubmit={(values) => void handleSubmit(values)}
          isSubmitting={isSaving}
        />
      ) : null}
      {modal?.mode === "edit" ? (
        <OfficialFormModal
          mode="edit"
          open
          row={modal.row}
          onClose={() => setModal(null)}
          onSubmit={(values) => void handleSubmit(values)}
          isSubmitting={isSaving}
        />
      ) : null}
    </div>
  );
}
