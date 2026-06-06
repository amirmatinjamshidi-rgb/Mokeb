"use client";

import Image from "next/image";
import Navbar from "@/features/shared/layout/Navbar";
import { HeroLanterns } from "@/features/shared/components/HeroLanterns";
import { colors, HERO_H_MOBILE } from "../tokens";

export function ReservationHero() {
  return (
    <section
      className="relative w-full overflow-hidden md:h-[480px]"
      style={{ minHeight: HERO_H_MOBILE }}
    >
      <div className="absolute inset-0 md:min-h-[480px]">
        <Image
          src="/HeaderBackGround.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1440px"
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 8px,
              ${colors.primary08}22 8px,
              ${colors.primary08}22 9px
            )`,
          }}
        />
      </div>

      <HeroLanterns />

      <div className="relative z-20 flex min-h-[inherit] flex-col md:min-h-[480px]">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-4 md:pb-8 md:pt-2">
          <div className="w-full max-w-xl text-center text-white sm:max-w-2xl md:max-w-[438px]">
            <h1 className="text-2xl font-bold leading-9 text-white sm:text-3xl sm:leading-[44px] md:text-[40px] md:leading-[60px]">
              رزرو سریع و آسان برای زائران
            </h1>
            <p className="mt-4 text-sm font-medium leading-7 text-white/95 sm:text-base sm:leading-6 md:mt-5">
              ثبت اطلاعات افراد گروه و رزرو خدمات به‌صورت آنلاین
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
