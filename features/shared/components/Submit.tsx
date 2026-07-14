"use client";

import Link from "next/link";
import { ROUTES } from "@/features/shared/config/navigation";

function Submit() {
  return (
    <div className="Gray-backGround mx-auto w-full min-h-37 rounded-2xl px-4 py-8 shadow-lg shadow-gray-300 sm:px-8 sm:py-10 md:px-12">
      <div className="flex w-full flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1 text-right">
          <h2 className="text-xl font-bold sm:text-2xl">همراهی با موکب</h2>
          <p className="text-sm sm:text-base">
            برای رزرو و مدیریت اطلاعات، وارد حساب کاربری شوید.
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:max-w-md sm:flex-row sm:items-stretch sm:gap-2 md:max-w-lg">
        <Link
          href={`${ROUTES.login}?returnUrl=${ROUTES.userPanel}`}
          className="inline-flex min-h-14 w-full shrink-0 items-center justify-center rounded-md bg-[#D8B648] px-6 text-base font-medium text-white sm:w-auto sm:min-w-37"
        >
          ورود / ثبت‌نام
        </Link>
        </div>
      </div>
    </div>
  );
}

export default Submit;
