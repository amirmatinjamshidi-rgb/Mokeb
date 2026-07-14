import SignInClient from "@/features/auth/components/SignInClient";

export const metadata = {
  title: "ثبت‌نام | موکب",
};

export default function SignInPage() {
  return (
    <div className="min-h-dvh bg-[#F5F9F6]">
      <SignInClient />
    </div>
  );
}
