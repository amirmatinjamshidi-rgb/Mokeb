"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, ReceiptText, XCircle } from "lucide-react";
import { cn } from "@/features/shared/lib/utils";
import { Table, type Column } from "@/features/shared/table/MainTable";
import {
  TablePagination,
  usePagination,
} from "@/features/shared/table/TablePagination";
import { TableRowActionsMenu } from "@/features/shared/table/TableRowActionsMenu";
import { toPersianDigits } from "@/features/shared/lib/format";
import {
  ReservationFilters,
  type ReservationFilterValues,
} from "./ReservationFilters";
export type ReservationStatus = "رزرو فعال" | "لغو شده" | "عدم حضور";

export type RoomReservationList = {
  id: number;
  radif: number;
  reservationCode: string;
  checkIn: string;
  checkOut: string;
  companionsCount: number;
  status: ReservationStatus;
};

function persianCell(value: string | number) {
  return toPersianDigits(value);
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const colorClass =
    status === "رزرو فعال"
      ? "text-[#279F78]"
      : status === "لغو شده"
        ? "text-[#D22B23]"
        : "text-gray-400";

  return <span className={cn("font-medium", colorClass)}>{status}</span>;
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
      key: "checkIn",
      header: "تاریخ ورود",
      colClassName: "text-center",
      cell: (row) => persianCell(row.checkIn),
    },
    {
      key: "checkOut",
      header: "تاریخ خروج",
      colClassName: "text-center",
      cell: (row) => persianCell(row.checkOut),
    },
    {
      key: "companionsCount",
      header: "تعداد همراهان",
      colClassName: "text-center",
      cell: (row) => `${persianCell(row.companionsCount)} نفر`,
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
            {
              label: "لغو رزرو",
              icon: XCircle,
              onClick: () => handlers.onCancel(row),
            },
          ]}
        />
      ),
    },
  ];
}

type Props = {
  reservations: RoomReservationList[];
};

export function MyReservationsContent({ reservations }: Props) {
  const [filters, setFilters] = useState<ReservationFilterValues>({
    search: "",
    status: "all",
    sort: "newest",
  });

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
  } = usePagination(filteredReservations, 20);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.sort, setPage]);

  const tableRows = paginatedItems.map((row, index) => ({
    ...row,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const columns = buildColumns({
    onView: (row) => console.log("view", row.id),
    onDownload: (row) => console.log("download", row.id),
    onCancel: (row) => console.log("cancel", row.id),
  });

  return (
    <div className="flex w-full flex-col gap-8">
      <h1 className="flex w-full items-center gap-2 text-2xl font-bold text-gray-500 sm:text-3xl">
        <ReceiptText className="size-7 sm:size-8" /> رزروهای من
      </h1>

      <ReservationFilters values={filters} onChange={setFilters} />

      <Table
        data={tableRows}
        columns={columns}
        size="lg"
        className="w-full"
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
