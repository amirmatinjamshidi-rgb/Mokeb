"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Controller, useForm, useWatch, type Control } from "react-hook-form";
import { z } from "zod";
import DateObject from "react-date-object";
import Button from "@/features/shared/ui/button";
import { cn } from "@/features/shared/lib/utils";
import { useReservationCapacityStore } from "../store/useReservationCapacityStore";
import { colors, CONTROL_H } from "../tokens";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import InputAdornment from "@mui/material/InputAdornment";
import { useCheckCapacity } from "@/features/user-panel/api/hooks";
import { toAsciiDigits } from "@/lib/api/dateFormat";
import CalendarHeader from "@/features/shared/ui/datePicker/CalendarHeader";
import { isCapacityAvailable } from "@/features/shared/lib/capacityResult";
import { useReservationRulesStore } from "@admin-kit/settings/useReservationRulesStore";

export type CapacityFormValues = {
  maleCount: number | "";
  femaleCount: number | "";
  entryDate: string;
  exitDate: string;
};

type Props = {
  className?: string;
};

const selectSx = {
  height: CONTROL_H,
  borderRadius: "12px",
  backgroundColor: colors.backgroundW,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E5E7EB",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.goldLine,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.goldLine,
    borderWidth: "1px",
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    lineHeight: "20px",
    color: colors.neutral09,
    paddingY: 1.5,
    paddingX: 2,
  },
};

function stayDaysInclusive(entry: string, exit: string): number {
  try {
    const a = new DateObject({
      date: toAsciiDigits(entry),
      format: "YYYY/MM/DD",
      calendar: persian,
    });
    const b = new DateObject({
      date: toAsciiDigits(exit),
      format: "YYYY/MM/DD",
      calendar: persian,
    });
    const diff = Math.round(
      (b.toDate().getTime() - a.toDate().getTime()) / (24 * 60 * 60 * 1000),
    );
    return diff + 1;
  } catch {
    return 0;
  }
}

function countSelect(
  name: "maleCount" | "femaleCount",
  label: string,
  control: Control<CapacityFormValues>,
  error: string | undefined,
  options: number[],
  onReset: () => void,
) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const val = field.value as number | "";
        return (
          <FormControl
            size="small"
            required
            error={!!error}
            sx={{
              minWidth: { xs: "100%", md: 160 },
              width: { xs: "100%", md: 160 },
            }}
          >
            <Select
              displayEmpty
              value={val === "" ? "" : val}
              onChange={(e) => {
                onReset();
                const raw = String(e.target.value);
                field.onChange(raw === "" ? "" : Number(raw));
              }}
              onBlur={field.onBlur}
              inputRef={field.ref}
              name={field.name}
              IconComponent={KeyboardArrowDown}
              MenuProps={{ PaperProps: { sx: { direction: "rtl" } } }}
              sx={selectSx}
              renderValue={(v) => {
                const current = v as number | "";
                return current === "" ? (
                  <span className="text-[#8A9E98]">{label}</span>
                ) : (
                  <span>{`${current} ${label}`}</span>
                );
              }}
            >
              <MenuItem value="">
                <em>انتخاب کنید</em>
              </MenuItem>
              {options.map((n) => (
                <MenuItem key={n} value={n}>
                  {n} نفر
                </MenuItem>
              ))}
            </Select>
            {error ? <FormHelperText>{error}</FormHelperText> : null}
          </FormControl>
        );
      }}
    />
  );
}

