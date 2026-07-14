"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircle, TickCircle } from "iconsax-reactjs";
import { UsersRound } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import PilgrimInfoForm from "@admin-kit/forms/supervisor/PilgrimInfoForm";
import {
  emptyPilgrim,
  pilgrimRegistrationSchema,
  type PilgrimFormValues,
  type RegistrationFormValues,
} from "@admin-kit/schemas/supervisorFormSchemas";
import { Table, type Column } from "@admin-kit/index";
import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";

import type { RegisterUser } from "./registerUserTypes";
import { SettingsModalShell } from "../../E/Settings/SettingsModalShell";
import {
  SETTINGS_ACTION_BTN_CLASS,
  SETTINGS_INFO_BOX_CLASS,
} from "../../E/Settings/settingsStyles";

type PendingPilgrimRow = PilgrimFormValues & { id: number; radif: number };

type Props = {
  open: boolean;
  capacity: RegisterUser | null;
  onClose: () => void;
  onComplete: (pilgrims: PilgrimFormValues[]) => void;
};

function persian(value: string | number) {
  return toPersianDigits(value);
}

function CapacitySummaryBox({
  total,
  registered,
  remaining,
}: {
  total: number;
  registered: number;
  remaining: number;
}) {
  const items: {
    label: string;
    value: string;
    color: string;
    icon: "users" | "tick" | "info";
  }[] = [
    {
      label: "ظرفیت کل",
      value: `${persian(total)} نفر`,
      color: "#2E7DDC",
      icon: "users",
    },
    {
      label: "ظرفیت ثبت شده",
      value: `${persian(registered)} نفر`,
      color: "#23D283",
      icon: "tick",
    },
    {
      label: "ظرفیت باقی مانده",
      value: `${persian(remaining)} نفر`,
      color: "#CBA52C",
      icon: "info",
    },
  ];

  return (
    <div className={SETTINGS_INFO_BOX_CLASS}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {item.icon === "users" ? (
                <UsersRound
                  className="size-5 shrink-0 text-gray-400"
                  aria-hidden
                />
              ) : item.icon === "tick" ? (
                <TickCircle
                  variant="Outline"
                  size={20}
                  className="size-5 shrink-0 text-gray-400"
                  color="currentColor"
                  aria-hidden
                />
              ) : (
                <InfoCircle
                  variant="Outline"
                  size={20}
                  className="size-5 shrink-0 text-gray-400"
                  color="currentColor"
                  aria-hidden
                />
              )}
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <span
              className="pr-7 text-sm font-semibold"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function isPilgrimFilled(pilgrim: PilgrimFormValues) {
  return Boolean(
    pilgrim.firstName.trim() ||
      pilgrim.lastName.trim() ||
      pilgrim.nationalCode.trim() ||
      pilgrim.mobile1.trim(),
  );
}

function buildPilgrimColumns(): Column<PendingPilgrimRow>[] {
  return [
    {
      key: "radif",
      header: "ردیف",
      colClassName: "text-center",
      cell: (row) => persian(row.radif),
    },
    {
      key: "firstName",
      header: "نام",
      colClassName: "text-center",
      cell: (row) => row.firstName,
    },
    {
      key: "lastName",
      header: "نام خانوادگی",
      colClassName: "text-center",
      cell: (row) => row.lastName,
    },
    {
      key: "nationalCode",
      header: "کد ملی",
      colClassName: "text-center",
      cell: (row) => persian(row.nationalCode),
    },
    {
      key: "mobile1",
      header: "شماره موبایل",
      colClassName: "text-center",
      cell: (row) => persian(row.mobile1),
    },
  ];
}

const PILGRIM_COLUMNS = buildPilgrimColumns();

export function OnsiteRegistrationModal({
  open,
  capacity,
  onClose,
  onComplete,
}: Props) {
  const [pendingPilgrims, setPendingPilgrims] = useState<PilgrimFormValues[]>(
    [],
  );

  const schema = useMemo(() => pilgrimRegistrationSchema(1), []);

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { pilgrims: [emptyPilgrim()] },
    mode: "onChange",
  });

  const { control, handleSubmit, reset, formState } = methods;
  const { isValid } = formState;

  const currentPilgrim = useWatch({
    control,
    name: "pilgrims.0",
  });

  const sessionRegistered = capacity
    ? capacity.registeredCapacity + pendingPilgrims.length
    : 0;
  const sessionRemaining = capacity
    ? Math.max(0, capacity.totalCapacity - sessionRegistered)
    : 0;

  useEffect(() => {
    if (!open) {
      setPendingPilgrims([]);
      reset({ pilgrims: [emptyPilgrim()] });
    }
  }, [open, reset]);

  if (!open || !capacity) return null;

  const tableRows: PendingPilgrimRow[] = pendingPilgrims.map(
    (pilgrim, index) => ({
      ...pilgrim,
      id: index + 1,
      radif: index + 1,
    }),
  );

  const addPilgrimAndReset = (data: RegistrationFormValues) => {
    if (sessionRemaining <= 0) return;
    setPendingPilgrims((prev) => [...prev, data.pilgrims[0]]);
    reset({ pilgrims: [emptyPilgrim()] });
  };

  const finalizeRegistration = async () => {
    const current = methods.getValues().pilgrims[0];
    let all = [...pendingPilgrims];

    if (isPilgrimFilled(current)) {
      const valid = await methods.trigger();
      if (!valid) return;
      all = [...all, current];
    }

    if (all.length === 0) return;
    onComplete(all);
    onClose();
  };

  const canAddNew = isValid && sessionRemaining > 0;
  const currentFilled = currentPilgrim
    ? isPilgrimFilled(currentPilgrim)
    : false;
  const canFinalize =
    pendingPilgrims.length > 0 || (currentFilled && isValid);

  return (
    <SettingsModalShell
      open={open}
      title="ثبت نام حضوری"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              SETTINGS_ACTION_BTN_CLASS,
              "border-transparent bg-transparent text-[#175E47]",
            )}
          >
            انصراف از ثبت
          </button>
          <button
            type="button"
            disabled={!canAddNew}
            onClick={handleSubmit(addPilgrimAndReset)}
            className={cn(
              SETTINGS_ACTION_BTN_CLASS,
              "border-[#175E47] bg-white text-[#175E47]",
              !canAddNew && "cursor-not-allowed opacity-50",
            )}
          >
            افزودن زائر جدید
          </button>
          <button
            type="button"
            disabled={!canFinalize}
            onClick={finalizeRegistration}
            className={cn(
              SETTINGS_ACTION_BTN_CLASS,
              "border-[#175E47] bg-[#175E47] text-white",
              !canFinalize && "cursor-not-allowed opacity-50",
            )}
          >
            ثبت نهایی
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        <CapacitySummaryBox
          total={capacity.totalCapacity}
          registered={sessionRegistered}
          remaining={sessionRemaining}
        />

        <FormProvider {...methods}>
          <PilgrimInfoForm
            control={control}
            fieldPrefix="pilgrims.0"
            title="زائر"
          />
        </FormProvider>

        {pendingPilgrims.length > 0 ? (
          <Table
            data={tableRows}
            columns={PILGRIM_COLUMNS}
            size="lg"
            className="w-full"
          />
        ) : null}
      </div>
    </SettingsModalShell>
  );
}
