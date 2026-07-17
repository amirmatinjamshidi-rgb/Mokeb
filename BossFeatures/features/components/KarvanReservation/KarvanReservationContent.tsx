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
  const [viewTarget, setViewTarget] = useState<RoomReservationList | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

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
    onView: (row) => {
      setViewTarget(row);
      setActionMessage(null);
    },
    onDownload: (row) => {
      setActionMessage(null);
      if (onDownload) onDownload(row);
      else setActionMessage("دانلود رسید در دسترس نیست.");
    },
    onCancel: (row) => {
      setActionMessage(
        `لغو رزرو «${row.reservationCode || row.id}» از سمت بک‌اند پشتیبانی نشده؛ با پشتیبانی موکب تماس بگیرید.`,
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center">
        <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col px-10 py-8 gap-12" dir="rtl">
      <h1 className="flex w-full items-center gap-2 text-2xl font-bold text-gray-500 sm:text-3xl">
        <Image src={ReceiptText} alt="receipt" width={24} height={24} /> رزروهای
        من
      </h1>

      {actionMessage ? (
        <p className="text-sm text-[#175E47]">{actionMessage}</p>
      ) : null}

      {viewTarget ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="font-semibold text-[#175E47]">جزئیات رزرو</p>
            <button
              type="button"
              className="text-xs text-gray-500 underline"
              onClick={() => setViewTarget(null)}
            >
              بستن
            </button>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li>کد: {toPersianDigits(viewTarget.reservationCode || "—")}</li>
            <li>وضعیت: {viewTarget.status}</li>
            <li>ورود: {toPersianDigits(viewTarget.checkIn || "—")}</li>
            <li>خروج: {toPersianDigits(viewTarget.checkOut || "—")}</li>
            <li>سرپرست: {viewTarget.supervisorName || "—"}</li>
            <li>تعداد زائران: {toPersianDigits(viewTarget.companionsCount)}</li>
            <li>مرد: {toPersianDigits(viewTarget.maleCount)}</li>
            <li>زن: {toPersianDigits(viewTarget.femaleCount)}</li>
          </ul>
          {viewTarget.pilgrims.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <p className="mb-2 font-medium text-[#175E47]">لیست زائران</p>
              <table className="w-full min-w-[480px] text-center text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="py-2">نام</th>
                    <th className="py-2">نام خانوادگی</th>
                    <th className="py-2">جنسیت</th>
                    <th className="py-2">کد ملی</th>
                    <th className="py-2">پاسپورت</th>
                  </tr>
                </thead>
                <tbody>
                  {viewTarget.pilgrims.map((p, i) => (
                    <tr key={`${p.nationalCode}-${i}`} className="border-b border-gray-50">
                      <td className="py-2">{p.firstName || "—"}</td>
                      <td className="py-2">{p.lastName || "—"}</td>
                      <td className="py-2">
                        {p.gender === "female" ? "زن" : "مرد"}
                      </td>
                      <td className="py-2">
                        {toPersianDigits(p.nationalCode || "—")}
                      </td>
                      <td className="py-2">
                        {toPersianDigits(p.passportNumber || "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
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
