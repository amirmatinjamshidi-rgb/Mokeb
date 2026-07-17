"use client";

import { MyReservationsContent } from "@/boss-features/components/KarvanReservation/KarvanReservationContent";
import {
  useBossRequests,
  useCancelBossRequest,
  useDownloadBossRequestPdf,
} from "@/boss-features/api/hooks";

export default function MyReservationsPage() {
  const { data: reservations = [], isLoading } = useBossRequests();
  const downloadPdf = useDownloadBossRequestPdf();
  const cancelRequest = useCancelBossRequest();

  return (
    <MyReservationsContent
      reservations={reservations}
      isLoading={isLoading}
      onDownload={(row) => {
        const requestId = row._apiId ?? row.reservationCode;
        if (requestId) void downloadPdf.mutate(requestId);
      }}
      onCancel={async (row) => {
        const requestId = row._apiId;
        if (!requestId) {
          throw new Error("شناسه رزرو برای لغو موجود نیست.");
        }
        await cancelRequest.mutateAsync(requestId);
      }}
    />
  );
}
