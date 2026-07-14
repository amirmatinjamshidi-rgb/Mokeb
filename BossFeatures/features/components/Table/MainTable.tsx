import React from "react";
import { cn } from "@/boss-features/lib/utils";
import { colors } from "@/boss-features/reservation/tokens";

export type Column<T> = {
  key: string;
  header: React.ReactNode | (() => React.ReactNode);
  cell: (row: T, index: number) => React.ReactNode;
  colClassName?: string;
  cellClassName?: string;
};

type ResponsiveTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  modesAction?: React.ReactNode;
  size?: "default" | "lg";
  className?: string;
  /** Extra classes per body row (e.g. highlight errors). */
  getRowClassName?: (row: T, index: number) => string | undefined;
  /** Stable key for each row (defaults to index). */
  getRowKey?: (row: T, index: number) => React.Key;
};

const sizeStyles = {
  default: {
    rowHeight: "h-14",
    rowGap: "gap-x-4",
    rowPadding: "px-4",
    containerPadding: "p-2",
    text: "text-[15px] sm:text-sm",
  },
  lg: {
    rowHeight: "h-16",
    rowGap: "gap-x-6",
    rowPadding: "px-6",
    containerPadding: "p-4",
    text: "text-base sm:text-lg",
  },
} as const;

function getCellClassName(colClassName?: string) {
  const alignment = colClassName?.includes("text-center")
    ? "text-center"
    : colClassName?.includes("text-left")
      ? "text-left"
      : colClassName?.includes("text-right")
        ? "text-right"
        : "text-right";

  const extras = colClassName
    ?.replace(/\bflex-1\b/g, "")
    .replace(/\bw-\d+\b/g, "")
    .replace(/\bmin-w-\[[^\]]+\]/g, "")
    .replace(/\btext-(center|left|right)\b/g, "")
    .trim();

  return cn("min-w-0 w-full truncate text-gray-500", alignment, extras);
}

function buildGridTemplate(columnCount: number) {
  return `repeat(${columnCount}, minmax(0, 1fr))`;
}

export function Table<T>({
  data,
  columns,
  modesAction,
  size = "default",
  className,
  getRowClassName,
  getRowKey,
}: ResponsiveTableProps<T>) {
  const styles = sizeStyles[size];
  const gridTemplateColumns = buildGridTemplate(columns.length);
  const rowGridStyle = { gridTemplateColumns };

  return (
    <div
      className={cn(
        "mx-auto flex w-full min-h-102 flex-col rounded-xl border border-gray-100 bg-white shadow-md",
        styles.containerPadding,
        styles.text,
        className,
      )}
    >
      <div
        className={cn(
          "flex w-full items-center",
          styles.rowHeight,
          styles.rowPadding,
        )}
      >
        <div
          className={cn(
            "grid w-full items-center font-semibold text-gray-500",
            styles.rowGap,
          )}
          style={rowGridStyle}
        >
          {columns.map((col) => (
            <div
              key={`header-${col.key}`}
              className={cn(
                getCellClassName(col.colClassName),
                "cursor-pointer transition-colors duration-200 hover:text-[#D4AF37]",
              )}
            >
              {typeof col.header === "function" ? col.header() : col.header}
            </div>
          ))}
        </div>
        {modesAction ? (
          <div className="ms-3 shrink-0">{modesAction}</div>
        ) : null}
      </div>

      <div className="h-0.5 w-full bg-amber-400" />

      <div className="flex w-full flex-col overflow-visible">
        {data.map((row, index) => (
          <div
            key={getRowKey ? getRowKey(row, index) : index}
            className={cn(
              "group relative grid w-full items-center overflow-visible border-b border-primaryBorder transition-all duration-300 ease-out last:border-b-0 hover:bg-[#F5F9F6]",
              styles.rowHeight,
              styles.rowGap,
              styles.rowPadding,
              getRowClassName?.(row, index),
            )}
            style={rowGridStyle}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 rounded-full opacity-0 transition-all duration-300 ease-out group-hover:top-0 group-hover:h-full group-hover:w-1.5 group-hover:translate-y-0 group-hover:rounded-none group-hover:opacity-100"
              style={{ backgroundColor: colors.primary08 }}
            />

            {columns.map((col) => (
              <div
                key={`cell-${col.key}`}
                className={cn(
                  getCellClassName(col.colClassName),
                  col.cellClassName,
                )}
              >
                {col.cell(row, index)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
