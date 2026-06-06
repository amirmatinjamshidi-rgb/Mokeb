"use client";

import { useMemo, useState } from "react"; // اضافه شدن useState
import { zodResolver } from "@hookform/resolvers/zod";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { Controller, useForm, useWatch } from "react-hook-form";
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

const guestField = z
  .union([z.literal(""), z.number()])
  .refine(
    (v): v is number => typeof v === "number" && v >= 1 && v <= 5,
    "تعداد نفرات بین ۱ تا ۵ نفر الزامی است",
  );

export type CapacityFormValues = {
  guests: number | "";
  entryDate: string;
  exitDate: string;
};

const schema = z
  .object({
    guests: guestField,
    entryDate: z.string().min(1, "تاریخ ورود را انتخاب کنید"),
    exitDate: z.string().min(1, "تاریخ خروج را انتخاب کنید"),
  })
  .refine((d) => d.exitDate >= d.entryDate, {
    message: "تاریخ خروج باید هم‌زمان یا بعد از تاریخ ورود باشد",
    path: ["exitDate"],
  });

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

export function CapacityCheckForm({ className }: Props) {
  const checkCapacity = useReservationCapacityStore((s) => s.checkCapacity);
  const resetCapacityCheck = useReservationCapacityStore(
    (s) => s.resetCapacityCheck,
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CapacityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guests: "", entryDate: "", exitDate: "" },
  });

  const watchedEntry = useWatch({ control, name: "entryDate" });
  const watchedExit = useWatch({ control, name: "exitDate" });

  // ۱. یک استیت محلی برای نگه‌داری دقیق آبجکت‌های DatePicker می‌سازیم
  const [datePickerValues, setDatePickerValues] = useState<DateObject[]>([]);

  const onValid = (data: CapacityFormValues) => {
    if (typeof data.guests !== "number") return;
    checkCapacity(data.guests, data.entryDate, data.exitDate);
  };

  const rangeError = errors.entryDate?.message || errors.exitDate?.message;

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className={cn(
        "flex w-full flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-4 lg:items-center lg:gap-6",
        className,
      )}
    >
      <DatePicker
        range
        style={{ direction: "ltr" }}
        calendarPosition="bottom-left"
        calendar={persian}
        locale={persian_fa}
        value={datePickerValues} // ۲. استیت محلی را به تقویم وصل می‌کنیم
        onChange={(dates) => {
          resetCapacityCheck();
          
          // ۳. استیت تقویم را مستقیماً با مقادیر خودش آپدیت می‌کنیم تا فرآیند انتخاب قطع نشود
          const newDates = (dates || []) as DateObject[];
          setDatePickerValues(newDates);

          if (newDates.length === 0) {
            setValue("entryDate", "", { shouldValidate: true });
            setValue("exitDate", "", { shouldValidate: true });
            return;
          }

          // ۴. مقادیر را برای ریکت‌هوک‌فرم به فرمت رشته درمی‌آوریم
          const first = newDates[0];
          const second = newDates[1];

          const a = first ? first.format("YYYY/MM/DD") : "";
          const b = second ? second.format("YYYY/MM/DD") : "";

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
                      sx={{
                        cursor: "pointer",
                        color: colors.neutral08,
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: "100%", md: 380 },
                width: { xs: "100%", md: 380 },
                "& .MuiOutlinedInput-root": {
                  height: CONTROL_H,
                  borderRadius: "12px",
                  backgroundColor: colors.backgroundW,
                  "& fieldset": { borderColor: "#E5E7EB" },
                  "&:-hover fieldset": { borderColor: colors.goldLine },
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

      <Controller
        name="guests"
        control={control}
        render={({ field }) => {
          const guestsVal = field.value as CapacityFormValues["guests"];
          return (
            <FormControl
              size="small"
              required
              error={!!errors.guests}
              sx={{
                minWidth: { xs: "100%", md: 322 },
                width: { xs: "100%", md: 322 },
              }}
            >
              <Select
                displayEmpty
                value={guestsVal === "" ? "" : guestsVal}
                onChange={(e) => {
                  resetCapacityCheck();
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
                  const val = v as CapacityFormValues["guests"];
                  return val === "" ? (
                    <span className="text-[#8A9E98]">تعداد نفرات (۱ تا ۵)</span>
                  ) : (
                    <span>{`${val} نفر`}</span>
                  );
                }}
              >
                <MenuItem value="">
                  <em>انتخاب کنید</em>
                </MenuItem>
                {[1, 2, 3, 4, 5].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} نفر
                  </MenuItem>
                ))}
              </Select>
              {errors.guests?.message ? (
                <FormHelperText>{errors.guests.message}</FormHelperText>
              ) : null}
            </FormControl>
          );
        }}
      />

      <Button
        type="submit"
        text="white"
        color="darkGreen"
        radius="none"
        border="none"
        size="twoxl"
        width="xl"
        className="w-full shrink-0 font-extralight md:w-43"
      >
        چک ظرفیت
      </Button>
    </form>
  );
}