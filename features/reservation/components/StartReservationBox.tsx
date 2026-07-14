"use client";

import Image from "next/image";
import { ReactNode } from "react";

import Button from "@/features/shared/ui/button";
import { cn } from "@/features/shared/lib/utils";

type ReserveStartProps = {
  title: string;
  description?: string;

  backgroundImage: string;
  sideImage: string;

  buttonText?: string;
  onButtonClick?: () => void;

  buttonColor?: React.ComponentProps<typeof Button>["color"];
  buttonSize?: React.ComponentProps<typeof Button>["size"];
  buttonWidth?: React.ComponentProps<typeof Button>["width"];

  customButton?: ReactNode;
  className?: string;
};

export default function ReserveStart({
  title,
  description,
  backgroundImage,
  sideImage,
  buttonText = "شروع رزرو",
  onButtonClick,

  buttonColor = "white",
  buttonSize = "twoxl",
  buttonWidth = "g240",

  customButton,
  className,
}: ReserveStartProps) {
  return (
    <section
      className={cn(
        "relative flex w-full min-h-67 overflow-hidden rounded-2xl",
        className,
      )}
    >
      <Image src={backgroundImage} alt="" fill priority={false} sizes="10vw" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,61,46,0.92) 0%, rgba(40,163,123,0.88) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-67 w-full flex-col-reverse items-center justify-between gap-6 p-5 sm:gap-8 sm:p-6 md:flex-row md:px-10 md:py-4">
        <div className="flex w-full max-w-md flex-col items-center gap-5 text-center md:max-w-105 md:items-start md:text-right">
          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
              {title}
            </h2>

            {description ? (
              <p className="whitespace-pre-line text-sm leading-7 text-white/90 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {customButton ?? (
            <Button
              color={buttonColor}
              size={buttonSize}
              width={buttonWidth}
              radius="md"
              border="none"
              onClick={onButtonClick}
              className="transition-all duration-300 ease-out"
            >
              {buttonText}
            </Button>
          )}
        </div>

        <div className="relative h-36 w-36 shrink-0 sm:h-44 sm:w-44 md:h-60 md:w-60 lg:h-70.5 lg:w-70.5">
          <Image
            src={sideImage}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 768px) 160px, 282px"
          />
        </div>
      </div>
    </section>
  );
}
