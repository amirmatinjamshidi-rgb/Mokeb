"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/boss-features/config/navigation";
import Button from "@/boss-features/UI/button";
import { useDownloadBossRequestPdf } from "@/boss-features/api/hooks";
import { useReservationCapacityStore } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";

export function DownloadObserverActions() {
  const router = useRouter();
  const downloadPdf = useDownloadBossRequestPdf();
  const submittedRequestId = useReservationCapacityStore(
    (s) => s.submittedRequestId,
  );
  const confirmation = useReservationCapacityStore(
    (s) => s.registrationConfirmation,
  );
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setError(null);
    const requestId =
      submittedRequestId ||
      confirmation?.reserveCode ||
      "";
    if (!requestId || requestId === "—") {
      setError("شناسه درخواست برای دانلود PDF موجود نیست.");
      return;
    }
    try {
      await downloadPdf.mutateAsync(requestId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "دانلود PDF ناموفق بود.");
    }
  };

  return (
    <div
      dir="rtl"
      className="mx-auto flex w-full max-w-form-row flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
    >
      <Button
        type="button"
        color="white"
        border="green"
        text="none"
        radius="md"
        size="twoxl"
        width="auto"
        disabled={downloadPdf.isPending}
        className="flex w-full min-w-0 items-center justify-center gap-2 border-[#175E47] px-4 !text-[#175E47] sm:w-auto sm:min-w-[148px]"
        onClick={() => void handleDownload()}
      >
        <Download className="size-5 shrink-0" aria-hidden />
        {downloadPdf.isPending ? "در حال دانلود…" : "دانلود pdf"}
      </Button>

      <Button
        type="button"
        color="darkGreen"
        text="white"
        radius="md"
        border="none"
        size="twoxl"
        width="auto"
        className="w-full min-w-0 px-4 font-semibold sm:w-auto sm:min-w-[172px]"
        onClick={() => router.push(ROUTES.bossReservations)}
      >
        رفتن به رزروهای کاروان
      </Button>

      {error ? (
        <p className="w-full text-center text-sm text-[#D22B23] sm:basis-full">
          {error}
        </p>
      ) : null}
    </div>
  );
}
