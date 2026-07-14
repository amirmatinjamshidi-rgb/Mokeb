"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { Calendar, DocumentText, UserAdd } from "iconsax-reactjs";
import { Filter, Search } from "lucide-react";

import {
  EntryExitTabs,
  FilterBox,
  FloatingLabelSearch,
  PageToolbar,
  Table,
  TablePagination,
  TableRowActionsMenu,
  pageToolbarActionClass,
  toDateKey,
  toPersianDigits,
  usePagination,
  type Column,
  type EntryExitTabId,
  type FilterGroup,
  type FilterValues,
} from "@admin-kit/index";
import {
  useChangeEntranceDate,
  useChangeExitDate,
  useIncomingRequests,
  useOutgoingRequests,
} from "@admin-kit/api/hooks";
import { cn } from "@admin-kit/shared/lib/utils";
import { persianDateToIsoDate } from "@/lib/api/dateFormat";
import { useDebouncedValue } from "@/features/shared/hooks/useDebouncedValue";

import { usePanelDate } from "../PanelDateContext";
import {
  KarvanInfoEditModal,
  type KarvanInfoFormValues,
} from "./KarvanInfoEditModal";
import {
  formatReservationClass,
  type EntryStatus,
  type ExitStatus,
  type ReservationRow,
} from "./mockEntryExitRows";
import { mapRequestToReservationRow } from "./reservationRowMapping";

type TableRow = ReservationRow & { radif: number };

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "status",
    title: "وضعیت",
    options: [
      { id: "all", label: "همه" },
      { id: "pending", label: "در انتظار" },
      { id: "delayed", label: "تاخیر" },
      { id: "done", label: "تکمیل شده" },
    ],
  },
  {
    id: "reservationType",
    title: "نوع رزرو",
    options: [
      { id: "all", label: "همه" },
      { id: "caravan", label: "کاروان" },
      { id: "family", label: "خانواده" },
    ],
  },
];

