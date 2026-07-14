"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { CloseCircle, Eye } from "iconsax-reactjs";
import { Filter, Search } from "lucide-react";

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
  useAllPrincipals,
} from "@admin-kit/api/hooks";

import { UserViewModal } from "./UserViewModal";

type TableRow = AdminUserRow & { radif: number };

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "status",
    title: "وضعیت کاربران",
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

function createIconsaxIcon(
  Icon: ComponentType<{
    className?: string;
    variant?: "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";
    color?: string;
    size?: string | number;
  }>,
): ComponentType<{ className?: string }> {
  return function IconsaxMenuIcon({ className }: { className?: string }) {
    return (
      <Icon variant="Outline" className={className} color="currentColor" size={16} />
    );
  };
}

const EyeIcon = createIconsaxIcon(Eye);
const CloseCircleIcon = createIconsaxIcon(CloseCircle);

function persian(value: string | number) {
  return toPersianDigits(value);
}

function accountTypeLabel(accountType: AdminUserRow["accountType"]) {
  return accountType === "caravan" ? "کاروان" : "کاربر";
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
  onToggleStatus: (row: TableRow) => void;
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
      key: "accountType",
      header: "نوع حساب",
      colClassName: "text-center",
      cell: (row) => accountTypeLabel(row.accountType),
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
              label: "مشاهده اطلاعات کاربر",
              icon: EyeIcon,
              onClick: () => handlers.onView(row),
            },
            {
              label:
                row.status === "فعال"
                  ? "غیر فعال کردن"
                  : "فعال کردن",
              icon: CloseCircleIcon,
              onClick: () => handlers.onToggleStatus(row),
            },
          ]}
        />
      ),
    },
  ];
}

export function ManageUsersContent() {
  const [search, setSearch] = useState("");
  const { data: items = [], isLoading, error } = useAllPrincipals(search);
  const activatePrincipal = useActivatePrincipal();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterValues>(DEFAULT_FILTERS);
  const [viewTarget, setViewTarget] = useState<AdminUserRow | null>(null);
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
        type: row.accountType,
        id: row.id,
        active: nextActive,
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "تغییر وضعیت ناموفق بود.",
      );
    }
  };

  const columns = useMemo(
    () =>
      buildColumns({
        onView: setViewTarget,
        onToggleStatus: (row) => {
          void handleToggleStatus(row);
        },
      }),
    [activatePrincipal],
  );

  return (
    <div className="flex w-full flex-col gap-12">
      {isLoading ? <p className="text-sm text-gray-500">در حال بارگذاری...</p> : null}
      {error ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "خطا در دریافت اطلاعات کاربران"}
        </p>
      ) : null}
      {actionError ? <p className="text-sm text-red-500">{actionError}</p> : null}
      <PageToolbar
        search={
          <FloatingLabelSearch
            id="admin-user-search"
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
            <Filter className="size-5" aria-hidden />
            فیلتر
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

      <UserViewModal user={viewTarget} onClose={() => setViewTarget(null)} />
    </div>
  );
}
