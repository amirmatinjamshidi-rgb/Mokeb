import React from "react";
import Hero from "@/features/marketing/home/Hero";
import Submit from "@/features/shared/components/Submit";
import AbilityCardList from "@/features/marketing/home/AbilityCard";
import ServicesSection from "@/features/marketing/home/ServicesSection";
import KarvanRoad from "@/features/shared/ui/KarvanRoad";
import HomeAccordion from "@/features/marketing/home/HomeAccordion";
import StartReservationBox from "@/features/reservation/components/StartReservationBox";

function page() {
  return (
    <>
      <Hero />
      <div className="page-container flex flex-col gap-10 pb-12 pt-6 sm:gap-14 md:gap-20">
        <ServicesSection />
        <AbilityCardList />
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <StartReservationBox
            title="همین حالا رزرو کنید"
            description="مناسب خانواده‌ها و گروه‌های کوچک
ثبت سریع بدون نیاز به هماهنگی"
            buttonText="شروع رزرو"
            buttonColor="darkGreen"
            className="text-white"
            backgroundImage="/HomeImages/BoxBg.png"
            sideImage="/HomeImages/RightImg.png"
            buttonSize="xl"
          />
          <StartReservationBox
            title="رزرو ویژه کاروان‌ها"
            description="مناسب کاروان‌ها و گروه‌های سازمان‌یافته
مدیریت یکپارچه اعضا و ظرفیت اقامت"
            buttonText="شروع رزرو"
            buttonColor="warning"
            className="text-white"
            backgroundImage="/HomeImages/BoxBg.png"
            sideImage="/HomeImages/LeftImg.png"
          />
        </div>
        <KarvanRoad />
        <HomeAccordion />
        <Submit />
      </div>
    </>
  );
}

export default page;
