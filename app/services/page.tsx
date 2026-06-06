import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/features/shared/config/navigation";

export const metadata: Metadata = {
  title: "خدمات | موکب",
  description: "خدمات رزرو و همراهی موکب",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white pb-16 pt-6 sm:pt-10">
      <div className="page-container max-w-3xl">
        <header className="mb-10 text-right">
          <h1 className="text-3xl font-bold text-[#175E47] sm:text-4xl">خدمات</h1>
          <p className="mt-4 text-base leading-8 text-[#61756F] sm:text-lg">
            رزرو عمومی برای خانواده‌ها و رزرو کاروان برای گروه‌های بزرگ؛ به‌زودی
            جزئیات کامل هر خدمت در همین صفحه قرار می‌گیرد.
          </p>
        </header>
        <div className="flex flex-col gap-4 text-right sm:flex-row sm:justify-end">
          <Link
            href={ROUTES.generalReservation}
            className="inline-flex items-center justify-center rounded-2xl bg-[#175E47] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1F7E5F]"
          >
            رزرو عمومی
          </Link>
          <Link
            href={ROUTES.home}
            className="inline-flex items-center justify-center rounded-2xl border-2 border-[#175E47] px-6 py-3 text-sm font-semibold text-[#175E47] transition hover:bg-[#F5F9F6]"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}
