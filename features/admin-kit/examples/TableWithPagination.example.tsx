"use client";

import { useMemo } from "react";
import { Eye, Trash2 } from "lucide-react";

import {
  Table,
  TablePagination,
  TableRowActionsMenu,
  usePagination,
  useFormAndViewModals,
  ViewModal,
  type Column,
} from "@admin-kit/index";
import type { Accompany } from "@admin-kit/schemas/managementSchema";

const MOCK_ROWS: Accompany[] = [
  {
    id: 1,
    fullName: "علی رضایی",
    fatherName: "محمد",
    gender: "male",
    birthDate: "1370/05/12",
    city: "تهران",
    nationality: "iranian",
    nationalCode: "1234567890",
    passportNumber: "",
    passportExpiry: "",
    bloodType: "A+",
    diseaseHistory: "",
    mobile1: "09121234567",
    mobile2: "",
    relativePhone: "02112345678",
  },
];

/**
 * Example: dynamic table + pagination + view modal.
 */
export function TableWithPaginationExample() {
  const { viewTarget, openView, closeView } = useFormAndViewModals<Accompany>();
  const { currentPage, totalPages, pageSize, paginatedItems, setPage, setSize } =
    usePagination(
      MOCK_ROWS.map((row, i) => ({ ...row, radif: i + 1 })),
      10,
    );

  const columns = useMemo<Column<Accompany & { radif: number }>[]>(
    () => [
      { key: "radif", header: "ردیف", cell: (r) => r.radif },
      { key: "name", header: "نام", cell: (r) => r.fullName },
      {
        key: "actions",
        header: "عملیات",
        cell: (r) => (
          <TableRowActionsMenu
            items={[
              { label: "مشاهده", icon: Eye, onClick: () => openView(r) },
              { label: "حذف", icon: Trash2, onClick: () => {} },
            ]}
          />
        ),
      },
    ],
    [openView],
  );

  return (
    <div className="flex flex-col gap-4 p-6" dir="rtl">
      <Table data={paginatedItems} columns={columns} />
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setSize}
      />
      <ViewModal accompany={viewTarget} onClose={closeView} />
    </div>
  );
}
