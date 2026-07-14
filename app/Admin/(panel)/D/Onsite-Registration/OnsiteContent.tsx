"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search, UserRoundPen } from "lucide-react";

import {
  mapRoomAvailabilityDto,
  useOnsiteRegistration,
  useRoomAvailabilities,
} from "@admin-kit/api/hooks";
import type { PilgrimFormValues } from "@admin-kit/schemas/supervisorFormSchemas";
import {
  FilterBox,
  FloatingLabelSearch,
  PageToolbar,
  Table,
  TablePagination,
  pageToolbarActionClass,
  usePagination,
  type Column,
  type FilterGroup,
  type FilterValues,
} from "@admin-kit/index";
import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";
import { toDateKey } from "@admin-kit/ui/dateCarouselUtils";

import { usePanelDate } from "../PanelDateContext";
import { OnsiteRegistrationModal } from "./OnsiteRegistrationModal";
import {
  computeRegisterUserStatus,
  type RegisterUser,
  type RegisterUserGender,
  type RegisterUserStatus,
} from "./registerUserTypes";

export type { RegisterUser, RegisterUserGender, RegisterUserStatus };

type RegisterUserRow = RegisterUser & { radif: number };

const STATUS_FILTER_MAP: Record<string, RegisterUserStatus> = {
  available: "ظرفیت موجود",
  filling: "در حال تکمیل",
  full: "تکمیل",
};

const GENDER_FILTER_MAP: Record<string, RegisterUserGender> = {
  men: "آقایان",
  women: "بانوان",
};

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "status",
    title: "وضعیت رزرو",
    options: [
      { id: "all", label: "همه" },
      { id: "available", label: "ظرفیت موجود" },
      { id: "filling", label: "در حال تکمیل" },
      { id: "full", label: "تکمیل" },
    ],
  },
  {
    id: "gender",
    title: "جنسیت",
    options: [
      { id: "all", label: "همه" },
      { id: "men", label: "آقایان" },
      { id: "women", label: "بانوان" },
    ],
  },
];

const DEFAULT_FILTERS: FilterValues = {
  status: "all",
  gender: "all",
};

function persian(value: string | number) {
  return toPersianDigits(value);
}

