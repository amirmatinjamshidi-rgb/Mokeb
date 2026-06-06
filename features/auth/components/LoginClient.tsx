"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/features/shared/ui/button";
import { ROUTES } from "@/features/shared/config/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const schema = z.object({
  phone: z
    .string()
    .min(1, "شماره موبایل را وارد کنید")
    .refine(
      (v) => /^09\d{9}$/.test(v.replace(/\s/g, "")),
      "شماره باید با ۰۹ شروع و ۱۱ رقم باشد",
    ),
  password: z.string().min(4, "رمز عبور حداقل ۴ نویسه"),
});

type FormValues = z.infer<typeof schema>;

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const [authError, setAuthError] = useState<string | null>(null);

  const returnUrl = searchParams.get("returnUrl") ?? ROUTES.userPanel;
  const safeReturn =
    returnUrl.startsWith("/") && !returnUrl.startsWith("//")
      ? returnUrl
      : ROUTES.userPanel;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: "", password: "" },
  });

  useEffect(() => {
    if (user) router.replace(safeReturn);
  }, [user, router, safeReturn]);

  const onSubmit = (data: FormValues) => {
    setAuthError(null);
    const ok = login(data.phone.replace(/\s/g, ""), data.password);
    if (!ok) {
      setAuthError("شماره موبایل یا رمز عبور معتبر نیست.");
      return;
    }
    router.replace(safeReturn);
    router.refresh();
  };

  return (
    <div
      className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col justify-center px-4 py-12"
      dir="rtl"
    >
      <div className="mb-8 text-center">
        <Link href={ROUTES.home} className="inline-block">
          <Image
            src="/Logo.png"
            alt="موکب"
            width={56}
            height={56}
            className="mx-auto object-contain"
          />
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-[#175E47]">
          ورود به حساب کاربری
        </h1>
        <p className="mt-2 text-sm text-[#61756F]">
          برای نمایش پنل، شماره موبایل ایرانی (۰۹… ) و رمز حداقل ۴ نویسه وارد
          کنید.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        {authError ? (
          <Alert severity="error" onClose={() => setAuthError(null)}>
            {authError}
          </Alert>
        ) : null}

        <TextField
          {...register("phone")}
          label="شماره موبایل"
          placeholder="09123456789"
          fullWidth
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
          slotProps={{ inputLabel: { shrink: true } }}
          dir="ltr"
        />
        <TextField
          {...register("password")}
          label="رمز عبور"
          type="password"
          autoComplete="current-password"
          fullWidth
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Button
          type="submit"
          color="darkGreen"
          size="xl"
          width="auto"
          className="w-full!"
          disabled={isSubmitting}
        >
          ورود
        </Button>

        <p className="text-center text-sm text-[#61756F]">
          <Link
            href={ROUTES.home}
            className="font-medium text-[#175E47] hover:underline"
          >
            بازگشت به خانه
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[50dvh] items-center justify-center"
          dir="rtl"
        >
          <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}
