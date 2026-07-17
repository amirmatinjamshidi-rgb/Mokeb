"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, X, XCircle } from "lucide-react";
import { cn } from "@/boss-features/lib/utils";
import {
  Table,
  TablePagination,
  TableRowActionsMenu,
  usePagination,
  type Column,
} from "@admin-kit/index";
import { toPersianDigits } from "@/boss-features/lib/format";
import ReceiptText from "@/public/receipt.png";
import Image from "next/image";
import {
  ReservationFilters,
  type ReservationFilterValues,
} from "@/boss-features/components/KarvanReservation/ReservationFilters";

export type ReservationStatus =
  | "در انتظار تایید"
  | "رزرو فعال"
  | "لغو شده"
  | "عدم حضور";

export type RoomReservationList = {
  id: number;
  radif: number;
  reservationCode: string;
  checkIn: string;
  checkOut: string;
  companionsCount: number;
  supervisorName: string;
  maleCount: number;
  femaleCount: number;
  pilgrims: {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    nationalCode: string;
    passportNumber?: string;
  }[];
  status: ReservationStatus;
  _apiId?: string;
};

function persianCell(value: string | number) {
  return toPersianDigits(value);
}

function statusColorClass(status: ReservationStatus) {
  switch (status) {
    case "رزرو فعال":
      return "text-[#279F78]";
    case "در انتظار تایید":
      return "text-[#C9A227]";
    case "لغو شده":
      return "text-[#D22B23]";
    case "عدم حضور":
      return "text-gray-400";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={cn("font-medium", statusColorClass(status))}>
      {status}
    </span>
  );
}

function ReservationDetailsPanel({
  row,
  onClose,
}: {
  row: RoomReservationList;
  onClose: () => void;
}) {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white p-5 text-sm text-gray-700 shadow-sm"
      dir="rtl"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="font-semibold text-[#175E47]">جزئیات رزرو</p>
        <button
          type="button"
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
          onClick={onClose}
          aria-label="بستن"
        >
          <X className="size-5" />
        </button>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        <li>کد رزرو: {row.reservationCode || "—"}</li>
        <li>وضعیت: {row.status}</li>
        <li>سرپرست: {row.supervisorName || "—"}</li>
        <li>تعداد همراه: {persianCell(row.companionsCount)}</li>
        <li>ورود: {persianCell(row.checkIn || "—")}</li>
        <li>خروج: {persianCell(row.checkOut || "—")}</li>
        <li>آقایان: {persianCell(row.maleCount)}</li>
        <li>بانوان: {persianCell(row.femaleCount)}</li>
      </ul>
      {row.pilgrims.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 font-medium text-[#175E47]">زائران</p>
          <ul className="flex flex-col gap-1 text-xs text-gray-600">
            {row.pilgrims.map((p, i) => (
              <li key={`${p.nationalCode}-${i}`}>
                {[p.firstName, p.lastName].filter(Boolean).join(" ") || "—"}
                {p.nationalCode
                  ? ` — ${toPersianDigits(p.nationalCode)}`
                  : p.passportNumber
                    ? ` — ${p.passportNumber}`
                    : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function buildColumns(
  handlers: {
    onView: (row: RoomReservationList) => void;
    onDownload: (row: RoomReservationList) => void;
    onCancel: (row: RoomReservationList) => void;
  },
): Column<RoomReservationList>[] {
  return [
    {
      key: "radif",
      header: "ردیف",
      colClassName: "text-center",
      cell: (row) => persianCell(row.radif),
    },
    {
      key: "reservationCode",
      header: "کد رزرو",
      colClassName: "text-center",
      cell: (row) => row.reservationCode,
    },
    {
      key: "supervisorName",
      header: "سرپرست",
      colClassName: "text-center",
      cell: (row) => row.supervisorName,
    },
    {
      key: "status",
      header: "وضعیت رزرو",
      colClassName: "text-center",
      cell: (row) => <StatusBadge status={row.status} />,
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
              label: "دانلود رسید",
              icon: Download,
              onClick: () => handlers.onDownload(row),
            },
            ...(row.status === "لغو شده"
              ? []
              : [
                  {
                    label: "لغو رزرو",
                    icon: XCircle,
                    onClick: () => handlers.onCancel(row),
                  },
                ]),
          ]}
        />
      ),
    },
  ];
}

type Props = {
  reservations: RoomReservationList[];
  isLoading?: boolean;
  onDownload?: (row: RoomReservationList) => void;
  onCancel?: (row: RoomReservationList) => Promise<void> | void;
};

export function MyReservationsContent({
  reservations,
  isLoading,
  onDownload,
  onCancel,
}: Props) {
  const [filters, setFilters] = useState<ReservationFilterValues>({
    search: "",
    status: "all",
    sort: "newest",
  });
  const [viewTarget, setViewTarget] = useState<RoomReservationList | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filteredReservations = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    let rows = reservations.filter((row) => {
      const matchesSearch =
        !query || row.reservationCode.toLowerCase().includes(query);

      const matchesStatus =
        filters.status === "all" || row.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      const cmp = a.checkIn.localeCompare(b.checkIn, "fa");
      return filters.sort === "newest" ? -cmp : cmp;
    });

    return rows;
  }, [filters, reservations]);

  const {
    currentPage,
    totalPages,
    pageSize,
    paginatedItems,
    setPage,
    setSize,
  } = usePagination(filteredReservations, 10);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.sort, setPage]);

  const tableRows = paginatedItems.map((row, index) => ({
    ...row,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const handleCancel = async (row: RoomReservationList) => {
    if (row.status === "لغو شده") return;
    const ok = window.confirm(
      `آیا از لغو رزرو «${row.reservationCode}» مطمئن هستید؟`,
    );
    if (!ok) return;

    setActionError(null);
    setActionMessage(null);
    const requestId = row._apiId ?? "";
    setCancellingId(requestId || String(row.id));
    try {
      if (onCancel) {
        await onCancel(row);
      }
      setActionMessage(`رزرو «${row.reservationCode}» لغو شد.`);
      if (viewTarget?._apiId === row._apiId) setViewTarget(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "لغو رزرو ناموفق بود.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const columns = buildColumns({
    onView: (row) => {
      setViewTarget(row);
      setActionError(null);
    },
    onDownload: (row) => {
      setActionError(null);
      if (onDownload) onDownload(row);
      else setActionMessage("دانلود رسید در دسترس نیست.");
    },
    onCancel: (row) => void handleCancel(row),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-12 px-10 py-8" dir="rtl">
      <h1 className="flex w-full items-center gap-2 text-2xl font-bold text-gray-500 sm:text-3xl">
        <Image src={ReceiptText} alt="receipt" width={24} height={24} /> رزروهای
        من
      </h1>

      {actionMessage ? (
        <p className="text-sm text-[#175E47]">{actionMessage}</p>
      ) : null}

      {cancellingId ? (
        <p className="text-sm text-[#61756F]">در حال لغو رزرو…</p>
      ) : null}
      {actionError ? (
        <p className="text-sm text-[#D22B23]">{actionError}</p>
      ) : null}

      {viewTarget ? (
        <ReservationDetailsPanel
          row={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      ) : null}

      <ReservationFilters values={filters} onChange={setFilters} />

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
    </div>
  );
}