function capacityStatusClass(status: RegisterUserStatus) {
  switch (status) {
    case "ظرفیت موجود":
      return "text-[#279F78]";
    case "در حال تکمیل":
      return "text-[#D8B648]";
    case "تکمیل":
      return "text-[#D22B23]";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

function StatusBadge({ status }: { status: RegisterUserStatus }) {
  return (
    <span className={cn("font-medium", capacityStatusClass(status))}>
      {status}
    </span>
  );
}

function buildColumns(): Column<RegisterUserRow>[] {
  return [
    {
      key: "classLabel",
      header: "کلاس",
      colClassName: "text-center",
      cell: (row) => persian(row.classLabel),
    },
    {
      key: "gender",
      header: "جنسیت",
      colClassName: "text-center",
      cell: (row) => row.gender,
    },
    {
      key: "totalCapacity",
      header: "ظرفیت کل",
      colClassName: "text-center",
      cell: (row) => persian(row.totalCapacity),
    },
    {
      key: "registeredCapacity",
      header: "ظرفیت ثبت شده",
      colClassName: "text-center",
      cell: (row) => persian(row.registeredCapacity),
    },
    {
      key: "remainingCapacity",
      header: "ظرفیت باقی مانده",
      colClassName: "text-center",
      cell: (row) => persian(row.remainingCapacity),
    },
    {
      key: "status",
      header: "وضعیت ظرفیت",
      colClassName: "text-center",
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];
}

type RoomAvailabilityRow = ReturnType<typeof mapRoomAvailabilityDto>;

function toRegisterUser(row: RoomAvailabilityRow): RegisterUser {
  const remainingCapacity = row.remaining;
  return {
    id: row.id || row.roomId,
    classLabel: row.className,
    gender: row.genderLabel,
    totalCapacity: row.totalCapacity,
    registeredCapacity: row.registeredCapacity,
    remainingCapacity,
    status: computeRegisterUserStatus(
      row.registeredCapacity,
      row.totalCapacity,
      remainingCapacity,
    ),
  };
}

export function OnsiteContent() {
  const { selectedDate } = usePanelDate();
  const dateKey = toDateKey(selectedDate);

  const {
    data: roomAvailabilities = [],
    isLoading,
    error,
  } = useRoomAvailabilities(dateKey);
  const onsiteRegistration = useOnsiteRegistration(dateKey);

  const users = useMemo(
    () => roomAvailabilities.map(toRegisterUser),
    [roomAvailabilities],
  );

  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationTarget, setRegistrationTarget] =
    useState<RegisterUser | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [appliedFilters, setAppliedFilters] =
    useState<FilterValues>(DEFAULT_FILTERS);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.classLabel.includes(query) ||
        user.gender.includes(query) ||
        user.status.includes(query) ||
        String(user.totalCapacity).includes(query) ||
        String(user.registeredCapacity).includes(query) ||
        String(user.remainingCapacity).includes(query);

      const matchesStatus =
        appliedFilters.status === "all" ||
        user.status === STATUS_FILTER_MAP[appliedFilters.status];

      const matchesGender =
        appliedFilters.gender === "all" ||
        user.gender === GENDER_FILTER_MAP[appliedFilters.gender];

      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [appliedFilters, search, users]);

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

  const tableRows: RegisterUserRow[] = paginatedItems.map((user, index) => ({
    ...user,
    radif: (currentPage - 1) * pageSize + index + 1,
  }));

  const columns = useMemo(() => buildColumns(), []);

  const openRegistration = () => {
    const target =
      users.find((user) => user.remainingCapacity > 0) ?? users[0] ?? null;
    if (!target || target.remainingCapacity <= 0) return;
    setRegistrationTarget(target);
    setRegistrationOpen(true);
  };

  const handleRegistrationComplete = (pilgrims: PilgrimFormValues[]) => {
    if (!registrationTarget || pilgrims.length === 0) return;

    setRegistrationError(null);
    onsiteRegistration.mutate(pilgrims, {
      onError: (err) => {
        setRegistrationError(
          err instanceof Error ? err.message : "ثبت نام حضوری ناموفق بود.",
        );
      },
    });
    setRegistrationTarget(null);
  };

  return (
    <div className="flex w-full flex-col gap-12">
      <PageToolbar
        search={
          <FloatingLabelSearch
            id="onsite-register-search"
            label="جستجو"
            value={search}
            onChange={setSearch}
            icon={<Search className="size-5" aria-hidden />}
            containerClassName="w-full shadow-sm shadow-gray-300 border-white"
          />
        }
        actions={
          <>
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
            <button
              type="button"
              onClick={openRegistration}
              className={cn(
                pageToolbarActionClass,
                "bg-[#175E47] text-white hover:bg-[#1F7E5F]",
              )}
            >
              <UserRoundPen className="size-5" aria-hidden />
              ثبت نام حضوری
            </button>
          </>
        }
      />

      {isLoading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "خطا در دریافت ظرفیت"}
        </p>
      ) : null}
      {registrationError ? (
        <p className="text-sm text-red-500">{registrationError}</p>
      ) : null}
      {onsiteRegistration.isSuccess ? (
        <p className="text-sm text-[#175E47]">ثبت نام حضوری با موفقیت انجام شد.</p>
      ) : null}

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

      <OnsiteRegistrationModal
        open={registrationOpen}
        capacity={registrationTarget}
        onClose={() => {
          setRegistrationOpen(false);
          setRegistrationTarget(null);
        }}
        onComplete={handleRegistrationComplete}
      />
    </div>
  );
}
