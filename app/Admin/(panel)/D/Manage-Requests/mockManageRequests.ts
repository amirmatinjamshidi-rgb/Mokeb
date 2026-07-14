export type KarvanRequestStatus =
  | "در انتظار بررسی"
  | "رد شده"
  | "تایید شده";

export type KarvanRequest = {
  id: number;
  supervisorName: string;
  totalCapacity: number;
  maleCount: number;
  femaleCount: number;
  entryDate: string;
  exitDate: string;
  status: KarvanRequestStatus;
  reservationType: string;
  reservationClass: string;
  reservationCode: string;
  representativeFirstName: string;
  representativeLastName: string;
  mobile: string;
  stayDuration: string;
};

export const MOCK_KARVAN_REQUESTS: KarvanRequest[] = [
  {
    id: 1,
    supervisorName: "علی رضایی",
    totalCapacity: 42,
    maleCount: 24,
    femaleCount: 18,
    entryDate: "1404/05/12",
    exitDate: "1404/05/18",
    status: "در انتظار بررسی",
    reservationType: "کاروان",
    reservationClass: "VIP",
    reservationCode: "128450",
    representativeFirstName: "محمد",
    representativeLastName: "کریمی",
    mobile: "09121234567",
    stayDuration: "6",
  },
  {
    id: 2,
    supervisorName: "حسین احمدی",
    totalCapacity: 30,
    maleCount: 16,
    femaleCount: 14,
    entryDate: "1404/06/01",
    exitDate: "1404/06/07",
    status: "تایید شده",
    reservationType: "کاروان",
    reservationClass: "A",
    reservationCode: "128451",
    representativeFirstName: "رضا",
    representativeLastName: "موسوی",
    mobile: "09129876543",
    stayDuration: "6",
  },
  {
    id: 3,
    supervisorName: "زهرا محمدی",
    totalCapacity: 18,
    maleCount: 8,
    femaleCount: 10,
    entryDate: "1404/07/10",
    exitDate: "1404/07/14",
    status: "رد شده",
    reservationType: "خانواده",
    reservationClass: "B",
    reservationCode: "128452",
    representativeFirstName: "فاطمه",
    representativeLastName: "حسینی",
    mobile: "09351234567",
    stayDuration: "4",
  },
  {
    id: 4,
    supervisorName: "مریم نوری",
    totalCapacity: 55,
    maleCount: 30,
    femaleCount: 25,
    entryDate: "1404/08/03",
    exitDate: "1404/08/10",
    status: "در انتظار بررسی",
    reservationType: "کاروان",
    reservationClass: "A",
    reservationCode: "128453",
    representativeFirstName: "سعید",
    representativeLastName: "جعفری",
    mobile: "09021234567",
    stayDuration: "7",
  },
  {
    id: 5,
    supervisorName: "رضا کریمی",
    totalCapacity: 12,
    maleCount: 6,
    femaleCount: 6,
    entryDate: "1404/09/15",
    exitDate: "1404/09/18",
    status: "در انتظار بررسی",
    reservationType: "خانواده",
    reservationClass: "C",
    reservationCode: "128454",
    representativeFirstName: "امیر",
    representativeLastName: "رحیمی",
    mobile: "09131234567",
    stayDuration: "3",
  },
  {
    id: 6,
    supervisorName: "فاطمه حسینی",
    totalCapacity: 36,
    maleCount: 20,
    femaleCount: 16,
    entryDate: "1404/10/20",
    exitDate: "1404/10/26",
    status: "تایید شده",
    reservationType: "کاروان",
    reservationClass: "VIP",
    reservationCode: "128455",
    representativeFirstName: "حسین",
    representativeLastName: "اکبری",
    mobile: "09221234567",
    stayDuration: "6",
  },
];
