import { memo } from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/boss-features/lib/utils";

type Props = {
  show: boolean;
  className?: string;
};

function InputValidTickInner({ show, className }: Props) {
  if (!show) return null;

  return (
    <CircleCheck
      stroke="#175E47"
      className={cn("h-5 w-5 shrink-0 text-[#175E47]", className)}
      aria-hidden
    />
  );
}

export const InputValidTick = memo(InputValidTickInner);
