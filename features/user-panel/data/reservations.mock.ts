import type {
  ReservationStatus,
  RoomReservationList,
} from "@/features/user-panel/components/reservations/MyReservationsContent";

const statuses: ReservationStatus[] = ["رزرو فعال", "لغو شده", "عدم حضور"];

export const mockReservations: RoomReservationList[] = Array.from(
  { length: 80 },
  (_, i) => {
    const n = i + 1;
    return {
      id: n,
      radif: n,
      reservationCode: `ZJ-${48290 + n}`,
      checkIn: `1404/${String(5 + (n % 6)).padStart(2, "0")}/10`,
      checkOut: `1404/${String(5 + (n % 6)).padStart(2, "0")}/15`,
      companionsCount: (n % 4) + 1,
      status: statuses[n % 3],
    };
  },
);
