/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import ReservationSummaryFinal from "@/boss-features/components/AddKarevan/step2/reservationSummaryFinal";
import { SendSucces } from "@/boss-features/components/AddKarevan/step2/SendSucces";
import { useReservationCapacityStore } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";
import { useBossRequests, useBossReserve } from "@/boss-features/api/hooks";
import { cn } from "@/boss-features/lib/utils";
import { toAsciiDigits } from "@/lib/api/dateFormat";
import Button from "@/boss-features/UI/button";
import { useReservationRulesStore } from "@admin-kit/settings/useReservationRulesStore";

type Props = {
  className?: string;
};

function buildSupervisorName(p: {
  firstName?: string;
  lastName?: string;
}): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || "—";
}

export function AddKarvanReviewStep({ className }: Props) {
  const registrationDraft = useReservationCapacityStore(
    (s) => s.registrationDraft,
  );
  const entryDate = useReservationCapacityStore((s) => s.entryDate);
  const exitDate = useReservationCapacityStore((s) => s.exitDate);
  const maleAmount = useReservationCapacityStore((s) => s.maleAmount);
  const femaleAmount = useReservationCapacityStore((s) => s.femaleAmount);
  const setRequestMeta = useReservationCapacityStore((s) => s.setRequestMeta);
  const submittedRequestCode = useReservationCapacityStore(
    (s) => s.submittedRequestCode,
  );
  const submittedRequestId = useReservationCapacityStore(
    (s) => s.submittedRequestId,
  );
  const setSubmittedRequest = useReservationCapacityStore(
    (s) => s.setSubmittedRequest,
  );
  const goToGuestRegistration = useReservationCapacityStore(
    (s) => s.goToGuestRegistration,
  );
  const setActiveStep = useReservationCapacityStore((s) => s.setActiveStep);

  const reserve = useBossReserve();
  const { data: requests = [], refetch: refetchRequests } = useBossRequests();

  const p0 = registrationDraft?.pilgrims[0];
  const supervisorName = useMemo(
    () => (p0 ? buildSupervisorName(p0) : "—"),
    [p0],
  );

  const reserveCode = submittedRequestCode ?? "در انتظار ارسال";
  const isAccepted = useMemo(() => {
    if (!submittedRequestId && !submittedRequestCode) return false;
    const match = requests.find(
      (r) =>
        (submittedRequestId && r._apiId === submittedRequestId) ||
        r.reservationCode === submittedRequestCode ||
        (submittedRequestId &&
          r.reservationCode === submittedRequestId.slice(0, 8).toUpperCase()),
    );
    return match?.status === "رزرو فعال";
  }, [requests, submittedRequestCode, submittedRequestId]);

  useEffect(() => {
    if (!submittedRequestId || isAccepted) return;
    const timer = window.setInterval(() => {
      void refetchRequests();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [submittedRequestId, isAccepted, refetchRequests]);

  const dash = "—";
  const [submittedAt, setSubmittedAt] = useState(dash);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [maleInput, setMaleInput] = useState(
    maleAmount > 0 ? String(maleAmount) : "",
  );
  const [femaleInput, setFemaleInput] = useState(
    femaleAmount > 0 ? String(femaleAmount) : "",
  );
  const [datePickerValues, setDatePickerValues] = useState<DateObject[]>([]);
  const [localEntry, setLocalEntry] = useState(entryDate);
  const [localExit, setLocalExit] = useState(exitDate);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const maxStayDays = useReservationRulesStore((s) => s.caravanRules.maxStayDays);

  useEffect(() => {
    setSubmittedAt(
      new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(
        new Date(),
      ),
    );
  }, []);

  const handleSubmitRequest = async () => {
    if (!p0) return;
    setSubmitError(null);
    setFieldError(null);

    const male = Number(maleInput) || 0;
    const female = Number(femaleInput) || 0;
    if (!localEntry || !localExit) {
      setFieldError("تاریخ ورود و خروج را انتخاب کنید.");
      return;
    }
    if (male + female < 1) {
      setFieldError("تعداد مرد و زن را وارد کنید (حداقل یکی بزرگ‌تر از صفر).");
      return;
    }

    setRequestMeta({
      entryDate: localEntry,
      exitDate: localExit,
      maleAmount: male,
      femaleAmount: female,
    });

    try {
      const result = await reserve.mutateAsync({
        entryDate: localEntry,
        exitDate: localExit,
        maleAmount: male,
        femaleAmount: female,
        supervisorName,
        pilgrims: [p0],
      });
      setSubmittedRequest({
        requestId: result.requestId,
        requestCode: result.reserveCode,
      });
      void refetchRequests();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "ارسال درخواست ناموفق بود.",
      );
    }
  };

  if (!registrationDraft || !p0) {
    return (
      <div
        className={cn(
          "mt-4 w-full text-center text-sm text-[#61756F]",
          className,
        )}
        dir="rtl"
      >
        ابتدا اطلاعات سرپرست را در مرحلهٔ قبل تکمیل کنید.
        <div className="mt-2">
          <Button
            type="button"
            color="darkGreen"
            text="white"
            radius="md"
            border="none"
            size="md"
            width="auto"
            onClick={() => setActiveStep(0)}
          >
            بازگشت به مرحلهٔ قبل
          </Button>
        </div>
      </div>
    );
  }

  const locked = Boolean(submittedRequestCode);

  return (
    <div className={cn("flex w-full flex-col gap-4", className)} dir="rtl">
      <h2 className="text-lg font-semibold text-[#175E47] sm:text-xl">
        بررسی درخواست
      </h2>

      {!locked ? (
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_2px_4px_0px_#0000001F] sm:p-6">
          <DatePicker
            range
            style={{ direction: "ltr" }}
            calendarPosition="bottom-right"
            calendar={persian}
            locale={persian_fa}
            value={datePickerValues}
            onChange={(dates) => {
              const newDates = (dates || []) as DateObject[];
              setDatePickerValues(newDates);
              if (newDates.length === 0) {
                setLocalEntry("");
                setLocalExit("");
                return;
              }
              const first = newDates[0];
              let second = newDates[1];
              if (first && second) {
                const start = first.toDate();
                const end = second.toDate();
                const days =
                  Math.round(
                    (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
                  ) + 1;
                if (days > maxStayDays) {
                  second = new DateObject(first).add(maxStayDays - 1, "days");
                  setDatePickerValues([first, second]);
                  setFieldError(
                    `حداکثر مدت اقامت کاروان ${maxStayDays} روز است؛ بازه محدود شد.`,
                  );
                } else {
                  setFieldError(null);
                }
              }
              const a = first
                ? toAsciiDigits(first.format("YYYY/MM/DD"))
                : "";
              const b = second
                ? toAsciiDigits(second.format("YYYY/MM/DD"))
                : "";
              setLocalEntry(a);
              setLocalExit(b || a);
            }}
            render={(_value, openCalendar) => {
              const display =
                localEntry && localExit
                  ? `${localEntry} — ${localExit}`
                  : localEntry
                    ? `${localEntry} — …`
                    : "";
              return (
                <TextField
                  value={display}
                  onClick={openCalendar}
                  placeholder="تاریخ ورود — تاریخ خروج"
                  dir="ltr"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarMonthOutlined
                          onClick={openCalendar}
                          sx={{ cursor: "pointer", color: "#8A9E98" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                    },
                  }}
                />
              );
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormControl fullWidth>
              <TextField
                label="تعداد مرد"
                type="number"
                inputProps={{ min: 0 }}
                value={maleInput}
                onChange={(e) => setMaleInput(e.target.value.replace(/\D/g, ""))}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="تعداد زن"
                type="number"
                inputProps={{ min: 0 }}
                value={femaleInput}
                onChange={(e) =>
                  setFemaleInput(e.target.value.replace(/\D/g, ""))
                }
              />
            </FormControl>
          </div>
          {fieldError ? (
            <FormHelperText error>{fieldError}</FormHelperText>
          ) : null}
        </div>
      ) : null}

      {!submittedRequestCode ? (
        <Button
          type="button"
          color="darkGreen"
          text="white"
          radius="md"
          border="none"
          size="md"
          width="auto"
          disabled={reserve.isPending}
          onClick={() => void handleSubmitRequest()}
        >
          {reserve.isPending ? "در حال ارسال…" : "ارسال درخواست به ادمین"}
        </Button>
      ) : (
        <Button
          type="button"
          color="darkGreen"
          text="white"
          radius="md"
          border="none"
          size="md"
          width="auto"
          disabled={!isAccepted}
          onClick={goToGuestRegistration}
        >
          {isAccepted
            ? "ادامه — ثبت اطلاعات زائران"
            : "در انتظار تایید ادمین"}
        </Button>
      )}

      {submitError ? (
        <p className="text-sm text-[#D22B23]">{submitError}</p>
      ) : null}

      <div className="flex w-full flex-col gap-3">
        {submittedRequestCode ? (
          <SendSucces reserveCode={reserveCode} />
        ) : null}
        <ReservationSummaryFinal
          className="w-full"
          checkInDate={localEntry || entryDate || dash}
          checkOutDate={localExit || exitDate || dash}
          checkInTime={submittedAt}
          reserveCode={reserveCode}
          supervisorName={supervisorName}
          maleCount={
            locked
              ? maleAmount
              : Number(maleInput) || maleAmount
          }
          femaleCount={
            locked
              ? femaleAmount
              : Number(femaleInput) || femaleAmount
          }
        />
      </div>
    </div>
  );
}
