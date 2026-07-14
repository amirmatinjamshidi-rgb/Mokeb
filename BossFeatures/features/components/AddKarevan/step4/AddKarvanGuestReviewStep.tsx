"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FileText, Pencil, Search, Trash2 } from "lucide-react";
import { FormControlLabel, Switch } from "@mui/material";

import PilgrimInfoForm from "@/boss-features/components/AddKarevan/registerboxformComponents/addkarvanForminfo";
import { AddKarvanFormShell } from "@/boss-features/components/AddKarevan/AddKarvanFormShell";
import {
  emptyPilgrim,
  pilgrimRegistrationSchema,
  type PilgrimFormValues,
  type RegistrationFormValues,
} from "@/boss-features/components/AddKarevan/FormSchemas";
import { useReservationCapacityStore } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";
import { Table, type Column } from "@admin-kit/index";
import { toPersianDigits } from "@/boss-features/lib/format";
import { cn } from "@/boss-features/lib/utils";
import Button from "@/boss-features/UI/button";
import { FloatingLabelSearch } from "@/boss-features/UI/FloationgLabelSearch";
import { shadows } from "@/boss-features/tokens";

const onePilgrimSchema = pilgrimRegistrationSchema(1);

function buildSupervisorName(p: {
  firstName?: string;
  lastName?: string;
}): string {
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || "—";
}

function duplicateKey(p: PilgrimFormValues): string {
  const nc = p.nationalCode.trim().toLowerCase();
  const fn = p.firstName.trim().toLowerCase();
  const ln = p.lastName.trim().toLowerCase();
  return `${p.nationality}|${nc}|${fn}|${ln}`;
}

function rowHasDuplicate(
  pilgrims: PilgrimFormValues[],
  index: number,
): boolean {
  const key = duplicateKey(pilgrims[index]!);
  return pilgrims.filter((q, i) => i !== index && duplicateKey(q) === key)
    .length > 0;
}

function genderLabel(g: PilgrimFormValues["gender"]): string {
  return g === "female" ? "زن" : "مرد";
}

export type GuestReviewTableRow = {
  originalIndex: number;
  pilgrim: PilgrimFormValues;
  duplicate: boolean;
  radif: number;
};

type Props = {
  className?: string;
};

