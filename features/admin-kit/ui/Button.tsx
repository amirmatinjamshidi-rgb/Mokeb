"use client";
import { cn } from "../shared/lib/utils";

const buttonstyles = {
  darkGreen: "bg-[#175E47] hover:bg-[#1F7E5F] text-white border-transparent",
  lightGreen: "bg-[#279F78] hover:bg-[#1F7E5F] text-white border-transparent",
  warning: "bg-[#D8B648] hover:bg-[#BA9828] text-[#2D2D2D] border-transparent",
  LightWarning:
    "bg-[#DFC369] hover:bg-[#BA9828] text-[#2D2D2D] border-transparent",
  white: "bg-white text-[#175E47] border-transparent",
  gray: "bg-[#ACB9B5] text-white border-transparent",
} as const;
const textColor = {
  white: "!text-[#FFFFFF]",
  darkGreen: "!text-[#175E47]",
  blue: "!text-cyan-700",
  orange: "!text-orange-300",
  gray: "!text-gray-400",
  none: "!text-inherit",
} as const;
const RoundedVariants = {
  none: "rounded-xl",
  md: "rounded-2xl",
  lg: "rounded-3xl",
} as const;

const borderColors = {
  none: "border-2 border-transparent",
  green: "border-2 border-[#175E47]",
  gray: "border-2 border-gray-200",
  orange: "border-2 border-orange-300",
} as const;

const sizeVariants = {
  xs: "h-[32px]",
  sm: "h-[36px]",
  md: "h-[40px]",
  lg: "h-[44px]",
  xl: "h-[48px]",
  twoxl: "h-[56px]",
} as const;

const widthVariants = {
  sm: "w-[112px]",
  md: "w-[132px]",
  lg: "w-[148px]",
  xl: "w-[172px]",
  auto: "w-auto",
} as const;

type ButtonColor = keyof typeof buttonstyles;
type ButtonRadius = keyof typeof RoundedVariants;
type ButtonBorder = keyof typeof borderColors;
type ButtonSize = keyof typeof sizeVariants;
type ButtonWidth = keyof typeof widthVariants;
type TextColor = keyof typeof textColor;
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  radius?: ButtonRadius;
  border?: ButtonBorder;
  size?: ButtonSize;
  width?: ButtonWidth;
  text?: TextColor;
}

export default function Button({
  color = "darkGreen",
  radius = "md",
  border = "none",
  size = "md",
  width = "auto",
  text = "none",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "font-semibold transition-all inline-flex items-center justify-center border cursor-pointer",
        buttonstyles[color],
        sizeVariants[size],
        widthVariants[width],
        RoundedVariants[radius],
        borderColors[border],
        textColor[text],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
