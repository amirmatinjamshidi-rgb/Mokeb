"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  AlertCircle,
  Mail,
  Phone,
  ShieldUser,
  User,
  UserRound,
  Users,
} from "lucide-react";

import Button from "@/features/shared/ui/button";
import { ROUTES } from "@/features/shared/config/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { IconLabelInput } from "@/features/shared/ui/IconLabelInput";
import { BloodTypeSelect } from "@/features/shared/ui/BloodTypeSelect";
import { PersianDateField } from "@/features/shared/ui/PersianDateField";
import { cn } from "@/features/shared/lib/utils";
import {
  CARAVAN_BOSS_REGISTER,
} from "@/features/auth/lib/panelRouting";
import {
  signInCredentialsDefaults,
  signInCredentialsSchema,
  signInProfileDefaults,
  signInProfileSchema,
  type SignInAccountType,
  type SignInCredentialsValues,
  type SignInProfileValues,
} from "@/features/auth/schemas/signInSchemas";
import { isValidIranNationalId } from "@/features/auth/schemas/loginSchemas";

type Step = "credentials" | "profile";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="-mt-2 text-right text-xs text-[#D22B23]">{message}</p>;
}

function SignInFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signUp = useAuthStore((s) => s.signUp);

  const [step, setStep] = useState<Step>("credentials");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [credentials, setCredentials] =
    useState<SignInCredentialsValues | null>(null);

  const initialType: SignInAccountType =
    searchParams.get("type") === "caravan" ||
    searchParams.get("register") === CARAVAN_BOSS_REGISTER
      ? "caravan"
      : "individual";

  const credentialsForm = useForm<SignInCredentialsValues>({
    resolver: zodResolver(signInCredentialsSchema),
    defaultValues: {
      ...signInCredentialsDefaults,
      accountType: initialType,
    },
  });

  const profileForm = useForm<SignInProfileValues>({
    resolver: zodResolver(signInProfileSchema),
    defaultValues: signInProfileDefaults,
  });

  useEffect(() => {
    credentialsForm.setValue("accountType", initialType);
  }, [initialType, credentialsForm]);

  const accountType = credentialsForm.watch("accountType");

  const onCredentialsSubmit = (data: SignInCredentialsValues) => {
    setAuthError(null);
    setCredentials(data);
    setStep("profile");
  };

  const onProfileSubmit = async (data: SignInProfileValues) => {
    if (!credentials) {
      setStep("credentials");
      return;
    }
    setAuthError(null);
    setIsSubmitting(true);

    const result = await signUp({
      type: credentials.accountType,
      username: credentials.username,
      password: credentials.password,
      name: data.name,
      familyName: data.familyName,
      nationalCode: data.nationalCode.replace(/\s/g, ""),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      passportNumber: data.passportNumber,
      gmail: data.gmail.trim(),
      phoneNumber: data.phoneNumber,
      emergencyPhoneNumber: data.emergencyPhoneNumber,
      bloodType: data.bloodType,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setAuthError(result.error ?? "ثبت‌نام ناموفق بود.");
      return;
    }

    const loginQs = new URLSearchParams();
    loginQs.set("registered", "1");
    if (credentials.accountType === "caravan") {
      loginQs.set("register", CARAVAN_BOSS_REGISTER);
    }
    router.replace(`${ROUTES.login}?${loginQs.toString()}`);
  };

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[calc(100%-2rem)] flex-col items-center justify-center px-4 py-10"
      dir="rtl"
    >
      <div className="flex w-[420px] max-w-full flex-col gap-8 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold text-[#586A64]">
              {step === "credentials" ? "ثبت‌نام" : "تکمیل اطلاعات"}
            </h1>
            <span className="rounded-lg bg-[#F0F7F4] px-2.5 py-1 text-xs font-medium text-[#175E47]">
              مرحله {step === "credentials" ? "۱" : "۲"} از ۲
            </span>
          </div>
          <p className="text-sm leading-6 text-[#6B8079]">
            {step === "credentials"
              ? "ابتدا نوع حساب و اطلاعات ورود را وارد کنید."
              : accountType === "caravan"
                ? "اطلاعات نماینده کاروان را کامل کنید، سپس وارد شوید."
                : "اطلاعات شخصی خود را کامل کنید، سپس وارد شوید."}
          </p>
        </div>

        {step === "credentials" ? (
          <form
            className="flex flex-col gap-5"
            onSubmit={credentialsForm.handleSubmit(onCredentialsSubmit)}
          >
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "individual" as const, label: "کاربر عادی", icon: User },
                  { id: "caravan" as const, label: "مدیر کاروان", icon: Users },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const selected = accountType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      credentialsForm.setValue("accountType", id, {
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition",
                      selected
                        ? "border-[#175E47] bg-[#175E47] text-white"
                        : "border-[#E5E7EB] bg-white text-[#586A64] hover:border-[#175E47]/40",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>

            <Controller
              name="username"
              control={credentialsForm.control}
              render={({ field, fieldState }) => (
                <IconLabelInput
                  {...field}
                  autoComplete="username"
                  placeholder="نام کاربری"
                  icon={<User className="size-5 shrink-0" aria-hidden />}
                  isValid={
                    (fieldState.isDirty || fieldState.isTouched) &&
                    !fieldState.error &&
                    field.value.trim().length >= 3
                  }
                  aria-invalid={Boolean(fieldState.error)}
                />
              )}
            />
            <FieldError
              message={credentialsForm.formState.errors.username?.message}
            />

            <Controller
              name="password"
              control={credentialsForm.control}
              render={({ field, fieldState }) => (
                <IconLabelInput
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="رمز عبور"
                  icon={<ShieldUser className="size-5 shrink-0" aria-hidden />}
                  isValid={
                    (fieldState.isDirty || fieldState.isTouched) &&
                    !fieldState.error &&
                    field.value.length >= 6
                  }
                  aria-invalid={Boolean(fieldState.error)}
                />
              )}
            />
            <FieldError
              message={credentialsForm.formState.errors.password?.message}
            />

            <Controller
              name="confirmPassword"
              control={credentialsForm.control}
              render={({ field, fieldState }) => (
                <IconLabelInput
                  {...field}
                  type="password"
                  autoComplete="new-password"
                  placeholder="تکرار رمز عبور"
                  icon={<ShieldUser className="size-5 shrink-0" aria-hidden />}
                  isValid={
                    (fieldState.isDirty || fieldState.isTouched) &&
                    !fieldState.error &&
                    field.value.length >= 6
                  }
                  aria-invalid={Boolean(fieldState.error)}
                />
              )}
            />
            <FieldError
              message={
                credentialsForm.formState.errors.confirmPassword?.message
              }
            />

            <span className="flex items-start gap-2 text-xs leading-5 text-[#6B8079]">
              <AlertCircle
                className="mt-0.5 size-4 shrink-0 text-[#6B8079]"
                aria-hidden
              />
              رمز عبور باید حرف بزرگ انگلیسی و علامت @ داشته باشد.
            </span>

            {authError ? (
              <p className="text-right text-sm text-[#D22B23]">{authError}</p>
            ) : null}

            <Button
              type="submit"
              color="darkGreen"
              text="white"
              size="twoxl"
              radius="md"
              border="none"
              className="h-14 w-full max-w-full self-center font-semibold"
            >
              ادامه و تکمیل اطلاعات
            </Button>
          </form>
        ) : null}

        {step === "profile" ? (
          <form
            className="flex flex-col gap-5"
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Controller
                  name="name"
                  control={profileForm.control}
                  render={({ field, fieldState }) => (
                    <IconLabelInput
                      {...field}
                      placeholder="نام"
                      icon={<UserRound className="size-5" aria-hidden />}
                      isValid={
                        (fieldState.isDirty || fieldState.isTouched) &&
                        !fieldState.error &&
                        field.value.trim().length >= 2
                      }
                    />
                  )}
                />
                <FieldError
                  message={profileForm.formState.errors.name?.message}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Controller
                  name="familyName"
                  control={profileForm.control}
                  render={({ field, fieldState }) => (
                    <IconLabelInput
                      {...field}
                      placeholder="نام خانوادگی"
                      icon={<UserRound className="size-5" aria-hidden />}
                      isValid={
                        (fieldState.isDirty || fieldState.isTouched) &&
                        !fieldState.error &&
                        field.value.trim().length >= 2
                      }
                    />
                  )}
                />
                <FieldError
                  message={profileForm.formState.errors.familyName?.message}
                />
              </div>
            </div>

            <Controller
              name="nationalCode"
              control={profileForm.control}
              render={({ field, fieldState }) => {
                const raw = String(field.value).replace(/\s/g, "");
                const ok =
                  /^\d{10}$/.test(raw) && isValidIranNationalId(raw);
                return (
                  <IconLabelInput
                    {...field}
                    inputMode="numeric"
                    placeholder="کد ملی"
                    dir="ltr"
                    className="text-left"
                    inputClassName="text-left"
                    icon={<ShieldUser className="size-5" aria-hidden />}
                    isValid={
                      (fieldState.isDirty || fieldState.isTouched) &&
                      !fieldState.error &&
                      ok
                    }
                  />
                );
              }}
            />
            <FieldError
              message={profileForm.formState.errors.nationalCode?.message}
            />

            <Controller
              name="dateOfBirth"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <PersianDateField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تاریخ تولد"
                  error={fieldState.error?.message}
                  outputFormat="iso"
                />
              )}
            />
            <FieldError
              message={profileForm.formState.errors.dateOfBirth?.message}
            />

            <Controller
              name="gender"
              control={profileForm.control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "male" as const, label: "مرد" },
                      { id: "female" as const, label: "زن" },
                    ] as const
                  ).map(({ id, label }) => {
                    const selected = field.value === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => field.onChange(id)}
                        className={cn(
                          "flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition",
                          selected
                            ? "border-[#175E47] bg-[#F0F7F4] text-[#175E47]"
                            : "border-[#E5E7EB] bg-white text-[#586A64]",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <FieldError
              message={profileForm.formState.errors.gender?.message}
            />

            <Controller
              name="passportNumber"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <IconLabelInput
                  {...field}
                  placeholder="شماره پاسپورت"
                  dir="ltr"
                  inputClassName="text-left"
                  icon={<ShieldUser className="size-5" aria-hidden />}
                  isValid={
                    (fieldState.isDirty || fieldState.isTouched) &&
                    !fieldState.error &&
                    field.value.trim().length > 0
                  }
                />
              )}
            />
            <FieldError
              message={profileForm.formState.errors.passportNumber?.message}
            />

            <Controller
              name="gmail"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <IconLabelInput
                  {...field}
                  type="email"
                  placeholder="ایمیل"
                  dir="ltr"
                  inputClassName="text-left"
                  icon={<Mail className="size-5" aria-hidden />}
                  isValid={
                    (fieldState.isDirty || fieldState.isTouched) &&
                    !fieldState.error &&
                    Boolean(field.value?.includes("@"))
                  }
                />
              )}
            />
            <FieldError
              message={profileForm.formState.errors.gmail?.message}
            />

            <Controller
              name="phoneNumber"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <IconLabelInput
                  {...field}
                  inputMode="tel"
                  placeholder="شماره موبایل"
                  dir="ltr"
                  inputClassName="text-left"
                  icon={<Phone className="size-5" aria-hidden />}
                  isValid={
                    (fieldState.isDirty || fieldState.isTouched) &&
                    !fieldState.error &&
                    /^09\d{9}$/.test(field.value)
                  }
                />
              )}
            />
            <FieldError
              message={profileForm.formState.errors.phoneNumber?.message}
            />

            <Controller
              name="emergencyPhoneNumber"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <IconLabelInput
                  {...field}
                  inputMode="tel"
                  placeholder="شماره اضطراری"
                  dir="ltr"
                  inputClassName="text-left"
                  icon={<Phone className="size-5" aria-hidden />}
                  isValid={
                    (fieldState.isDirty || fieldState.isTouched) &&
                    !fieldState.error &&
                    /^09\d{9}$/.test(field.value)
                  }
                />
              )}
            />
            <FieldError
              message={
                profileForm.formState.errors.emergencyPhoneNumber?.message
              }
            />

            <Controller
              name="bloodType"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <BloodTypeSelect
                  {...field}
                  error={!!fieldState.error}
                />
              )}
            />
            <FieldError
              message={profileForm.formState.errors.bloodType?.message}
            />

            {authError ? (
              <p className="text-right text-sm text-[#D22B23]">{authError}</p>
            ) : null}

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                color="darkGreen"
                text="white"
                size="twoxl"
                radius="md"
                border="none"
                className="h-14 w-full max-w-full self-center font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال ثبت‌نام…" : "ثبت‌نام و رفتن به ورود"}
              </Button>
              <button
                type="button"
                className="text-sm font-semibold text-[#175E47] hover:underline"
                onClick={() => {
                  setAuthError(null);
                  setStep("credentials");
                }}
                disabled={isSubmitting}
              >
                بازگشت به مرحله قبل
              </button>
            </div>
          </form>
        ) : null}

        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-[#6B8079]">
          <Link
            href={
              accountType === "caravan"
                ? `${ROUTES.login}?register=${CARAVAN_BOSS_REGISTER}`
                : ROUTES.login
            }
            className="font-medium text-[#175E47] hover:underline"
          >
            حساب دارید؟ ورود
          </Link>
          <span aria-hidden>·</span>
          <Link
            href={ROUTES.home}
            className="font-medium text-[#175E47] hover:underline"
          >
            بازگشت به خانه
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50dvh] items-center justify-center" dir="rtl">
          <p className="text-sm text-[#61756F]">در حال بارگذاری…</p>
        </div>
      }
    >
      <SignInFormInner />
    </Suspense>
  );
}