export function CapacityCheckForm({ className }: Props) {
  const checkCapacityStore = useReservationCapacityStore((s) => s.checkCapacity);
  const resetCapacityCheck = useReservationCapacityStore(
    (s) => s.resetCapacityCheck,
  );
  const storedMale = useReservationCapacityStore((s) => s.maleCount);
  const storedFemale = useReservationCapacityStore((s) => s.femaleCount);
  const storedEntry = useReservationCapacityStore((s) => s.entryDate);
  const storedExit = useReservationCapacityStore((s) => s.exitDate);
  const checkCapacityApi = useCheckCapacity();
  const [capacityError, setCapacityError] = useState<string | null>(null);
  const maxPersons = useReservationRulesStore(
    (s) => s.publicRules.maxPersonsPerReservation,
  );
  const maxStayDays = useReservationRulesStore((s) => s.publicRules.maxStayDays);

  const schema = useMemo(
    () =>
      z
        .object({
          maleCount: z.union([z.literal(""), z.number().int().min(0)]),
          femaleCount: z.union([z.literal(""), z.number().int().min(0)]),
          entryDate: z.string().min(1, "تاریخ ورود را انتخاب کنید"),
          exitDate: z.string().min(1, "تاریخ خروج را انتخاب کنید"),
        })
        .refine(
          (d) =>
            typeof d.maleCount === "number" &&
            typeof d.femaleCount === "number" &&
            d.maleCount + d.femaleCount >= 1,
          {
            message: "حداقل یک نفر (مرد یا زن) الزامی است",
            path: ["maleCount"],
          },
        )
        .refine(
          (d) =>
            typeof d.maleCount !== "number" ||
            typeof d.femaleCount !== "number" ||
            d.maleCount + d.femaleCount <= maxPersons,
          {
            message: `مجموع نفرات حداکثر ${maxPersons} نفر است`,
            path: ["femaleCount"],
          },
        )
        .refine((d) => d.exitDate >= d.entryDate, {
          message: "تاریخ خروج باید هم‌زمان یا بعد از تاریخ ورود باشد",
          path: ["exitDate"],
        })
        .refine(
          (d) => stayDaysInclusive(d.entryDate, d.exitDate) <= maxStayDays,
          {
            message: `حداکثر مدت اقامت ${maxStayDays} روز است`,
            path: ["exitDate"],
          },
        ),
    [maxPersons, maxStayDays],
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CapacityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      maleCount: storedMale >= 0 ? Math.min(storedMale, maxPersons) : "",
      femaleCount:
        storedFemale >= 0 ? Math.min(storedFemale, maxPersons) : "",
      entryDate: storedEntry || "",
      exitDate: storedExit || "",
    },
  });

  const watchedEntry = useWatch({ control, name: "entryDate" });
  const watchedExit = useWatch({ control, name: "exitDate" });
  const [datePickerValues, setDatePickerValues] = useState<DateObject[]>([]);
  const guestOptions = useMemo(
    () => Array.from({ length: maxPersons + 1 }, (_, i) => i),
    [maxPersons],
  );

  const onValid = async (data: CapacityFormValues) => {
    if (typeof data.maleCount !== "number" || typeof data.femaleCount !== "number")
      return;
    setCapacityError(null);
    try {
      const result = await checkCapacityApi.mutateAsync({
        enterTime: data.entryDate,
        exitTime: data.exitDate,
        maleAmount: data.maleCount,
        femaleAmount: data.femaleCount,
      });
      if (!isCapacityAvailable(result)) {
        setCapacityError("ظرفیت کافی برای این تاریخ موجود نیست.");
        resetCapacityCheck();
        return;
      }
      checkCapacityStore(
        data.maleCount,
        data.femaleCount,
        data.entryDate,
        data.exitDate,
      );
    } catch (err) {
      setCapacityError(
        err instanceof Error ? err.message : "بررسی ظرفیت ناموفق بود.",
      );
      resetCapacityCheck();
    }
  };

  const rangeError = errors.entryDate?.message || errors.exitDate?.message;

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className={cn(
        "flex w-full flex-col gap-4 md:flex-row md:flex-wrap md:items-start lg:flex-nowrap lg:items-center lg:gap-4",
        className,
      )}
    >
      <DatePicker
        range
        style={{ direction: "ltr" }}
        calendarPosition="bottom-left"
        calendar={persian}
        locale={persian_fa}
        className="reservation-calendar"
        plugins={[<CalendarHeader key="header" position="top" />]}
        value={datePickerValues}
        onChange={(dates) => {
          resetCapacityCheck();
          const newDates = (dates || []) as DateObject[];
          setDatePickerValues(newDates);

          if (newDates.length === 0) {
            setValue("entryDate", "", { shouldValidate: true });
            setValue("exitDate", "", { shouldValidate: true });
            return;
          }

          const first = newDates[0];
          let second = newDates[1];

          if (first && second) {
            const span = stayDaysInclusive(
              toAsciiDigits(first.format("YYYY/MM/DD")),
              toAsciiDigits(second.format("YYYY/MM/DD")),
            );
            if (span > maxStayDays) {
              second = new DateObject(first).add(maxStayDays - 1, "days");
              setDatePickerValues([first, second]);
              setCapacityError(
                `حداکثر مدت اقامت ${maxStayDays} روز است؛ بازه محدود شد.`,
              );
            } else {
              setCapacityError(null);
            }
          }

          const a = first ? toAsciiDigits(first.format("YYYY/MM/DD")) : "";
          const b = second ? toAsciiDigits(second.format("YYYY/MM/DD")) : "";
          setValue("entryDate", a, { shouldValidate: true });
          setValue("exitDate", b, { shouldValidate: true });
        }}
        render={(_value, openCalendar) => {
          const from = watchedEntry ?? "";
          const to = watchedExit ?? "";
          const display =
            from && to ? `${from} — ${to}` : from ? `${from} — …` : "";
          return (
            <TextField
              value={display}
              onClick={openCalendar}
              error={!!rangeError}
              helperText={rangeError}
              placeholder="تاریخ ورود — تاریخ خروج"
              dir="ltr"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarMonthOutlined
                      onClick={openCalendar}
                      sx={{ cursor: "pointer", color: colors.neutral08 }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: { xs: "100%", md: 260 },
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  height: CONTROL_H,
                  borderRadius: "12px",
                  backgroundColor: colors.backgroundW,
                  "& fieldset": { borderColor: "#E5E7EB" },
                  "&:hover fieldset": { borderColor: colors.goldLine },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.goldLine,
                    borderWidth: "1px",
                  },
                },
              }}
            />
          );
        }}
      />

      <div
        className="hidden h-16 w-px shrink-0 bg-[#E5E7EB] md:block"
        aria-hidden
      />

      {countSelect(
        "maleCount",
        "مرد",
        control,
        errors.maleCount?.message,
        guestOptions,
        resetCapacityCheck,
      )}
      {countSelect(
        "femaleCount",
        "زن",
        control,
        errors.femaleCount?.message,
        guestOptions,
        resetCapacityCheck,
      )}

      {capacityError ? (
        <p className="w-full text-sm text-red-500 md:basis-full">{capacityError}</p>
      ) : null}

      <Button
        type="submit"
        text="white"
        color="darkGreen"
        radius="none"
        border="none"
        size="twoxl"
        width="xl"
        className="w-full shrink-0 font-extralight md:w-43"
        disabled={checkCapacityApi.isPending}
      >
        {checkCapacityApi.isPending ? "در حال بررسی…" : "چک ظرفیت"}
      </Button>
    </form>
  );
}
