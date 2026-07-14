export type CapacityGender = "مرد" | "زن";

export type ReservationKind = "کاروان" | "عمومی" | "ویژه";

export type CapacityRow = {
  id: string | number;
  className: string;
  capacity: number;
  gender: CapacityGender;
  reservationKind: ReservationKind;
};

export type CapacitySummarySegment = {
  title: string;
  partA: number;
  partB: number;
  total: number;
};

export const MOCK_CAPACITY_SEGMENTS: CapacitySummarySegment[] = [
  { title: "ظرفیت کل", partA: 500, partB: 500, total: 1000 },
  { title: "موکب", partA: 300, partB: 200, total: 500 },
  { title: "عمومی", partA: 200, partB: 300, total: 500 },
];

export const MOCK_CAPACITY_ROWS: CapacityRow[] = [
  {
    id: 1,
    className: "1",
    capacity: 30,
    gender: "مرد",
    reservationKind: "کاروان",
  },
  {
    id: 2,
    className: "2",
    capacity: 40,
    gender: "زن",
    reservationKind: "عمومی",
  },
  {
    id: 3,
    className: "3",
    capacity: 25,
    gender: "مرد",
    reservationKind: "ویژه",
  },
  {
    id: 4,
    className: "4",
    capacity: 50,
    gender: "زن",
    reservationKind: "کاروان",
  },
];
