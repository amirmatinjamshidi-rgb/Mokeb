"use client";
import Image from "next/image";

function KarvanRoad() {
  return (
    <div className="flex w-full flex-col gap-6 p-2 sm:gap-10 sm:p-4">
      <h2 className="text-center text-xl font-bold text-[#61756F] sm:text-2xl lg:text-right">
        تاریخچه موکب
      </h2>
      <div className="relative mx-auto w-full max-w-site overflow-hidden rounded-xl">
        <Image
          src="/Road.png"
          alt="تاریخچه موکب — نمای دسکتاپ"
          width={1296}
          height={252}
          className="hidden h-auto w-full object-contain lg:block"
          sizes="(max-width: 1024px) 0px, 1296px"
        />
        <Image
          src="/MobileRoad.png"
          alt="تاریخچه موکب — نمای موبایل"
          width={350}
          height={252}
          className="mx-auto h-auto w-full max-w-[350px] object-contain lg:hidden"
          sizes="(max-width: 1024px) 100vw, 0px"
        />
      </div>
    </div>
  );
}

export default KarvanRoad;
