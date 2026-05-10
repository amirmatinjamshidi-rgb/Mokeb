"use client";

import Button from "@/features/UI/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[480px] overflow-hidden">
      
      <div className="absolute inset-0">
        <Image
          src="/HeaderBackGround.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover bg-green-500"
          style={{
            objectPosition: "center",
          }}
        />
      </div>

      
      <div className="relative z-10 max-w-[1440px] mx-auto h-full">
        <div
          className="absolute"
          style={{
            width: "575px",
            height: "296px",
            top: "104px",
            left: "858px",
            display: "flex",
            flexDirection: "column",
            gap: "72px",
          }}
        >
        
          <div className="text-white mx-auto">
            <h1 className="text-4xl font-bold text-center">خدمت‌رسانی به زائران امیرالمومنین (ع)</h1>
            <p className="mt-12 text-lg">جای خود را امروز رزرو کنید : رزرو عمومی برای خانواده ها و رزرو کاروان برای گروه های بزرگ</p>
        <div className="flex gap-8 lg:flex-row mt-12">    <Button color="darkGreen" radius="md" border="none" size="lg" width="lg" className=" text-white shrink-0 w-full lg:w-[231px] h-[44px]">رزرو عمومی</Button>
            <Button color="warning" radius="md" border="none" size="lg" width="lg" className=" text-white shrink-0 w-full lg:w-[231px] h-[44px]  ">رزرو کاروان</Button>
        </div>  </div>
        </div>
      </div>
    </section>
  );
}
