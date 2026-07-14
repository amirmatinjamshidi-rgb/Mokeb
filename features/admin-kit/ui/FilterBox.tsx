"use client";

import { useEffect, useState } from "react";

import Button from "@admin-kit/ui/Button";
import { cn } from "@admin-kit/shared/lib/utils";

export type FilterOption = {
  id: string;
  label: string;
};

export type FilterGroup = {
  id: string;
  title: string;
  options: FilterOption[];
};

export type FilterValues = Record<string, string>;

export type FilterBoxProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  filters: FilterGroup[];
  value?: FilterValues;
  defaultValue?: FilterValues;
  onChange?: (values: FilterValues) => void;
  onApply: (values: FilterValues) => void;
  applyLabel?: string;
  className?: string;
};

function buildInitialValues(
  filters: FilterGroup[],
  seed?: FilterValues,
): FilterValues {
  const base = Object.fromEntries(
    filters.map((group) => [group.id, group.options[0]?.id ?? ""]),
  );

  return { ...base, ...seed };
}

export function FilterBox({
  open,
  onClose,
  title = "فیلتر ها",
  filters,
  value,
  defaultValue,
  onChange,
  onApply,
  applyLabel = "اعمال فیلتر ها",
  className,
}: FilterBoxProps) {
  const [internalValues, setInternalValues] = useState<FilterValues>(() =>
    buildInitialValues(filters, defaultValue),
  );

  const selectedValues = value ?? internalValues;

  useEffect(() => {
    if (!open) return;
    setInternalValues(buildInitialValues(filters, defaultValue ?? value));
  }, [open, filters, defaultValue, value]);

  const setGroupValue = (groupId: string, optionId: string) => {
    const next = { ...selectedValues, [groupId]: optionId };
    if (value === undefined) {
      setInternalValues(next);
    }
    onChange?.(next);
  };

  const handleApply = () => {
    onApply(selectedValues);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-box-title"
        className={cn(
          "flex w-[70%] max-w-2xl flex-col gap-6 rounded-2xl bg-white p-6 shadow-md",
          className,
        )}
      >
        <h2
          id="filter-box-title"
          className="text-lg font-bold text-gray-500"
        >
          {title}
        </h2>

        <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto">
          {filters.map((group) => (
            <fieldset key={group.id} className="min-w-0 border-0 p-0">
              <legend className="mb-3 text-sm font-medium text-gray-500">
                {group.title}
              </legend>

              <div className="flex flex-col gap-3">
                {group.options.map((option) => {
                  const checked = selectedValues[group.id] === option.id;

                  return (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-500"
                    >
                      <input
                        type="radio"
                        name={group.id}
                        value={option.id}
                        checked={checked}
                        onChange={() => setGroupValue(group.id, option.id)}
                        className="size-4 shrink-0 accent-[#175E47]"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <Button
          type="button"
          color="darkGreen"
          text="white"
          radius="md"
          size="lg"
          className="h-12 w-full"
          onClick={handleApply}
        >
          {applyLabel}
        </Button>
      </div>
    </div>
  );
}
