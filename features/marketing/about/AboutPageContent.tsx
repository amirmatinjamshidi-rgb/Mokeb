import Submit from "@/features/shared/components/Submit";
import AboutHero from "@/features/marketing/home/AboutHero";
import AboutContacts from "@/features/marketing/about/AboutContacts";
import AboutIntro from "@/features/marketing/about/AboutIntro";
import { Table, type Column } from "@/features/shared/table/MainTable";
import { LocateIcon, Mail, PhoneCall } from "lucide-react";
import Link from "next/link";

export type DemoReservationRow = {
  id: number;
  radif: number;
  otaghName: string;
  peygiriCode: string;
  chechIn: string;
  checkOut: string;
  stayDays: string;
  Quantity: string;
  status: "رزرو آتی" | "لغو شده" | "پایان یافته";
  price: string;
};

const demoReservations: DemoReservationRow[] = [
  {
    id: 1,
    radif: 1,
    otaghName: "سوئیت ساحلی موجان",
    peygiriCode: "۱۴۰۵۱۰",
    chechIn: "۱۴۰۴/۰۵/۱۰",
    checkOut: "۱۴۰۴/۰۵/۱۰",
    stayDays: "۵ شب",
    Quantity: "1 بزرگسال و 2 کودک",
    status: "رزرو آتی",
    price: "23.000.000 تومان",
  },
  {
    id: 2,
    radif: 2,
    otaghName: "اتاق دو تخته کوهستانی",
    peygiriCode: "۱۴۰۵۱۱",
    chechIn: "۱۴۰۴/۰۶/۱۵",
    checkOut: "۱۴۰۴/۰۶/۱۵",
    stayDays: "۵ شب",
    Quantity: "1 بزرگسال و 2 کودک",
    status: "رزرو آتی",
    price: "23.000.000 تومان",
  },
  {
    id: 3,
    radif: 3,
    otaghName: "اتاق دو تخته کوهستانی",
    peygiriCode: "۱۴۰۵۱۲",
    chechIn: "۱۴۰۴/۰۷/۲۰",
    checkOut: "۱۴۰۴/۰۷/۲۰",
    stayDays: "۵ شب",
    Quantity: "1 بزرگسال و 2 کودک",
    status: "رزرو آتی",
    price: "23.000.000 تومان",
  },
];

const reservationColumns: Column<DemoReservationRow>[] = [
  { key: "radif", header: "ردیف", colClassName: "w-10 text-center", cell: (row) => row.radif },
  { key: "otaghName", header: "نام اتاق", colClassName: "flex-1 min-w-[120px]", cell: (row) => row.otaghName },
  { key: "peygiriCode", header: () => <span>کد پیگیری</span>, colClassName: "w-20 text-center", cell: (row) => row.peygiriCode },
  { key: "chechIn", header: "تاریخ ورود", colClassName: "w-24 text-center", cell: (row) => row.chechIn },
  { key: "checkOut", header: "تاریخ خروج", colClassName: "w-24 text-center", cell: (row) => row.checkOut },
  { key: "stayDays", header: "مدت اقامت", colClassName: "w-20 text-center", cell: (row) => row.stayDays },
  { key: "Quantity", header: () => <span>تعداد میهمانان</span>, colClassName: "w-36 text-center whitespace-nowrap", cell: (row) => row.Quantity },
  { key: "status", header: "وضعیت رزرو", colClassName: "w-24 text-center", cell: (row) => row.status },
  { key: "price", header: "مبلغ", colClassName: "w-32 text-center", cell: (row) => row.price },
];

const contactCards = [
  { badgeText: "مدیر اجرایی", name: "محمد رضا فیوجی", phoneNumber: "09127124839" },
  { badgeText: "مسئول مالی و خزانه دار", name: "علی حیدری", phoneNumber: "09126990233" },
  { badgeText: "رئیس هیات امناء", name: "حاج غلامرضا حیدری", phoneNumber: "09121091726" },
  { badgeText: "مسئول امور فرهنگی", name: "شیخ محمدرضا اشراقی", phoneNumber: "09196125785" },
  { badgeText: "مسئول امور بانوان", name: "خانم مریم احمدی", phoneNumber: "09194889415" },
] as const;

export function AboutPageContent() {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col items-center gap-8 pb-20 pt-0 sm:gap-10">
      <AboutHero />

      <div className="page-container flex w-full flex-col gap-8 sm:gap-10">
        <AboutIntro
          items={[
            {
              icon: <LocateIcon aria-hidden />,
              title: "موقعیت مکانی",
              linkOrNumber: (
                <Link
                  href="https://neshan.org/maps/places/rb_ryO2AAyPp#c31.993-44.327-15z-0p"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  مشاهده روی نقشه
                </Link>
              ),
            },
            {
              icon: <Mail aria-hidden />,
              title: "ایمیل",
              linkOrNumber: <a href="mailto:info@mokab.com">info@mokab.com</a>,
            },
            {
              icon: <PhoneCall aria-hidden />,
              title: "شماره تماس",
              linkOrNumber: (
                <a href="tel:+982144556677" dir="ltr" className="inline-block">
                  021-44556677
                </a>
              ),
            },
          ]}
        />

        <div className="flex w-full flex-col gap-4">
          {contactCards.map((card) => (
            <AboutContacts key={card.phoneNumber} {...card} />
          ))}
        </div>

        <Table data={demoReservations} columns={reservationColumns} />
        <Submit />
      </div>
    </div>
  );
}
