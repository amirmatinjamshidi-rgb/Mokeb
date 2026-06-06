"use client";
import Image from "next/image";
import type { ReactNode } from "react";

export type AbilityCardItem = {
  id: number;
  icon?: ReactNode;
  title: string;
  info: string;
};

interface AbilityCardProps {
  item: AbilityCardItem;
}

function AbilityCard({ item }: AbilityCardProps) {
  return (
    <div
      className="mx-auto flex w-full min-h-[160px] max-w-sm flex-col items-center justify-center rounded-xl p-4 transition-all duration-300 hover:shadow-md sm:min-h-[180px] sm:p-6 lg:max-w-none"
    >
      {item.icon && typeof item.icon === "string" ? (
        <Image src={item.icon} alt={item.title} width={80} height={80} />
      ) : item.icon ? (
        <span className="flex h-10 shrink-0 items-center justify-center [&_svg]:size-8 sm:[&_svg]:size-10">
          {item.icon}
        </span>
      ) : null}
      <p className="mt-3 text-center text-sm font-medium text-[#175E47] sm:text-base">
        {item.title}
      </p>
      <p className="mt-2 text-center text-xs font-normal leading-6 text-[#61756F] sm:text-sm">
        {item.info}
      </p>
    </div>
  );
}

export default AbilityCard;
