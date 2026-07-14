"use client";

import Link from "next/link";
import Button from "@/features/shared/ui/button";
import Image from "next/image";
import Navbar from "@/features/site/layout/Navbar";
import { colors, HERO_H_MOBILE } from "@/features/reservation/tokens";
import { BOSS_ADD_KARVAN_PATH } from "@/features/auth/lib/panelRouting";
import { ROUTES } from "@/features/shared/config/navigation";

const lanternClass = "pointer-events-none absolute flex flex-col items-center";

export default function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden md:h-120"
      style={{ minHeight: HERO_H_MOBILE }}
    >
      <div className="absolute inset-0 md:min-h-120">
        <Image
          src="/HeaderBackGround.jpg"
          alt=""
          fill
          priority
          loading="eager"
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

      <div
        className={`${lanternClass} end-2 top-2 w-14 sm:end-4 sm:top-4 md:end-3.75dmd:-top-5.75d:w-[134px]`}
        aria-hidden
      >
        <div className="hidden h-23 w-px bg-linear-to-b from-transparent via-white/40 to-transparent md:block md:h-43" />
        <div className="mt-1 size-14 shrink-0 rounded-full border-2 border-[#DBBC59]/50 bg-black/10 sm:size-20 md:-mt-10 md:size-33.5" />
      </div>
      <div
        className={`${lanternClass} start-2 top-2 hidden w-14 sm:flex sm:start-4 sm:top-4 md:start-3.75 md:-top-5.75 md:w-33.5`}
        aria-hidden
      >
        <div className="hidden h-18 w-px bg-linear-to-b from-transparent via-white/40 to-transparent md:block md:h-32" />
        <div className="mt-1 size-14 shrink-0 rounded-full border-2 border-[#DBBC59]/50 bg-black/10 sm:size-20 md:-mt-7 md:size-33.5" />
      </div>

      <div className="relative z-20 flex min-h-[inherit] flex-col md:min-h-120">
        <Navbar />
        <div className="flex flex-1 flex-col items-baseline justify-center px-4 pb-10 pt-4 md:pb-8 md:pt-2">
          <div className="max-w-xl text-baseline text-white sm:max-w-2xl md:max-w-143.75">
            <h1 className="text-2xl font-bold leading-9 text-white sm:text-3xl sm:leading-11 md:text-4xl md:leading-15">
              خدمت‌رسانی به زائران امیرالمومنین (ع)
            </h1>
            <p className="mt-4 text-md font-medium leading-7 text-stretch text-white/95 sm:text-base sm:leading-6 md:mt-6 md:text-lg md:leading-8">
              جای خود را امروز رزرو کنید: رزرو عمومی برای خانواده‌ها و رزرو
              کاروان برای گروه‌های بزرگ
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-8 md:mt-12">
              <Link
                href={ROUTES.generalReservation}
                className="inline-flex w-full shrink-0 sm:w-57.75"
              >
                <Button
                  color="darkGreen"
                  radius="none"
                  border="none"
                  size="lg"
                  width="xl"
                  className="h-11 w-full text-white"
                >
                  رزرو عمومی
                </Button>
              </Link>
              <Link
                href={BOSS_ADD_KARVAN_PATH}
                className="inline-flex w-full shrink-0 sm:w-57.75"
              >
                <Button
                  color="warning"
                  radius="none"
                  border="none"
                  size="xl"
                  width="lg"
                  className="h-11 w-full shrink-0 text-white"
                >
                  رزرو کاروان
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
