"use client";

import React from "react";
import { cn } from "@/features/shared/lib/utils";

export type AboutIntroItem = {
  icon: React.ReactNode;
  title: string;
  linkOrNumber: React.ReactNode;
};

export type AboutIntroProps = {
  items: AboutIntroItem[];
  className?: string;
};

function IntroSection({
  icon,
  title,
  linkOrNumber,
}: AboutIntroItem) {
  return (
    <section className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6 md:min-h-[174px] md:px-5">
      <div className="flex shrink-0 items-center justify-center text-2xl text-[#61756F] [&_svg]:size-6 sm:[&_svg]:size-7">
        {icon}
      </div>

      <h3 className="text-center text-base font-medium text-[#61756F] sm:text-lg md:text-xl">
        {title}
      </h3>

      <div className="w-full text-center text-sm font-bold tracking-wide text-[#CBA52C] [&_a]:text-[#CBA52C] [&_a]:underline-offset-2 hover:[&_a]:underline">
        {linkOrNumber}
      </div>
    </section>
  );
}

function SectionDivider({ orientation }: { orientation: "horizontal" | "vertical" }) {
  if (orientation === "horizontal") {
    return (
      <div
        className="h-px w-full shrink-0 bg-gray-400 md:hidden"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="hidden w-px shrink-0 self-stretch bg-gray-400 md:block"
      aria-hidden
    />
  );
}


export default function AboutIntro({ items, className }: AboutIntroProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className={cn(
        "mx-auto w-full max-w-site rounded-lg border border-t-gray-400 bg-white shadow-[0px_2px_4px_0px_#0000001F]",
        "flex flex-col md:flex-row md:items-stretch",
        className,
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 ? (
            <>
              <SectionDivider orientation="horizontal" />
              <SectionDivider orientation="vertical" />
            </>
          ) : null}
          <IntroSection {...item} />
        </React.Fragment>
      ))}
    </div>
  );
}
