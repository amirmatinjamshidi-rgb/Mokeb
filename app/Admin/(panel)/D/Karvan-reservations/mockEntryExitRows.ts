export type EntryStatus = "در انتظار" | "تاخیر در ورود" | "پذیرش شده";

export type ExitStatus =
  | "در انتظار خروج"
  | "تاخیر در خروج"
  | "عدم خروج"
  | "خروج ثبت شده";

export type ReservationClassId = 1 | 2 | 3 | 4;

export const RESERVATION_CLASS_LABELS: Record<ReservationClassId, string> = {
  1: "VIP",
  2: "A",
  3: "B",
  4: "C",
};

export function formatReservationClass(
  value: ReservationClassId | number | string,
): string {
  return (
    RESERVATION_CLASS_LABELS[value as ReservationClassId] ?? String(value)
  );
}

export type ReservationRow = {
  id: string;
  supervisorName: string;
  reservationType: string;
  reservationClass: ReservationClassId | number | string;
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  status: EntryStatus | ExitStatus;
  reservationCode: string;
  representativeFirstName: string;
  representativeLastName: string;
  entryDate: string;
  exitDate: string;
  mobile: string;
  stayDuration: string;
};

export const MOCK_ENTRY_ROWS: ReservationRow[] = [
  {
    id: "1",
    supervisorName: "علی رضایی",
    reservationType: "کاروان",
    reservationClass: 1,
    totalCount: 42,
    maleCount: 24,
    femaleCount: 18,
    status: "در انتظار",
    reservationCode: "128450",
    representativeFirstName: "محمد",
    representativeLastName: "کریمی",
    entryDate: "1404/03/12",
    exitDate: "1404/03/18",
    mobile: "09121234567",
    stayDuration: "6",
  },
  {
    id: "2",
    supervisorName: "حسین احمدی",
    reservationType: "خانواده",
    reservationClass: 2,
    totalCount: 8,
    maleCount: 4,
    femaleCount: 4,
    status: "تاخیر در ورود",
    reservationCode: "128451",
    representativeFirstName: "رضا",
    representativeLastName: "موسوی",
    entryDate: "1404/03/12",
    exitDate: "1404/03/15",
    mobile: "09129876543",
    stayDuration: "3",
  },
  {
    id: "3",
    supervisorName: "مهدی صادقی",
    reservationType: "کاروان",
    reservationClass: 3,
    totalCount: 30,
    maleCount: 16,
    femaleCount: 14,
    status: "پذیرش شده",
    reservationCode: "128452",
    representativeFirstName: "امیر",
    representativeLastName: "حسینی",
    entryDate: "1404/03/11",
    exitDate: "1404/03/17",
    mobile: "09131112233",
    stayDuration: "6",
  },
];

export const MOCK_EXIT_ROWS: ReservationRow[] = [
  {
    id: "4",
    supervisorName: "سعید نوری",
    reservationType: "کاروان",
    reservationClass: 1,
    totalCount: 35,
    maleCount: 20,
    femaleCount: 15,
    status: "در انتظار خروج",
    reservationCode: "228450",
    representativeFirstName: "جواد",
    representativeLastName: "اکبری",
    entryDate: "1404/03/05",
    exitDate: "1404/03/12",
    mobile: "09124445566",
    stayDuration: "7",
  },
  {
    id: "5",
    supervisorName: "پرویز کاظمی",
    reservationType: "خانواده",
    reservationClass: 2,
    totalCount: 5,
    maleCount: 2,
    femaleCount: 3,
    status: "تاخیر در خروج",
    reservationCode: "228451",
    representativeFirstName: "حامد",
    representativeLastName: "جعفری",
    entryDate: "1404/03/06",
    exitDate: "1404/03/12",
    mobile: "09127778899",
    stayDuration: "6",
  },
  {
    id: "6",
    supervisorName: "کریم باقری",
    reservationType: "کاروان",
    reservationClass: 3,
    totalCount: 28,
    maleCount: 15,
    femaleCount: 13,
    status: "عدم خروج",
    reservationCode: "228452",
    representativeFirstName: "ناصر",
    representativeLastName: "ملکی",
    entryDate: "1404/03/04",
    exitDate: "1404/03/11",
    mobile: "09123334455",
    stayDuration: "7",
  },
  {
    id: "7",
    supervisorName: "فرهاد مرادی",
    reservationType: "کاروان",
    reservationClass: 4,
    totalCount: 22,
    maleCount: 12,
    femaleCount: 10,
    status: "خروج ثبت شده",
    reservationCode: "228453",
    representativeFirstName: "یاسر",
    representativeLastName: "قاسمی",
    entryDate: "1404/03/03",
    exitDate: "1404/03/10",
    mobile: "09126667788",
    stayDuration: "7",
  },
];