const DEFAULT_FILTERS: FilterValues = {
  status: "all",
  reservationType: "all",
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

const DocumentTextIcon = createIconsaxIcon(DocumentText);
const UserAddIcon = createIconsaxIcon(UserAdd);
const CalendarIcon = createIconsaxIcon(Calendar);

function persian(value: string | number) {
  return toPersianDigits(value);
}

function entryStatusClass(status: EntryStatus) {
  switch (status) {
    case "در انتظار":
      return "text-[#61756F]";
    case "تاخیر در ورود":
      return "text-[#D8B648]";
    case "پذیرش شده":
      return "text-[#279F78]";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function exitStatusClass(status: ExitStatus) {
  switch (status) {
    case "در انتظار خروج":
      return "text-[#61756F]";
    case "تاخیر در خروج":
      return "text-[#D8B648]";
    case "عدم خروج":
      return "text-[#D22B23]";
    case "خروج ثبت شده":
      return "text-[#279F78]";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function StatusBadge({
  status,
  tab,
}: {
  status: EntryStatus | ExitStatus;
  tab: EntryExitTabId;
}) {
  const className =
    tab === "entry"
      ? entryStatusClass(status as EntryStatus)
      : exitStatusClass(status as ExitStatus);

  return <span className={cn("font-medium", className)}>{status}</span>;
}

function matchesFilters(
  row: ReservationRow,
  filters: FilterValues,
  tab: EntryExitTabId,
): boolean {
  if (filters.reservationType !== "all") {
    const typeMap: Record<string, string> = {
      caravan: "کاروان",
      family: "خانواده",
    };
    if (row.reservationType !== typeMap[filters.reservationType]) return false;
  }

  if (filters.status === "all") return true;

  if (tab === "entry") {
    const status = row.status as EntryStatus;
    if (filters.status === "pending") return status === "در انتظار";
    if (filters.status === "delayed") return status === "تاخیر در ورود";
    if (filters.status === "done") return status === "پذیرش شده";
    return true;
  }

  const status = row.status as ExitStatus;
  if (filters.status === "pending") return status === "در انتظار خروج";
  if (filters.status === "delayed") return status === "تاخیر در خروج";
  if (filters.status === "done") return status === "خروج ثبت شده";
  return true;
}

function buildColumns(handlers: {
  tab: EntryExitTabId;
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onViewKarvan: (row: TableRow) => void;
  onChangeMembers: (row: TableRow) => void;
  onChangeEntryDate: (row: TableRow) => void;
}): Column<TableRow>[] {
  return [
    {
      key: "radif",
      header: "ردیف",
      colClassName: "text-center",
      cellClassName: "overflow-visible",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <input
            type="checkbox"
            checked={handlers.selectedIds.has(row.id)}
            onChange={() => handlers.onToggleRow(row.id)}
            aria-label={`انتخاب ردیف ${row.radif}`}
            className="size-4 shrink-0 cursor-pointer accent-[#175E47]"
          />
          <span>{persian(row.radif)}</span>
        </div>
      ),
    },
    {
      key: "supervisorName",
      header: "نام سرپرست",
      colClassName: "text-center",
      cell: (row) => row.supervisorName,
    },
    {
      key: "reservationType",
      header: "نوع رزرو",
      colClassName: "text-center",
      cell: (row) => row.reservationType,
    },
    {
      key: "reservationClass",
      header: "کلاس",
      colClassName: "text-center",
      cell: (row) => formatReservationClass(row.reservationClass),
    },
    {
      key: "totalCount",
      header: "تعداد کل",
      colClassName: "text-center",
      cell: (row) => persian(row.totalCount),
    },
    {
      key: "maleCount",
      header: "آقایان",
      colClassName: "text-center",
      cell: (row) => persian(row.maleCount),
    },
    {
      key: "femaleCount",
      header: "بانوان",
      colClassName: "text-center",
      cell: (row) => persian(row.femaleCount),
    },
    {
      key: "status",
      header: "وضعیت",
      colClassName: "text-center",
      cell: (row) => (
        <StatusBadge status={row.status} tab={handlers.tab} />
      ),
    },
    {
      key: "reservationCode",
      header: "کد رزرو",
      colClassName: "text-center",
      cell: (row) => persian(row.reservationCode),
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
              label: "مشاهده اطلاعات کاروان",
              icon: DocumentTextIcon,
              onClick: () => handlers.onViewKarvan(row),
            },
            {
              label: "تغییر تعداد اعضا",
              icon: UserAddIcon,
              onClick: () => handlers.onChangeMembers(row),
            },
            {
              label: "تغییر تاریخ ورود",
              icon: CalendarIcon,
              onClick: () => handlers.onChangeEntryDate(row),
            },
          ]}
        />
      ),
    },
  ];
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function OnsiteRegistrationContent() {
  const { selectedDate } = usePanelDate();
  const dateKey = toDateKey(selectedDate);

  const [tab, setTab] = useState<EntryExitTabId>("entry");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterValues>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [karvanModalRow, setKarvanModalRow] = useState<ReservationRow | null>(
    null,
  );

  const incomingQuery = useIncomingRequests(dateKey, debouncedSearch);
  const outgoingQuery = useOutgoingRequests(dateKey, debouncedSearch);
  const activeQuery = tab === "entry" ? incomingQuery : outgoingQuery;

  const changeEntranceDate = useChangeEntranceDate(dateKey, debouncedSearch);
  const changeExitDate = useChangeExitDate(dateKey, debouncedSearch);
  const isMutating = changeEntranceDate.isPending || changeExitDate.isPending;

  const sourceRows = useMemo(
    () => (activeQuery.data ?? []).map((request) => mapRequestToReservationRow(request, tab)),
    [activeQuery.data, tab],
  );

  const filteredRows = useMemo(
    () => sourceRows.filter((row) => matchesFilters(row, appliedFilters, tab)),
    [appliedFilters, sourceRows, tab],
  );

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    setPage,
    setSize,
  } = usePagination(filteredRows, 10);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [search, appliedFilters, tab, setPage]);

  const tableRows: TableRow[] = paginatedItems.map((row, index) => ({
    ...row,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasSelection = selectedIds.size > 0;

  const columns = useMemo(
    () =>
      buildColumns({
        tab,
        selectedIds,
        onToggleRow: toggleRow,
        onViewKarvan: setKarvanModalRow,
        onChangeMembers: () => undefined,
        onChangeEntryDate: (row) => {
          void changeEntranceDate.mutateAsync({
            requestId: row.id,
            date: dateKey,
          });
        },
      }),
    [selectedIds, tab, changeEntranceDate, dateKey],
  );

  const handleKarvanSave = async (
    id: string,
    values: KarvanInfoFormValues,
  ) => {
    const entryIso =
      persianDateToIsoDate(values.entryDate) || values.entryDate;
    const exitIso = persianDateToIsoDate(values.exitDate) || values.exitDate;
    try {
      if (entryIso) {
        await changeEntranceDate.mutateAsync({
          requestId: id,
          date: entryIso.slice(0, 10),
        });
      }
      if (exitIso) {
        await changeExitDate.mutateAsync({
          requestId: id,
          date: exitIso.slice(0, 10),
        });
      }
      setKarvanModalRow(null);
    } catch {
      // errors surface via react-query; keep modal open on failure
    }
  };

  const runBulkDateChange = async (kind: "delay" | "entry" | "exit") => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    const delayDate = toDateKey(addDays(selectedDate, 1));
    const targetDate = kind === "delay" ? delayDate : dateKey;
    try {
      if (kind === "exit") {
        await Promise.all(
          ids.map((requestId) =>
            changeExitDate.mutateAsync({ requestId, date: targetDate }),
          ),
        );
      } else {
        await Promise.all(
          ids.map((requestId) =>
            changeEntranceDate.mutateAsync({ requestId, date: targetDate }),
          ),
        );
      }
      setSelectedIds(new Set());
    } catch {
      // keep selection on failure
    }
  };

  const actionButtonClass =
    "flex h-12 w-full min-w-0 sm:flex-1 items-center justify-center rounded-lg border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex w-full flex-col gap-12">
      {activeQuery.isLoading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : null}
      {activeQuery.error ? (
        <p className="text-sm text-red-500">
          {activeQuery.error instanceof Error
            ? activeQuery.error.message
            : "خطا در دریافت رزروها"}
        </p>
      ) : null}

      <EntryExitTabs value={tab} onValueChange={setTab} />

      <div className="flex w-full flex-col gap-4">
        <PageToolbar
          search={
            <FloatingLabelSearch
              id="onsite-supervisor-search"
              label="جستجو نام سرپرست یا کد رزرو"
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
              فیلتر <Filter className="size-5" aria-hidden />
            </button>
          }
        />

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch">
          <button
            type="button"
            disabled={!hasSelection || isMutating}
            className={cn(
              actionButtonClass,
              "w-full sm:flex-1",
              "border-[#D8B648] bg-white text-[#D8B648] hover:bg-[#FFFBF0]",
            )}
            onClick={() => void runBulkDateChange("delay")}
          >
            ثبت تاخیر
          </button>
          <button
            type="button"
            disabled={!hasSelection || isMutating}
            className={cn(
              actionButtonClass,
              "border-[#175E47] bg-[#175E47] text-white hover:bg-[#1F7E5F]",
            )}
            onClick={() =>
              void runBulkDateChange(tab === "entry" ? "entry" : "exit")
            }
          >
            {tab === "entry" ? "ثبت ورودی" : "ثبت خروجی"}
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

      <FilterBox
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={FILTER_GROUPS}
        defaultValue={appliedFilters}
        onApply={setAppliedFilters}
      />

      <KarvanInfoEditModal
        row={karvanModalRow}
        onClose={() => setKarvanModalRow(null)}
        onSave={(id, values) => void handleKarvanSave(id, values)}
      />
    </div>
  );
}
