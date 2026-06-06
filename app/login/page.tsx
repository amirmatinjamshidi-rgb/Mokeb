import LoginClient from "@/features/auth/components/LoginClient";

export const metadata = {
  title: "ورود | موکب",
};

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-[#F5F9F6]">
      <LoginClient />
    </div>
  );
}
