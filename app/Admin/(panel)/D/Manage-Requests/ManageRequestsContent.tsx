"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { CloseCircle, ReceiptSearch, TickCircle } from "iconsax-reactjs";
import { Download, Filter, Search } from "lucide-react";

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
  useAcceptRequest,
  useDownloadRequestPdf,
  useRejectRequest,
  useRequestedRequests,
  useRequests,
  useRoomAvailabilities,
  mapRoomAvailabilityDto,
  type RoomAvailabilityRow,
} from "@admin-kit/api/hooks";
import { roomApi } from "@/lib/api";
import type { RoomAvailabilityDto } from "@/lib/api/types";
import { toDateKey } from "@admin-kit/ui/dateCarouselUtils";

import { usePanelDate } from "../PanelDateContext";
import { KarvanRequestReviewModal } from "./KarvanRequestReviewModal";
import type { KarvanRequest, KarvanRequestStatus } from "./requestTypes";
import { useDebouncedValue } from "@/features/shared/hooks/useDebouncedValue";

type KarvanRequestRow = KarvanRequest & { radif: number };

const STATUS_FILTER_MAP: Record<string, KarvanRequestStatus> = {
  pending: "در انتظار بررسی",
  approved: "تایید شده",
  rejected: "رد شده",
};

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "status",
    title: "وضعیت درخواست",
    options: [
      { id: "all", label: "همه" },
      { id: "pending", label: "در انتظار بررسی" },
      { id: "approved", label: "تایید شده" },
      { id: "rejected", label: "رد شده" },
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

const ReceiptSearchIcon = createIconsaxIcon(ReceiptSearch);
const TickCircleIcon = createIconsaxIcon(TickCircle);
const CloseCircleIcon = createIconsaxIcon(CloseCircle);

function persian(value: string | number) {
  return toPersianDigits(value);
}

function requestStatusClass(status: KarvanRequestStatus) {
  switch (status) {
    case "در انتظار بررسی":
      return "text-[#D8B648]";
    case "رد شده":
      return "text-[#D22B23]";
    case "تایید شده":
      return "text-[#279F78]";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function StatusBadge({ status }: { status: KarvanRequestStatus }) {
  return (
    <span className={cn("font-medium", requestStatusClass(status))}>
      {status}
    </span>
  );
}

/** Requested (pending) rows are the freshest for review; overlay them onto the full incoming+outgoing set. */
function mergeRequests(
  allRequests: KarvanRequest[],
  requestedRequests: KarvanRequest[],
): KarvanRequest[] {
  const merged = new Map<string, KarvanRequest>();
  for (const request of allRequests) {
    merged.set(request.id, request);
  }
  for (const request of requestedRequests) {
    merged.set(request.id, request);
  }
  return [...merged.values()];
}

/** Rooms matching the request's needed gender(s); falls back to all available rooms. */
function pickRoomAvailabilityIds(
  row: KarvanRequestRow,
  roomAvailabilities: RoomAvailabilityRow[],
): string[] | undefined {
  if (roomAvailabilities.length === 0) return undefined;

  const needsMale = row.maleCount > 0;
  const needsFemale = row.femaleCount > 0;
  const matched = roomAvailabilities.filter(
    (room) =>
      (needsMale && room.gender === "مرد") ||
      (needsFemale && room.gender === "زن"),
  );

  const pool = matched.length > 0 ? matched : roomAvailabilities;
  return pool.map((room) => room.id).filter(Boolean);
}

function normalizeDistinctAvailabilities(raw: unknown): RoomAvailabilityRow[] {
  if (Array.isArray(raw)) {
    return (raw as RoomAvailabilityDto[]).map(mapRoomAvailabilityDto);
  }
  if (raw && typeof raw === "object") {
    const grouped = raw as {
      maleRoomAvailabilities?: RoomAvailabilityDto[];
      femaleRoomAvailabilities?: RoomAvailabilityDto[];
      items?: RoomAvailabilityDto[];
      Items?: RoomAvailabilityDto[];
    };
    const list = grouped.items ?? grouped.Items;
    if (Array.isArray(list)) {
      return list.map(mapRoomAvailabilityDto);
    }
    return [
      ...(grouped.maleRoomAvailabilities ?? []),
      ...(grouped.femaleRoomAvailabilities ?? []),
    ].map(mapRoomAvailabilityDto);
  }
  return [];
}

async function resolveRoomAvailabilityIds(
  row: KarvanRequestRow,
  fallback: RoomAvailabilityRow[],
): Promise<string[] | undefined> {
  try {
    const raw = await roomApi.getDistinctRoomAvailabilities(row.id);
    const distinct = normalizeDistinctAvailabilities(raw);
    const fromDistinct = pickRoomAvailabilityIds(row, distinct);
    if (fromDistinct && fromDistinct.length > 0) return fromDistinct;
  } catch {
    // Fall back to date-scoped availabilities when Distinct endpoint fails.
  }
  return pickRoomAvailabilityIds(row, fallback);
}

function buildColumns(handlers: {
  onReview: (row: KarvanRequestRow) => void;
  onApprove: (row: KarvanRequestRow) => void;
  onReject: (row: KarvanRequestRow) => void;
  onDownload: (row: KarvanRequestRow) => void;
}): Column<KarvanRequestRow>[] {
  return [
    {
      key: "radif",
      header: "ردیف",
      colClassName: "text-center",
      cell: (row) => persian(row.radif),
    },
    {
      key: "supervisorName",
      header: "نام سرپرست",
      colClassName: "text-center",
      cell: (row) => row.supervisorName,
    },
    {
      key: "totalCapacity",
      header: "ظرفیت کل",
      colClassName: "text-center",
      cell: (row) => persian(row.totalCapacity),
    },
    {
      key: "maleCount",
      header: "تعداد آقایان",
      colClassName: "text-center",
      cell: (row) => persian(row.maleCount),
    },
    {
      key: "femaleCount",
      header: "تعداد بانوان",
      colClassName: "text-center",
      cell: (row) => persian(row.femaleCount),
    },
    {
      key: "entryDate",
      header: "تاریخ ورود",
      colClassName: "text-center",
      cell: (row) => persian(row.entryDate),
    },
    {
      key: "exitDate",
      header: "تاریخ خروج",
      colClassName: "text-center",
      cell: (row) => persian(row.exitDate),
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
              label: "بررسی اطلاعات کاروان",
              icon: ReceiptSearchIcon,
              onClick: () => handlers.onReview(row),
            },
            {
              label: "دانلود PDF",
              icon: Download,
              onClick: () => handlers.onDownload(row),
            },
            {
              label: "تایید درخواست",
              icon: TickCircleIcon,
              onClick: () => {
                if (row.status !== "تایید شده") {
                  handlers.onApprove(row);
                }
              },
            },
            {
              label: "رد درخواست",
              icon: CloseCircleIcon,
              onClick: () => {
                if (row.status !== "رد شده") {
                  handlers.onReject(row);
                }
              },
            },
          ]}
        />
      ),
    },
  ];
}

