"use client";

import Submit from "@/features/shared/components/Submit";
import AboutHero from "@/features/marketing/home/AboutHero";
import AboutContacts from "@/features/marketing/about/AboutContacts";
import AboutIntro from "@/features/marketing/about/AboutIntro";
import { LocateIcon, Mail, PhoneCall } from "lucide-react";
import Link from "next/link";
import { useOfficials } from "@admin-kit/api/hooks";

export function AboutPageContent() {
  const { data: officials = [], isLoading, error } = useOfficials();

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col items-center gap-8 pb-20 pt-0 sm:gap-10">
      <AboutHero />

      <div className="page-container flex w-full flex-col gap-8 sm:gap-10">
        <AboutIntro
          items={[
            {
              icon: <LocateIcon aria-hidden />,
              title: "موقعیت مکانی",
              linkOrNumber: (
                <Link
                  href="https://neshan.org/maps/places/rb_ryO2AAyPp#c31.993-44.327-15z-0p"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  مشاهده روی نقشه
                </Link>
              ),
            },
            {
              icon: <Mail aria-hidden />,
              title: "ایمیل",
              linkOrNumber: <a href="mailto:info@mokab.com">info@mokab.com</a>,
            },
            {
              icon: <PhoneCall aria-hidden />,
              title: "شماره تماس",
              linkOrNumber: (
                <a href="tel:+982144556677" dir="ltr" className="inline-block">
                  021-44556677
                </a>
              ),
            },
          ]}
        />

        <div className="flex w-full flex-col gap-4">
          {isLoading ? (
            <p className="text-center text-sm text-[#61756F]">در حال بارگذاری…</p>
          ) : null}
          {error ? (
            <p className="text-center text-sm text-[#D22B23]">
              بارگذاری فهرست مسئولان ناموفق بود.
            </p>
          ) : null}
          {!isLoading && !error && officials.length === 0 ? (
            <p className="text-center text-sm text-[#61756F]">
              هنوز مسئولی ثبت نشده است.
            </p>
          ) : null}
          {officials.map((official) => {
            const fullName = [official.firstName, official.lastName]
              .filter(Boolean)
              .join(" ");
            return (
              <AboutContacts
                key={official.id}
                badgeText="مسئول"
                name={fullName || "—"}
                phoneNumber={official.mobile || "—"}
              />
            );
          })}
        </div>

        <Submit />
      </div>
    </div>
  );
}
