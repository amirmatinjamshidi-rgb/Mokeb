"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Filter, Pencil, Power, Search, Trash2 } from "lucide-react";

import {
  FilterBox,
  FloatingLabelSearch,
  PageToolbar,
  Table,
  TablePagination,
  TableRowActionsMenu,
  pageToolbarActionClass,
  usePagination,
  type Column,
  type FilterGroup,
  type FilterValues,
} from "@admin-kit/index";
import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";
import {
  type AdminUserRow,
  useActivatePrincipal,
  useCaravans,
  useDeleteCaravan,
  useUpdateCaravan,
} from "@admin-kit/api/hooks";

import { KarvanFormModal, type KarvanFormValues } from "./KarvanFormModal";
import { KarvanViewModal } from "./KarvanViewModal";

type TableRow = AdminUserRow & { radif: number };

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "status",
    title: "وضعیت کاروان‌ها",
    options: [
      { id: "all", label: "همه" },
      { id: "active", label: "فعال" },
      { id: "inactive", label: "غیر فعال" },
    ],
  },
];

const DEFAULT_FILTERS: FilterValues = {
  status: "all",
};

function persian(value: string | number) {
  return toPersianDigits(value);
}

function StatusBadge({ status }: { status: AdminUserRow["status"] }) {
  return (
    <span
      className={cn(
        "font-medium",
        status === "فعال" ? "text-[#279F78]" : "text-[#D22B23]",
      )}
    >
      {status}
    </span>
  );
}

function buildColumns(handlers: {
  onView: (row: TableRow) => void;
  onEdit: (row: TableRow) => void;
  onToggleStatus: (row: TableRow) => void;
  onDelete: (row: TableRow) => void;
}): Column<TableRow>[] {
  return [
    {
      key: "radif",
      header: "ردیف",
      colClassName: "text-center",
      cell: (row) => persian(row.radif),
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
      key: "nationalCode",
      header: "کد ملی",
      colClassName: "text-center",
      cell: (row) => persian(row.nationalCode),
    },
    {
      key: "mobile",
      header: "شماره موبایل",
      colClassName: "text-center",
      cell: (row) => persian(row.mobile),
    },
    {
      key: "status",
      header: "وضعیت",
      colClassName: "text-center",
      cell: (row) => <StatusBadge status={row.status} />,
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
              label: "مشاهده",
              icon: Eye,
              onClick: () => handlers.onView(row),
            },
            {
              label: "ویرایش",
              icon: Pencil,
              onClick: () => handlers.onEdit(row),
            },
            {
              label: row.status === "فعال" ? "غیر فعال کردن" : "فعال کردن",
              icon: Power,
              onClick: () => handlers.onToggleStatus(row),
            },
            {
              label: "حذف",
              icon: Trash2,
              onClick: () => handlers.onDelete(row),
            },
          ]}
        />
      ),
    },
  ];
}

export function ManageKarvanContent() {
  const [search, setSearch] = useState("");
  const { data: items = [], isLoading, error } = useCaravans(search);
  const activatePrincipal = useActivatePrincipal();
  const deleteCaravan = useDeleteCaravan();
  const updateCaravan = useUpdateCaravan();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterValues>(DEFAULT_FILTERS);
  const [viewTarget, setViewTarget] = useState<AdminUserRow | null>(null);
  const [editTarget, setEditTarget] = useState<AdminUserRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return items.filter((user) => {
      const matchesStatus =
        appliedFilters.status === "all" ||
        (appliedFilters.status === "active" && user.status === "فعال") ||
        (appliedFilters.status === "inactive" && user.status === "غیر فعال");

      return matchesStatus;
    });
  }, [appliedFilters, items]);

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    setPage,
    setSize,
  } = usePagination(filteredUsers, 10);

  useEffect(() => {
    setPage(1);
  }, [search, appliedFilters, setPage]);

  const tableRows: TableRow[] = paginatedItems.map((user, index) => ({
    ...user,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const handleToggleStatus = async (row: TableRow) => {
    if (!row.id) return;
    setActionError(null);
    const nextActive = row.status !== "فعال";
    try {
      await activatePrincipal.mutateAsync({
        type: "caravan",
        id: row.id,
        active: nextActive,
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "تغییر وضعیت ناموفق بود.",
      );
    }
  };

  const handleDelete = async (row: TableRow) => {
    if (!row.id) return;
    const ok = window.confirm(
      `کاروان «${row.firstName} ${row.lastName}» حذف شود؟`,
    );
    if (!ok) return;
    setActionError(null);
    try {
      await deleteCaravan.mutateAsync(row.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "حذف ناموفق بود.");
    }
  };

  const columns = useMemo(
    () =>
      buildColumns({
        onView: setViewTarget,
        onEdit: setEditTarget,
        onToggleStatus: (row) => {
          void handleToggleStatus(row);
        },
        onDelete: (row) => {
          void handleDelete(row);
        },
      }),
    [activatePrincipal, deleteCaravan],
  );

  const handleEditSubmit = async (values: KarvanFormValues) => {
    if (!editTarget) return;
    setActionError(null);
    try {
      await updateCaravan.mutateAsync({
        caravanId: editTarget.id,
        body: {
          name: values.name.trim(),
          familyName: values.familyName.trim(),
          nationalCode: values.nationalCode.trim(),
          phoneNumber: values.phoneNumber.trim(),
        },
      });
      setEditTarget(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "ذخیره ناموفق بود.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-12">
      {isLoading ? <p className="text-sm text-gray-500">در حال بارگذاری...</p> : null}
      {error ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "خطا در دریافت اطلاعات کاروان‌ها"}
        </p>
      ) : null}
      {actionError ? <p className="text-sm text-red-500">{actionError}</p> : null}

      <PageToolbar
        search={
          <FloatingLabelSearch
            id="karvan-user-search"
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
            onClick={() => setFiltersOpen(true)}
            className={cn(
              pageToolbarActionClass,
              "border border-[#175E47] bg-white text-[#175E47] hover:bg-[#F5F9F6]",
            )}
          >
            <Filter className="size-5" aria-hidden /> فیلتر
          </button>
        }
      />

      <Table data={tableRows} columns={columns} size="lg" className="w-full" />

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />

      <FilterBox
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={FILTER_GROUPS}
        defaultValue={appliedFilters}
        onApply={setAppliedFilters}
      />

      <KarvanViewModal user={viewTarget} onClose={() => setViewTarget(null)} />

      <KarvanFormModal
        open={Boolean(editTarget)}
        row={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={(values) => void handleEditSubmit(values)}
        isSubmitting={updateCaravan.isPending}
      />
    </div>
  );
}
