"use client";

import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

import { colors } from "@admin-kit/shared/tokens";

import type { CapacityGender } from "./mockCapacityData";

const GENDERS: CapacityGender[] = ["مرد", "زن"];

const radioSx = {
  padding: "4px",
  color: colors.neutral04,
  "&.Mui-checked": { color: colors.primary08 },
} as const;

type Props<T extends FieldValues> = {
  control: Control<T>;
  name?: Path<T>;
};

export function GenderRadioField<T extends FieldValues>({
  control,
  name = "gender" as Path<T>,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex w-full items-center gap-6" dir="rtl">
          <span className="shrink-0 text-sm text-gray-500">جنسیت:</span>
          <RadioGroup
            row
            value={field.value}
            onChange={(e) => field.onChange(e.target.value as CapacityGender)}
            className="flex flex-1 gap-6"
          >
            {GENDERS.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio size="small" sx={radioSx} />}
                label={option}
                className="mr-0 gap-1 text-sm text-gray-600"
              />
            ))}
          </RadioGroup>
        </div>
      )}
    />
  );
}
