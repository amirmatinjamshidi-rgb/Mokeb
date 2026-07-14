"use client";

import { useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Inbox, Pencil } from "lucide-react";

import { AddKarvanFormShell } from "@/boss-features/components/AddKarevan/AddKarvanFormShell";
import PilgrimInfoForm from "@/boss-features/components/AddKarevan/registerboxformComponents/addkarvanForminfo";
import {
  emptyPilgrim,
  pilgrimRegistrationSchema,
  type PilgrimFormValues,
  type RegistrationFormValues,
} from "@/boss-features/components/AddKarevan/FormSchemas";
import { useReservationCapacityStore } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";
import { toPersianDigits } from "@/boss-features/lib/format";
import { cn } from "@/boss-features/lib/utils";
import Button from "@/boss-features/UI/button";

const actionBtnClass =
  "inline-flex h-[40px] min-h-[40px] w-full min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border  px-4 text-sm font-medium leading-[22px] text-[#175E47] transition-colors hover:bg-[#F5F9F6]";

const onePilgrimSchema = pilgrimRegistrationSchema(1);

type Props = {
  className?: string;
};

export function AddKarvanGuestsStep({ className }: Props) {
  const { guests, draftPilgrims, appendDraftPilgrim, setActiveStep } =
    useReservationCapacityStore(
      useShallow((s) => ({
        guests: s.guests,
        draftPilgrims: s.draftPilgrims,
        appendDraftPilgrim: s.appendDraftPilgrim,
        setActiveStep: s.setActiveStep,
      })),
    );
  const draftLen = draftPilgrims.length;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentZaerIndex = draftLen + 1;
  const isLastGuest = draftLen === guests - 1;

  const defaultValues = useMemo(
    (): RegistrationFormValues => ({
      pilgrims: [emptyPilgrim()],
    }),
    [],
  );

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(onePilgrimSchema),
    defaultValues,
    mode: "onSubmit",
  });
  const { control, handleSubmit, reset, setValue } = methods;

  const handleExcelUpload = (file: File) => {
    console.log("excel upload", file.name);
  };

  const onSubmit = (data: RegistrationFormValues) => {
    const pilgrim: PilgrimFormValues = { ...data.pilgrims[0] };
    appendDraftPilgrim(pilgrim);
    if (draftLen + 1 >= guests) {
      setActiveStep(3);
      return;
    }
    reset({ pilgrims: [emptyPilgrim()] });
  };

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4 py-4 sm:py-6"
          noValidate
        >
          <div className="flex w-full flex-col gap-2">
            <h2 className="h-7.5 w-38.5 text-base font-semibold leading-7.5 text-[#175E47] sm:text-lg">
              ثبت اطلاعات زائران
            </h2>
            
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleExcelUpload(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className={actionBtnClass}
              onClick={() => fileInputRef.current?.click()}
            >
              <Inbox className="size-4 shrink-0" />
              <span className="min-w-0 truncate text-center">
                بارگزاری اکسل
              </span>
            </button>
            <button type="button" className={actionBtnClass}>
              <Pencil className="size-4 shrink-0" />
              <span className="min-w-0 truncate text-center">
                انتخاب از زائران سابق
              </span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <AddKarvanFormShell>
            <PilgrimInfoForm
              control={control}
              setValue={setValue}
              fieldPrefix="pilgrims.0"
              title={`زائر ${toPersianDigits(currentZaerIndex)}`}
            />
          </AddKarvanFormShell>
          </div>

          <div className="mt-auto flex shrink-0 flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex h-10 items-center justify-center gap-6 text-sm font-medium sm:justify-start">
              <span className="shrink-0 text-[#61756F]">زائران ثبت شده :</span>
              <span className="shrink-0 font-medium text-[#1F2937]">
                {toPersianDigits(draftLen)}/{toPersianDigits(guests)}
              </span>
            </div>

            <Button
              type="submit"
              color="darkGreen"
              text="white"
              radius="md"
              border="none"
              size="md"
              width="auto"
              className="min-w-40 px-6 font-semibold sm:min-w-48"
            >
              {isLastGuest ? "ثبت و نهایی کردن" : "ثبت"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
