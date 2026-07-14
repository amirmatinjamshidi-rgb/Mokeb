"use client";

import { useCallback, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/boss-features/lib/utils";
import { toPersianDigits } from "@/boss-features/lib/format";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 40, 50] as const;
const TOpersianDigits = (size: number) => toPersianDigits(size);
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

type Props = {
  currentPage: number;
  totalPages: number;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
  className?: string;
};

function FilterSelect({
  value,
  onChange,
  children,
  ariaLabel,
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className="flex h-10 min-w-[140px] items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500">
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 appearance-none bg-transparent text-right text-sm text-gray-500 outline-none"
      >
        {children}
      </select>
      <ChevronLeft
        className="size-4 shrink-0 rotate-[-90deg] text-[#61756F]"
        aria-hidden
      />
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
    const pages: number[] = [];
  
    for (let offset = -3; offset <= 2; offset++) {
      let page = currentPage + offset;
  
      while (page < 1) {
        page += totalPages;
      }
  
      while (page > totalPages) {
        page -= totalPages;
      }
  
      pages.push(page);
    }
  
    return pages;
  }

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: Props) {
    const visiblePages = getVisiblePages(currentPage, totalPages);

  const arrowClass =
    "flex size-8 items-center justify-center  border-white rounded-full bg-white text-gray-400 transition-colors hover:border-[#175E47] hover:bg-[#175E47] hover:text-white disabled:pointer-events-none disabled:opacity-40";

  const pageBtn = (page: number, slotIndex: number) => (
    <button
      key={`page-slot-${slotIndex}-${page}`}
      type="button"
      onClick={() => onPageChange(page)}
      className={cn(
        "min-w-8 px-1 text-sm font-medium transition-colors",
        page === currentPage
          ? "text-[#D4AF37]"
          : "text-gray-400 hover:text-[#175E47]",
      )}
    >
      {toPersianDigits(page)}
    </button>
  );

  return (
    <div
      className={cn(
        "flex h-10 w-full  items-center justify-between",
        className,
      )}
    >
      <FilterSelect
        value={pageSize}
        ariaLabel="تعداد در هر صفحه"
        onChange={(v) => onPageSizeChange(Number(v) as PageSize)}
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {toPersianDigits(size)} در صفحه
          </option>
        ))}
      </FilterSelect>
      <div className="flex items-center gap-2" dir="ltr">
        <button
          type="button"
          aria-label="صفحه قبل"
          className={arrowClass}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-7" />
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, i) => pageBtn(page, i))}
        </div>
        <button
          type="button"
          aria-label="صفحه بعد"
          className={arrowClass}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="size-7" />
        </button>
      </div>
    </div>
  );
}

export function usePagination<T>(items: T[], initialPageSize: PageSize = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = items.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const setPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const setSize = useCallback((size: PageSize) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safePage,
    totalPages,
    pageSize,
    paginatedItems,
    setPage,
    setSize,
  };
}