export function AddKarvanGuestReviewStep({ className }: Props) {
  const {
    draftPilgrims,
    registrationDraft,
    updateDraftPilgrim,
    removeDraftPilgrim,
    completeGuestRegistration,
  } = useReservationCapacityStore(
    useShallow((s) => ({
      draftPilgrims: s.draftPilgrims,
      registrationDraft: s.registrationDraft,
      updateDraftPilgrim: s.updateDraftPilgrim,
      removeDraftPilgrim: s.removeDraftPilgrim,
      completeGuestRegistration: s.completeGuestRegistration,
    })),
  );

  const [search, setSearch] = useState("");
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const supervisor = registrationDraft?.pilgrims[0];
  const supervisorName = supervisor
    ? buildSupervisorName(supervisor)
    : "—";

  const maleCount = useMemo(
    () => draftPilgrims.filter((p) => p.gender === "male").length,
    [draftPilgrims],
  );
  const femaleCount = useMemo(
    () => draftPilgrims.filter((p) => p.gender === "female").length,
    [draftPilgrims],
  );

  const duplicateFlags = useMemo(
    () => draftPilgrims.map((_, i) => rowHasDuplicate(draftPilgrims, i)),
    [draftPilgrims],
  );

  const hasAnyError = duplicateFlags.some(Boolean);

  const filteredIndices = useMemo(() => {
    const q = search.trim().toLowerCase();
    return draftPilgrims
      .map((p, i) => ({ p, i }))
      .filter(({ p, i }) => {
        if (onlyErrors && !duplicateFlags[i]) return false;
        if (!q) return true;
        return (
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.nationalCode.toLowerCase().includes(q)
        );
      });
  }, [draftPilgrims, duplicateFlags, onlyErrors, search]);

  const tableRows: GuestReviewTableRow[] = useMemo(
    () =>
      filteredIndices.map(({ p, i }, displayIdx) => ({
        originalIndex: i,
        pilgrim: p,
        duplicate: duplicateFlags[i] ?? false,
        radif: displayIdx + 1,
      })),
    [filteredIndices, duplicateFlags],
  );

  const onEdit = useCallback((originalIndex: number) => {
    setEditingIndex(originalIndex);
  }, []);

  const onRemove = useCallback(
    (originalIndex: number) => {
      removeDraftPilgrim(originalIndex);
      setEditingIndex((prev) => {
        if (prev === null) return null;
        if (prev === originalIndex) return null;
        if (prev > originalIndex) return prev - 1;
        return prev;
      });
    },
    [removeDraftPilgrim],
  );

  const columns = useMemo((): Column<GuestReviewTableRow>[] => {
    return [
      {
        key: "radif",
        header: "ردیف",
        colClassName: "text-center",
        cell: (row) => toPersianDigits(row.radif),
      },
      {
        key: "firstName",
        header: "نام",
        colClassName: "text-center",
        cell: (row) => row.pilgrim.firstName,
      },
      {
        key: "lastName",
        header: "نام خانوادگی",
        colClassName: "text-center",
        cell: (row) => row.pilgrim.lastName,
      },
      {
        key: "gender",
        header: "جنسیت",
        colClassName: "text-center",
        cell: (row) => genderLabel(row.pilgrim.gender),
      },
      {
        key: "nationalCode",
        header: "کد ملی",
        colClassName: "text-center",
        cell: (row) =>
          row.pilgrim.nationality === "iranian"
            ? toPersianDigits(row.pilgrim.nationalCode)
            : "—",
      },
      {
        key: "passport",
        header: "شماره پاسپورت",
        colClassName: "text-center",
        cell: (row) =>
          row.pilgrim.nationality === "foreign" ? row.pilgrim.nationalCode : "—",
      },
      {
        key: "status",
        header: "وضعیت",
        colClassName: "text-center",
        cell: (row) =>
          row.duplicate ? (
            <span className="font-medium text-[#D22B23]">دارای خطا</span>
          ) : (
            <span className="font-medium text-[#279F78]">کامل</span>
          ),
      },
      {
        key: "actions",
        header: "عملیات",
        colClassName: "text-center",
        cellClassName: "overflow-visible",
        cell: (row) => (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              aria-label="ویرایش"
              className="rounded-lg p-2 text-[#175E47] transition-colors hover:bg-[#F5F9F6]"
              onClick={() => onEdit(row.originalIndex)}
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              aria-label="حذف"
              className="rounded-lg p-2 text-[#D22B23] transition-colors hover:bg-red-50"
              onClick={() => onRemove(row.originalIndex)}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ),
      },
    ];
  }, [onEdit, onRemove]);

  const editMethods = useForm<RegistrationFormValues>({
    resolver: zodResolver(onePilgrimSchema),
    defaultValues: { pilgrims: [emptyPilgrim()] },
  });
  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setValue: editSetValue,
  } = editMethods;

  useEffect(() => {
    if (editingIndex === null) return;
    const row =
      useReservationCapacityStore.getState().draftPilgrims[editingIndex];
    if (!row) {
      setEditingIndex(null);
      return;
    }
    resetEditForm({ pilgrims: [{ ...row }] });
  }, [editingIndex, resetEditForm]);

  const submitEdit = handleEditSubmit((data) => {
    if (editingIndex === null) return;
    updateDraftPilgrim(editingIndex, { ...data.pilgrims[0] });
    setEditingIndex(null);
  });

  const storeMale = useReservationCapacityStore((s) => s.maleAmount);
  const storeFemale = useReservationCapacityStore((s) => s.femaleAmount);
  const submittedRequestCode = useReservationCapacityStore(
    (s) => s.submittedRequestCode,
  );

  const onFinalConfirm = async () => {
    if (hasAnyError || draftPilgrims.length === 0) return;
    // Request was already sent via Caravan/SendRequest — finalize locally.
    completeGuestRegistration({
      maleCount: maleCount || storeMale,
      femaleCount: femaleCount || storeFemale,
      supervisorName,
      reserveCode:
        submittedRequestCode ||
        `TRK-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      pilgrims: draftPilgrims,
    });
  };

  return (
    <div
      className={cn("flex w-full flex-col gap-6 py-4 sm:py-6", className)}
      dir="rtl"
    >
      {/* Summary card */}
      <div
        className="flex w-full flex-col gap-6 rounded-2xl bg-white px-6 py-6 sm:px-10 sm:py-6"
        style={{
          boxShadow: shadows.m,
          minHeight: 206,
          gap: 24,
        }}
      >
        <div className="flex items-center gap-3 text-[#175E47]">
          <FileText className="size-6 shrink-0" aria-hidden />
          <h2 className="text-lg font-semibold sm:text-xl">اطلاعات رزرو</h2>
          <FileText className="size-5 shrink-0 opacity-70" aria-hidden />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-10">
          <div className="flex min-w-0 flex-1 flex-col gap-4 text-sm text-[#61756F]">
            <div className="flex justify-between gap-4">
              <span className="shrink-0 font-medium">مدیر کاروان</span>
              <span className="min-w-0 text-left font-semibold text-[#1F2937]">
                {supervisorName}
              </span>
            </div>
          </div>

          <div
            className="hidden w-px shrink-0 bg-[#E5E7EB] lg:block"
            aria-hidden
          />

          <div className="flex min-h-px min-w-0 flex-1 flex-col gap-4 border-t border-[#E5E7EB] pt-4 text-sm text-[#61756F] lg:border-t-0 lg:pt-0">
            <div className="flex justify-between gap-4">
              <span className="shrink-0 font-medium">مدیر کاروان</span>
              <span className="min-w-0 text-left font-semibold text-[#1F2937]">
                {supervisorName}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium">اعضای کاروان</span>
              <div className="flex flex-wrap items-center gap-4 text-[#1F2937]">
                <span>
                  آقایان: <strong>{toPersianDigits(maleCount)} نفر</strong>
                </span>
                <span className="text-[#E5E7EB]">|</span>
                <span>
                  بانوان: <strong>{toPersianDigits(femaleCount)} نفر</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <FloatingLabelSearch
          id="guest-review-search"
          label="کد ملی یا نام یا نام خانوادگی"
          value={search}
          onChange={setSearch}
          icon={<Search className="size-4" />}
        />
        <div className="flex min-h-12 items-center justify-end md:justify-start">
          <FormControlLabel
            control={
              <Switch
                checked={onlyErrors}
                onChange={(_, v) => setOnlyErrors(v)}
                color="success"
              />
            }
            label="فقط موارد خطا"
            labelPlacement="start"
            sx={{
              marginInline: 0,
              gap: 1,
              "& .MuiFormControlLabel-label": {
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#175E47",
              },
            }}
          />
        </div>
      </div>

      {tableRows.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#61756F]">
          موردی برای نمایش وجود ندارد.
        </p>
      ) : (
        <Table<GuestReviewTableRow>
          data={tableRows}
          columns={columns}
          size="lg"
          className="w-full"
          getRowClassName={(row) =>
            row.duplicate ? "bg-[#EB8A8526] hover:bg-[#EB8A8526]/90" : undefined
          }
          getRowKey={(row) => `pilgrim-${row.originalIndex}`}
        />
      )}

      {editingIndex !== null && draftPilgrims[editingIndex] ? (
        <AddKarvanFormShell>
          <FormProvider {...editMethods}>
            <form
              onSubmit={submitEdit}
              className="flex flex-col gap-0"
              noValidate
            >
              <PilgrimInfoForm
                control={editControl}
                setValue={editSetValue}
                fieldPrefix="pilgrims.0"
                title={`ویرایش زائر ${toPersianDigits(editingIndex + 1)}`}
              />
              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  color="white"
                  text="darkGreen"
                  radius="md"
                  border="gray"
                  size="md"
                  width="auto"
                  onClick={() => setEditingIndex(null)}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  color="darkGreen"
                  text="white"
                  radius="md"
                  border="none"
                  size="md"
                  width="auto"
                  className="px-6 font-semibold"
                >
                  اعمال تغییرات
                </Button>
              </div>
            </form>
          </FormProvider>
        </AddKarvanFormShell>
      ) : null}

      <div className="flex justify-center pt-2">
        <Button
          type="button"
          color="darkGreen"
          text="white"
          radius="md"
          border="none"
          size="twoxl"
          width="auto"
          className="min-w-48 px-10 font-semibold"
          disabled={hasAnyError || draftPilgrims.length === 0}
          onClick={() => void onFinalConfirm()}
        >
          تایید نهایی
        </Button>
      </div>
    </div>
  );
}
