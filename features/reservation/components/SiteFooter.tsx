"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { mainNavItems } from "@/features/shared/config/navigation";
import { cn } from "@/features/shared/lib/utils";
import { colors, shadows } from "../tokens";

function TitleFooter({ text }: { text: string }) {
  return (
    <div className="flex w-full items-center justify-end px-2 py-1">
      <p
        className="whitespace-nowrap text-right font-medium text-white"
        style={{ fontSize: 16, lineHeight: "24px" }}
      >
        {text}
      </p>
    </div>
  );
}

type Props = {
  className?: string;
};

export function SiteFooter({ className }: Props) {
  return (
    <footer
      dir="ltr"
      className={cn(
        "relative mt-0 flex w-full flex-col items-center gap-8 overflow-hidden rounded-t-2xl px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:px-[72px]",
        className,
      )}
      style={{
        backgroundColor: colors.footerGreen,
        boxShadow: shadows.s,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-5"
      >
        <Image
          src="/HeaderBackGround.jpg"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-site flex-col-reverse gap-10 lg:flex-row lg:justify-between">
        <div className="flex w-full min-w-0 flex-col items-end gap-6 lg:max-w-[528px]">
          <TitleFooter text="اطلاعات تماس" />
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-start justify-end gap-2 px-2 py-1">
              <p
                className="flex-1 text-right text-base font-normal leading-6 text-white"
                dir="rtl"
              >
                آدرس ایران : تهران ، مهرآباد جنوبی ، خیابان دانشگاه هوایی شمالی
                ، خیابان جندقی ، کوچه حسنی ، کوچه یکم ، پلاک 2 طبقه اول
              </p>
              <MapPin
                className="mt-0.5 size-6 shrink-0 text-white"
                aria-hidden
              />
            </div>
            <div className="flex w-full items-start justify-end gap-2 px-2 py-1">
              <p
                className="flex-1 text-right text-base font-normal leading-6 text-white"
                dir="rtl"
              >
                آدرس موکب در کشور عراق : نجف، کوچه روبروی شارع مزار بنات الحسن،
                فرعی اول سمت چپ ، مدرسه الفتوة
              </p>
              <MapPin
                className="mt-0.5 size-6 shrink-0 text-white"
                aria-hidden
              />
            </div>
            <div className="flex w-full items-center justify-end gap-2 px-2 py-1">
              <a
                href="tel:02144556677"
                className="text-base font-normal leading-6 text-white"
                dir="ltr"
              >
                021-44556677
              </a>
              <Phone className="size-6 shrink-0 text-white" aria-hidden />
            </div>
            <div className="flex w-full items-center justify-end gap-2 px-2 py-1">
              <span className="text-base font-normal leading-6 text-white">
                شنبه تا پنج‌شنبه ۹ تا ۱۷
              </span>
              <Clock className="size-6 shrink-0 text-white" aria-hidden />
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col items-end gap-4 lg:max-w-[280px]">
          <TitleFooter text="دسترسی سریع" />
          <nav className="flex w-full flex-col items-end gap-2">
            {mainNavItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-2 py-1 text-right text-base leading-6 text-white/95 hover:text-[#DFC369]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex w-full min-w-0 flex-col items-end gap-4 lg:max-w-[280px]">
          <div className="flex flex-col items-end gap-3">
            <Image
              src="/Logo.png"
              alt="موکب"
              width={56}
              height={56}
              className="object-contain"
            />
            <p className="max-w-xs text-right text-sm leading-6 text-white/90">
              بیش از نه سال همراهی با زائران امیرالمومنین (ع)
            </p>
          </div>
        </div>
      </div>

      <p
        className="relative z-10 w-full border-t border-white/15 pt-6 text-center text-sm text-white/80"
        dir="rtl"
      >
        2025 موکب حضرت ابوالفصل عباس (ع) | همه حقوق مادی و معنوی محفوظ است.
      </p>
    </footer>
  );
}
