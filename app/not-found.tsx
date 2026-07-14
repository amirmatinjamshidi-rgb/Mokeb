import Link from "next/link";

import LoginBackground from "@admin-kit/layouts/LoginBackground";
import { ROUTES } from "@admin-kit/navigation/routes";

export default function NotFound() {
  return (
    <LoginBackground>
      <div className="flex w-full flex-col items-center justify-center gap-6 rounded-2xl bg-white p-8 shadow-md shadow-gray-300">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-5xl font-bold text-[#175E47]">۴۰۴</span>
          <h1 className="text-2xl font-bold text-gray-500">صفحه یافت نشد</h1>
          <p className="text-sm leading-6 text-gray-500">
            صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
          </p>
        </div>

        <Link
          href={ROUTES.home}
          className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#175E47] text-base font-semibold text-white transition-colors hover:bg-[#1F7E5F]"
        >
          بازگشت به خانه
        </Link>
      </div>
    </LoginBackground>
  );
}
