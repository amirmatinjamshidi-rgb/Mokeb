import type {
  ReservationStatus,
  RoomReservationList,
} from "../components/KarvanReservation/KarvanReservationContent";

const statuses: ReservationStatus[] = [
  "در انتظار تایید",
  "رزرو فعال",
  "لغو شده",
  "عدم حضور",
];

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
      supervisorName: "علی محمدی",
      maleCount: (n % 3) + 1,
      femaleCount: n % 2,
      pilgrims: [],
      status: statuses[n % 4],
    };
  },
);
