"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { CloseCircle, Eye } from "iconsax-reactjs";
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
  useAddRoom,
  useAddRoomAvailability,
  useAllRooms,
  useChangeRoomAvailabilityDate,
  useDeleteRoom,
  useRoomAvailabilities,
  useRoomReportStats,
} from "@admin-kit/api/hooks";
import { startOfDay, toDateKey } from "@admin-kit/ui/dateCarouselUtils";
import { useRoomCatalogStore } from "@admin-kit/settings/useRoomCatalogStore";
import { Gender } from "@/lib/api/types";
import { PersianDateField } from "@/features/shared/ui/PersianDateField";

import { CapacityFormModal, type CapacityFormValues } from "./CapacityFormModal";
import { CapacitySummaryBar } from "./CapacitySummaryBar";
import { type CapacityRow } from "./mockCapacityData";

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

const EyeIcon = createIconsaxIcon(Eye);
const CloseCircleIcon = createIconsaxIcon(CloseCircle);

type TableRow = CapacityRow & {
  radif: number;
  roomId?: string;
  date?: string;
};

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
      key: "className",
      header: "کلاس",
      colClassName: "text-center",
      cell: (row) => toPersianDigits(row.className),
    },
    {
      key: "capacity",
      header: "ظرفیت کلاس",
      colClassName: "text-center",
      cell: (row) => toPersianDigits(row.capacity),
    },
    {
      key: "gender",
      header: "جنسیت",
      colClassName: "text-center",
      cell: (row) => row.gender,
    },
    {
      key: "reservationKind",
      header: "نوع رزرو",
      colClassName: "text-center",
      cell: (row) => row.reservationKind,
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
              label: "فعال‌سازی / ویرایش تاریخ",
              icon: EyeIcon,
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

export function CapacityManagementTab() {
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const dateKey = toDateKey(selectedDate);
  const { data: rows = [], isLoading, error, refetch } =
    useRoomAvailabilities(dateKey);
  const { data: roomStats } = useRoomReportStats(dateKey);
  const { data: allRooms = [] } = useAllRooms(true);
  const addRoom = useAddRoom(dateKey);
  const addRoomAvailability = useAddRoomAvailability(dateKey);
  const changeAvailabilityDate = useChangeRoomAvailabilityDate(dateKey);
  const deleteRoom = useDeleteRoom(dateKey);
  const upsertRoom = useRoomCatalogStore((s) => s.upsertRoom);
  const removeCatalogRoom = useRoomCatalogStore((s) => s.removeRoom);
  const findByNameGender = useRoomCatalogStore((s) => s.findByNameGender);

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TableRow | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Sync rooms from GET /Room (authoritative UUID list) + day availabilities.
  useEffect(() => {
    for (const room of allRooms) {
      const roomId = String(room.roomId ?? "").trim();
      if (!roomId) continue;
      upsertRoom({
        roomId,
        name: room.name,
        gender: room.gender ?? Gender.Male,
        capacity: room.capacity,
      });
    }
    for (const row of rows) {
      const roomId = String(row.roomId ?? "").trim();
      if (!roomId) continue;
      upsertRoom({
        roomId,
        name: row.className,
        gender: row.gender === "زن" ? Gender.Female : Gender.Male,
        capacity: row.capacity,
      });
    }
  }, [allRooms, rows, upsertRoom]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        row.className.includes(query) ||
        row.gender.includes(query) ||
        row.reservationKind.includes(query),
    );
  }, [rows, search]);

  const tableRows: TableRow[] = filteredRows.map((row, index) => ({
    ...row,
    radif: index + 1,
  }));

  const columns = useMemo(
    () =>
      buildColumns({
        onEdit: setEditTarget,
        onDelete: (row) => {
          const id = String(row.roomId ?? "").trim();
          if (!id) {
            setActionError("شناسه اتاق برای حذف موجود نیست.");
            return;
          }
          void deleteRoom
            .mutateAsync(id)
            .then(() => {
              removeCatalogRoom(id);
              setActionMessage("اتاق حذف شد.");
              void refetch();
            })
            .catch((err) => {
              setActionError(
                err instanceof Error ? err.message : "حذف اتاق ناموفق بود.",
              );
            });
        },
      }),
    [deleteRoom, refetch, removeCatalogRoom],
  );

  const handleAdd = async (values: CapacityFormValues) => {
    setActionError(null);
    setActionMessage(null);
    const gender = values.gender === "زن" ? Gender.Female : Gender.Male;
    const name = values.classLabel.trim() || values.classLevel.trim();
    const capacity = Number(values.capacity) || 0;
    const typedRoomId = values.roomId?.trim() ?? "";
    const catalogId = findByNameGender(name, gender)?.roomId ?? "";
    const enterDate = values.enterDate.trim() || dateKey;
    const exitDate = values.exitDate.trim() || enterDate;

    if (exitDate < enterDate) {
      setActionError("تاریخ خروج باید هم‌زمان یا بعد از تاریخ ورود باشد.");
      return;
    }

    try {
      if (typedRoomId) {
        const result = await addRoom.mutateAsync({
          name,
          capacity,
          gender,
          roomId: typedRoomId,
          availabilityDate: enterDate,
          exitDate,
        });
        upsertRoom({ roomId: result.roomId, name, gender, capacity });
        setActionMessage(
          `ظرفیت بازه ${enterDate} تا ${exitDate} ثبت شد (${result.roomId.slice(0, 8)}…).`,
        );
      } else if (catalogId) {
        await addRoomAvailability.mutateAsync({
          roomId: catalogId,
          capacity,
          date: enterDate,
          exitDate,
        });
        upsertRoom({ roomId: catalogId, name, gender, capacity });
        setActionMessage(`ظرفیت بازه ${enterDate} تا ${exitDate} فعال شد.`);
      } else {
        const result = await addRoom.mutateAsync({
          name,
          capacity,
          gender,
          availabilityDate: enterDate,
          exitDate,
        });
        upsertRoom({
          roomId: result.roomId,
          name,
          gender,
          capacity,
        });
        setActionMessage(
          `اتاق و ظرفیت بازه ${enterDate} تا ${exitDate} ثبت شد (${result.roomId.slice(0, 8)}…).`,
        );
      }
      setAddOpen(false);
      void refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "افزودن ظرفیت ناموفق بود.",
      );
    }
  };

  const handleEdit = async (values: CapacityFormValues) => {
    if (!editTarget) return;
    setActionError(null);
    setActionMessage(null);
    const roomId = String(
      values.roomId?.trim() || editTarget.roomId || "",
    ).trim();
    const availabilityId = String(editTarget.id ?? "").trim();
    const enterDate = values.enterDate.trim() || dateKey;
    const exitDate = values.exitDate.trim() || enterDate;
    const currentDate = (editTarget.date ?? dateKey).slice(0, 10);

    if (!roomId) {
      setActionError("شناسه اتاق برای فعال‌سازی تاریخ لازم است.");
      return;
    }
    if (exitDate < enterDate) {
      setActionError("تاریخ خروج باید هم‌زمان یا بعد از تاریخ ورود باشد.");
      return;
    }

    try {
      const singleDayEdit =
        enterDate === exitDate &&
        Boolean(availabilityId) &&
        availabilityId !== roomId &&
        enterDate !== currentDate;

      if (singleDayEdit) {
        await changeAvailabilityDate.mutateAsync({
          roomId,
          roomAvailabilityId: availabilityId,
          newDate: enterDate,
        });
        setActionMessage(
          `تاریخ ظرفیت از ${currentDate} به ${enterDate} تغییر کرد.`,
        );
      } else {
        await addRoomAvailability.mutateAsync({
          roomId,
          capacity: Number(values.capacity) || editTarget.capacity,
          date: enterDate,
          exitDate,
        });
        setActionMessage(
          `ظرفیت بازه ${enterDate} تا ${exitDate} برای این اتاق فعال شد.`,
        );
      }

      upsertRoom({
        roomId,
        name: editTarget.className,
        gender: editTarget.gender === "زن" ? Gender.Female : Gender.Male,
        capacity: Number(values.capacity) || editTarget.capacity,
      });
      setEditTarget(null);
      void refetch();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "به‌روزرسانی ظرفیت ناموفق بود.",
      );
    }
  };

  const editSubmitting =
    addRoomAvailability.isPending || changeAvailabilityDate.isPending;

  return (
    <div className="flex w-full flex-col gap-8">
      {isLoading ? <p className="text-sm text-gray-500">در حال بارگذاری...</p> : null}
      {error ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "خطا در دریافت ظرفیت اتاق‌ها"}
        </p>
      ) : null}
      <CapacitySummaryBar stats={roomStats} />

      <PageToolbar
        search={
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
            <div className="w-full max-w-xs">
              <PersianDateField
                value={dateKey}
                onChange={(iso) => {
                  if (!iso) return;
                  setSelectedDate(startOfDay(new Date(`${iso}T00:00:00`)));
                }}
                outputFormat="iso"
                placeholder="تاریخ ظرفیت"
              />
            </div>
            <FloatingLabelSearch
              id="capacity-search"
              label="جستجو"
              value={search}
              onChange={setSearch}
              icon={<Search className="size-5" aria-hidden />}
              containerClassName="w-full shadow-sm shadow-gray-300 border-white"
            />
          </div>
        }
        actions={
          <button
            type="button"
            onClick={() => {
              setActionError(null);
              setAddOpen(true);
            }}
            disabled={addRoom.isPending || addRoomAvailability.isPending}
            className={cn(
              pageToolbarActionClass,
              "bg-[#175E47] text-white hover:bg-[#1F7E5F]",
            )}
          >
            <Plus className="size-5" aria-hidden />
            {addRoom.isPending || addRoomAvailability.isPending
              ? "در حال ثبت…"
              : "افزودن ظرفیت"}
          </button>
        }
      />

      {actionMessage ? (
        <p className="text-sm text-[#175E47]">{actionMessage}</p>
      ) : null}
      {actionError ? (
        <p className="text-sm text-red-600">{actionError}</p>
      ) : null}

      <Table data={tableRows} columns={columns} size="lg" className="w-full" />

      <CapacityFormModal
        mode="add"
        open={addOpen}
        defaultDate={dateKey}
        onClose={() => setAddOpen(false)}
        onSubmit={(values) => {
          void handleAdd(values);
        }}
        submitting={addRoom.isPending || addRoomAvailability.isPending}
      />

      <CapacityFormModal
        mode="edit"
        open={Boolean(editTarget)}
        row={editTarget}
        defaultDate={dateKey}
        onClose={() => setEditTarget(null)}
        onSubmit={(values) => {
          void handleEdit(values);
        }}
        submitting={editSubmitting}
      />
    </div>
  );
}
