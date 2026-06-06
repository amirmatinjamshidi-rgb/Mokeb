import { CircleCheck } from "lucide-react";
import { cn } from "@/features/shared/lib/utils";

type Props = {
  show: boolean;
  className?: string;
};

export function InputValidTick({ show, className }: Props) {
  if (!show) return null;

  return (
    <CircleCheck
      stroke="green"
      className={cn("h-5 w-5 shrink-0  text-white", className)}
      aria-hidden
    />
  );
}
