"use client";

import { useEffect, useState } from "react";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import CalendarHeader from "@/features/shared/ui/datePicker/CalendarHeader";
import { toAsciiDigits } from "@/lib/api/dateFormat";
import { cn } from "@/features/shared/lib/utils";

export type PersianDateFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** `persian` → YYYY/MM/DD (ASCII). `iso` → YYYY-MM-DD Gregorian. */
  outputFormat?: "persian" | "iso";
  className?: string;
  calendarPosition?: string;
};

function parseIncoming(
  value: string,
  outputFormat: "persian" | "iso",
): DateObject | null {
  const trimmed = toAsciiDigits(value.trim());
  if (!trimmed) return null;
  try {
    if (outputFormat === "iso" || /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return new DateObject({
        date: trimmed.slice(0, 10),
        format: "YYYY-MM-DD",
      }).convert(persian);
    }
    return new DateObject({
      date: trimmed,
      format: "YYYY/MM/DD",
      calendar: persian,
    });
  } catch {
    return null;
  }
}

export function PersianDateField({
  value,
  onChange,
  placeholder = "تاریخ را انتخاب کنید",
  error,
  disabled,
  outputFormat = "persian",
  className,
  calendarPosition = "bottom-right",
}: PersianDateFieldProps) {
  const [pickerValue, setPickerValue] = useState<DateObject | null>(() =>
    parseIncoming(value, outputFormat),
  );

  useEffect(() => {
    setPickerValue(parseIncoming(value, outputFormat));
  }, [value, outputFormat]);

  const display = value
    ? outputFormat === "iso"
      ? toAsciiDigits(
          parseIncoming(value, "iso")?.format("YYYY/MM/DD") ?? value,
        )
      : toAsciiDigits(value)
    : "";

  return (
    <div className={cn("w-full", className)}>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        calendarPosition={calendarPosition}
        className="reservation-calendar"
        plugins={[<CalendarHeader key="header" position="top" />]}
        disabled={disabled}
        value={pickerValue}
        onChange={(date) => {
          const next = (date as DateObject | null) ?? null;
          setPickerValue(next);
          if (!next) {
            onChange("");
            return;
          }
          if (outputFormat === "iso") {
            onChange(
              toAsciiDigits(
                new DateObject(next)
                  .convert(gregorian)
                  .format("YYYY-MM-DD"),
              ),
            );
          } else {
            onChange(toAsciiDigits(next.format("YYYY/MM/DD")));
          }
        }}
        render={(_value, openCalendar) => (
          <TextField
            value={display}
            onClick={disabled ? undefined : openCalendar}
            placeholder={placeholder}
            error={!!error}
            helperText={error}
            dir="ltr"
            fullWidth
            disabled={disabled}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarMonthOutlined
                    onClick={disabled ? undefined : openCalendar}
                    sx={{
                      cursor: disabled ? "default" : "pointer",
                      color: "#8A9E98",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 56,
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                "& fieldset": { borderColor: "#FAFAFA" },
                "&:hover fieldset": { borderColor: "#D8B648" },
                "&.Mui-focused fieldset": {
                  borderColor: "#D8B648",
                  borderWidth: "1px",
                },
              },
              "& input": {
                textAlign: "right",
                fontSize: 14,
                color: "#1F2937",
              },
            }}
          />
        )}
      />
    </div>
  );
}
