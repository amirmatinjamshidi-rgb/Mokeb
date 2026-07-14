"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, XCircle } from "lucide-react";
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
  isLoading?: boolean;
  onDownload?: (row: RoomReservationList) => void;
};

export function MyReservationsContent({
  reservations,
  isLoading,
  onDownload,
}: Props) {
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
  } = usePagination(filteredReservations, 10);

  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.status, filters.sort, setPage]);

  const tableRows = paginatedItems.map((row, index) => ({
    ...row,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const columns = buildColumns({
    onView: (row) => console.log("view", row.id),
    onDownload: (row) =>
      onDownload ? onDownload(row) : console.log("download", row.id),
    onCancel: (row) => console.log("cancel", row.id),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-10 py-8 gap-12">
      <h1 className="flex w-full items-center gap-2 text-2xl font-bold text-gray-500 sm:text-3xl">
        <Image src={ReceiptText} alt="receipt" width={24} height={24} /> رزروهای
        من
      </h1>

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
