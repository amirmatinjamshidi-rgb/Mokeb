"use client";

import { MyReservationsContent } from "@/boss-features/components/KarvanReservation/KarvanReservationContent";
import {
  useBossRequests,
  useDownloadBossRequestPdf,
} from "@/boss-features/api/hooks";

export default function MyReservationsPage() {
  const { data: reservations = [], isLoading } = useBossRequests();
  const downloadPdf = useDownloadBossRequestPdf();

  return (
    <MyReservationsContent
      reservations={reservations}
      isLoading={isLoading}
      onDownload={(row) => {
        const requestId = row._apiId ?? row.reservationCode;
        if (requestId) void downloadPdf.mutate(requestId);
      }}
    />
  );
}
