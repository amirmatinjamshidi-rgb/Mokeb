"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

import Button from "@/features/shared/ui/button";
import { PilgrimsTable } from "@/features/shared/components/PilgrimsTable";
import { ROUTES } from "@/features/shared/config/navigation";
import { cn } from "@/features/shared/lib/utils";
import { useIndividualRequests } from "@/features/user-panel/api/hooks";
import { useDownloadRequestPdf } from "@admin-kit/api/hooks";
import { SiteReservationContentRow } from "../layouts/SiteReservationLayout";
import { useReservationCapacityStore } from "../store/useReservationCapacityStore";
import ReservationSummaryFinal from "./registerForm/ReservationSummaryFinal";
import { ReserveSuccessMessage } from "./registerForm/ReserveSuccesMessage";

type Props = {
  className?: string;
};

function resolveRequestStatus(
  requests:
    | { id: string; status: string; rawState?: number }[]
    | undefined,
  submittedRequestId: string | null,
  reserveCode: string,
): "pending" | "approved" | "rejected" | "unknown" {
  if (!submittedRequestId && !reserveCode) return "unknown";
  if (!requests?.length) return submittedRequestId ? "pending" : "unknown";
  const match = requests.find(
    (r) =>
      r.id === submittedRequestId ||
      r.id.toLowerCase().includes(reserveCode.toLowerCase()) ||
      reserveCode.toLowerCase().includes(r.id.slice(0, 8).toLowerCase()),
  );
  if (!match) return submittedRequestId ? "pending" : "unknown";
  if (match.rawState === 3 || match.status === "لغو شده") return "rejected";
  if (match.rawState === 2 || match.status === "رزرو فعال") return "approved";
  return "pending";
}

export function ReservationFinalStep({ className }: Props) {
  const router = useRouter();
  const guests = useReservationCapacityStore((s) => s.guests);
  const entryDate = useReservationCapacityStore((s) => s.entryDate);
  const exitDate = useReservationCapacityStore((s) => s.exitDate);
  const confirmation = useReservationCapacityStore(
    (s) => s.registrationConfirmation,
  );
  const submittedRequestId = useReservationCapacityStore(
    (s) => s.submittedRequestId,
  );
  const resetReservation = useReservationCapacityStore((s) => s.resetReservation);

  const { data: requests, refetch } = useIndividualRequests();
  const downloadPdf = useDownloadRequestPdf();

  useEffect(() => {
    if (!submittedRequestId && !confirmation) return;
    const id = window.setInterval(() => {
      void refetch();
    }, 15000);
    return () => window.clearInterval(id);
  }, [submittedRequestId, confirmation, refetch]);

  if (!confirmation) return null;

  const approval = resolveRequestStatus(
    requests?.map((r) => ({
      id: String(r._apiId ?? r.id),
      status: r.status,
      rawState: r.rawState,
    })),
    submittedRequestId,
    confirmation.reserveCode,
  );

  const pilgrimRows = confirmation.pilgrims.map((p) => ({
    firstName: p.firstName,
    lastName: p.lastName,
    gender: p.gender,
    nationalCode: p.nationality === "iranian" ? p.nationalCode : "",
    passportNumber: p.nationality === "foreign" ? p.nationalCode : "",
  }));

  const handleDownloadPdf = async () => {
    const requestId = submittedRequestId || confirmation.reserveCode;
    if (!requestId) return;
    try {
      const blob = await downloadPdf.mutateAsync(requestId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reservation-${confirmation.reserveCode || requestId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // mutation error is enough for now
    }
  };

  return (
    <div className={cn("mx-auto mt-6 w-full sm:mt-8", className)}>
      <SiteReservationContentRow>
        <div className="flex flex-col items-stretch gap-6 sm:gap-8">
          {approval === "pending" ? (
            <div
              className="rounded-2xl border border-[#D8B648]/50 bg-[#FFFBF0] px-5 py-6 text-center"
              dir="rtl"
            >
              <p className="text-lg font-semibold text-[#92400E]">
                درخواست شما ثبت شد و در انتظار تایید ادمین است.
              </p>
              <p className="mt-2 text-sm text-[#61756F]">
                کد پیگیری: {confirmation.reserveCode}. پس از تایید می‌توانید رزرو را
                در پنل کاربری ببینید. با خروج و بازگشت، همین مرحله حفظ می‌شود.
              </p>
            </div>
          ) : approval === "rejected" ? (
            <div
              className="rounded-2xl border border-[#D22B23]/40 bg-red-50 px-5 py-6 text-center"
              dir="rtl"
            >
              <p className="text-lg font-semibold text-[#D22B23]">
                درخواست رزرو رد شد.
              </p>
              <button
                type="button"
                className="mt-4 text-sm font-semibold text-[#175E47] underline"
                onClick={() => resetReservation()}
              >
                شروع مجدد رزرو
              </button>
            </div>
          ) : (
            <ReserveSuccessMessage reserveCode={confirmation.reserveCode} />
          )}

          <ReservationSummaryFinal
            guestCount={guests}
            checkInDate={entryDate}
            checkOutDate={exitDate}
            maleCount={confirmation.maleCount}
            femaleCount={confirmation.femaleCount}
            supervisorName={confirmation.supervisorName}
          />

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-[#175E47]">
              لیست زائران
            </h3>
            <PilgrimsTable pilgrims={pilgrimRows} />
          </div>

          <div
            dir="rtl"
            className="mx-auto flex w-full max-w-site flex-col-reverse gap-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <Button
              type="button"
              color="white"
              border="green"
              text="none"
              radius="md"
              size="twoxl"
              width="auto"
              disabled={downloadPdf.isPending || !submittedRequestId}
              className="flex w-full min-w-0 items-center justify-center gap-2 border-[#175E47] px-4 !text-[#175E47] sm:w-auto sm:min-w-[148px]"
              onClick={() => void handleDownloadPdf()}
            >
              <Download className="size-5 shrink-0" aria-hidden />
              {downloadPdf.isPending ? "در حال دانلود…" : "دانلود pdf"}
            </Button>

            <Button
              type="button"
              color="darkGreen"
              text="white"
              radius="md"
              size="twoxl"
              width="auto"
              className="w-full sm:w-auto sm:min-w-[180px]"
              onClick={() => router.push(ROUTES.userPanel)}
            >
              رفتن به پنل کاربری
            </Button>
          </div>
        </div>
      </SiteReservationContentRow>
    </div>
  );
}
