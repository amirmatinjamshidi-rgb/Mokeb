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
            className=" mx-auto max-h-[194px] lg:min-w-[320px]
      rounded-xl
      flex flex-col items-center 
      aspect-square
      hover:shadow-md hover:shadow-primaryBorder
      transition-all duration-300
    "
        >
            {item.icon && typeof item.icon === "string" ? (
                <Image src={item.icon} alt={item.title} width={80} height={80} />
            ) : item.icon ? (
                <span className=" h-10 flex items-center justify-center shrink-0">{item.icon}</span>
            ) : null}
            <p className="mt-3 text-sm sm:text-base font-medium text-textPrimary text-center">
                {item.title}
            </p>
            <p className="mt-3 text-sm sm:text-base font-medium text-textPrimary text-center">
                {item.info}
            </p>
        </div>
    );
}

export default AbilityCard;
