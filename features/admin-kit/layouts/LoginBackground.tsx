import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

export default function LoginBackground({ children }: Props) {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center p-4" dir="rtl">
      <Image
        src="/Loginbg.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[rgba(92,147,125,0.82)]" aria-hidden />
      <div className="relative z-10 w-full max-w-[384px]">{children}</div>
    </div>
  );
}
