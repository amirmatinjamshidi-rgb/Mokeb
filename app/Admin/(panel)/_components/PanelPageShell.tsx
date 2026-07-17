import type { ReactNode } from "react";

import { cn } from "@admin-kit/shared/lib/utils";

type Props = {
  title: string;
  icon?: ReactNode;
  children?: ReactNode;
  underCarousel?: boolean;
  className?: string;
};

export function PanelPageShell({
  title,
  icon,
  children,
  underCarousel = false,
  className,
}: Props) {
  return (
    <section
      dir="rtl"
      className={cn(
        "flex w-full flex-col",
        underCarousel ? "gap-8 px-0 pt-2 pb-0" : "gap-10 px-4 pt-8 pb-8 sm:px-6 sm:pt-10 sm:pb-10",
        className,
      )}
    >
      <h2  className="flex items-center gap-3 text-2xl font-bold leading-9 text-gray-500 sm:text-[1.75rem] sm:leading-10">
        {icon}
        <span>{title}</span>
      </h2>

      {children ? (
        <div className="flex w-full flex-col gap-10 sm:gap-12">{children}</div>
      ) : null}
    </section>
  );
}

export const panelPageIconClass = "size-7 shrink-0 stroke-gray sm:size-8";
