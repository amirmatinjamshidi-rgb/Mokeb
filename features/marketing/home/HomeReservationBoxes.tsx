"use client";

import { useRouter } from "next/navigation";

import { BOSS_ADD_KARVAN_PATH } from "@/features/auth/lib/panelRouting";
import { ROUTES } from "@/features/shared/config/navigation";
import StartReservationBox from "@/features/reservation/components/StartReservationBox";

export function HomeReservationBoxes() {
  const router = useRouter();

  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      <StartReservationBox
        title="همین حالا رزرو کنید"
        description={`مناسب خانواده‌ها و گروه‌های کوچک
ثبت سریع بدون نیاز به هماهنگی`}
        buttonText="شروع رزرو"
        buttonColor="darkGreen"
        className="text-white"
        backgroundImage="/HomeImages/BoxBg.png"
        sideImage="/HomeImages/RightImg.png"
        onButtonClick={() => router.push(ROUTES.generalReservation)}
      />
      <StartReservationBox
        title="رزرو ویژه کاروان‌ها"
        description={`مناسب کاروان‌ها و گروه‌های سازمان‌یافته
مدیریت یکپارچه اعضا و ظرفیت اقامت`}
        buttonText="شروع رزرو"
        buttonColor="warning"
        className="text-white"
        backgroundImage="/HomeImages/BoxBg.png"
        sideImage="/HomeImages/LeftImg.png"
        onButtonClick={() => router.push(BOSS_ADD_KARVAN_PATH)}
      />
    </div>
  );
}