type Props = {
  requests?: KarvanRequest[];
};

export function ManageRequestsContent({
  requests = [],
}: Props) {
  const { selectedDate } = usePanelDate();
  const dateKey = toDateKey(selectedDate);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const {
    data: requestedItems = [],
    isLoading: requestedLoading,
    error: requestedError,
  } = useRequestedRequests(dateKey);
  const {
    data: allItems = requests,
    isLoading: allLoading,
    error: allError,
  } = useRequests(dateKey, debouncedSearch);
  const { data: roomAvailabilities = [] } = useRoomAvailabilities(dateKey);
  const acceptRequest = useAcceptRequest(dateKey, debouncedSearch);
  const rejectRequest = useRejectRequest(dateKey, debouncedSearch);
  const downloadPdf = useDownloadRequestPdf();
  const isLoading = requestedLoading || allLoading;
  const error = requestedError ?? allError;
  const items = useMemo(
    () => mergeRequests(allItems, requestedItems),
    [allItems, requestedItems],
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterValues>(DEFAULT_FILTERS);
  const [reviewTarget, setReviewTarget] = useState<KarvanRequest | null>(null);

  const filteredRequests = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return items.filter((request) => {
      // Incoming/outgoing already filtered by API Search when query is set;
      // still filter requested-merge rows + keep status filter client-side.
      const matchesSearch =
        !query ||
        request.supervisorName.toLowerCase().includes(query) ||
        request.entryDate.includes(query) ||
        request.exitDate.includes(query) ||
        request.status.includes(query) ||
        request.reservationCode.toLowerCase().includes(query) ||
        String(request.totalCapacity).includes(query);

      const matchesStatus =
        appliedFilters.status === "all" ||
        request.status === STATUS_FILTER_MAP[appliedFilters.status];

      return matchesSearch && matchesStatus;
    });
  }, [appliedFilters, items, debouncedSearch]);

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    setPage,
    setSize,
  } = usePagination(filteredRequests, 10);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, appliedFilters, setPage]);

  const tableRows: KarvanRequestRow[] = paginatedItems.map((request, index) => ({
    ...request,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const columns = useMemo(
    () =>
      buildColumns({
        onReview: setReviewTarget,
        onApprove: (row) => {
          void (async () => {
            const roomAvailabilityIds = await resolveRoomAvailabilityIds(
              row,
              roomAvailabilities,
            );
            await acceptRequest.mutateAsync({
              requestId: row.id,
              roomAvailabilityIds,
              assignAmount: Math.max(1, row.maleCount + row.femaleCount),
            });
          })();
        },
        onReject: (row) => {
          void rejectRequest.mutateAsync(row.id);
        },
        onDownload: (row) => {
          void downloadPdf
            .mutateAsync(row.id)
            .then((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `request-${row.id}.pdf`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(url);
            });
        },
      }),
    [acceptRequest, rejectRequest, downloadPdf, roomAvailabilities],
  );

  return (
    <div className="flex w-full flex-col gap-12">
      {isLoading ? <p className="text-sm text-gray-500">در حال بارگذاری...</p> : null}
      {error ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "خطا در دریافت درخواست‌ها"}
        </p>
      ) : null}
      <PageToolbar
        search={
          <FloatingLabelSearch
            id="manage-requests-search"
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
            فیلتر <Filter className="size-5" aria-hidden />
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

      <KarvanRequestReviewModal
        request={reviewTarget}
        onClose={() => setReviewTarget(null)}
      />
    </div>
  );
}
