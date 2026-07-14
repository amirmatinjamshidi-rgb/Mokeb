import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { UserSquare } from "iconsax-reactjs";

export function createIconsaxLucideIcon(
  Icon: ComponentType<{
    className?: string;
    variant?: "Outline";
    color?: string;
    size?: string | number;
  }>,
): LucideIcon {
  const Wrapped = ({ className }: { className?: string }) => (
    <Icon variant="Outline" className={className} color="currentColor" size={20} />
  );
  return Wrapped as LucideIcon;
}

export const UserSquareIcon = createIconsaxLucideIcon(UserSquare);
