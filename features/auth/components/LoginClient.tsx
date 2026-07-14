"use client";



import { Suspense, useEffect, useState } from "react";

import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";

import { AlertCircle, ShieldUser, User, UserRound, Users } from "lucide-react";

import { useShallow } from "zustand/react/shallow";



import Button from "@/features/shared/ui/button";

import { ROUTES } from "@/features/shared/config/navigation";

import { useAuthStore, useIsAuthenticated } from "@/features/auth/store/useAuthStore";

import { IconLabelInput } from "@/features/shared/ui/IconLabelInput";

import { cn } from "@/features/shared/lib/utils";

import {

  BOSS_KARVAN_MANAGEMENT_PATH,

  CARAVAN_BOSS_REGISTER,

  isCaravanBossSession,

  isIndividualUserSession,

} from "@/features/auth/lib/panelRouting";

import {

  caravanRepresentativeSchema,

  isValidIranNationalId,

  loginCredentialsSchema,

  type CaravanRepresentativeValues,

  type LoginCredentialsValues,

} from "@/features/auth/schemas/loginSchemas";

import { caravanApi } from "@/lib/api";

import { ApiError } from "@/lib/api/client";



type Flow = "normal" | "caravan";

type Step = "login" | "representative";



function LoginFormInner() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const login = useAuthStore((s) => s.login);

  const updateProfile = useAuthStore((s) => s.updateProfile);

  const clearSessionLocal = useAuthStore((s) => s.clearSessionLocal);

  const logout = useAuthStore((s) => s.logout);

  const isLoggedIn = useIsAuthenticated();

  const { user, token, principalType } = useAuthStore(

    useShallow((s) => ({

      user: s.user,

      token: s.token,

      principalType: s.principalType,

    })),

  );



  const [flow, setFlow] = useState<Flow>("normal");

  const [step, setStep] = useState<Step>("login");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);

  const [registeredNotice, setRegisteredNotice] = useState(false);



  const registerKind = searchParams.get("register");

  const isCaravanLogin =

    registerKind === CARAVAN_BOSS_REGISTER ||

    registerKind === "caravan-rep" ||

    flow === "caravan";

  const defaultReturn = isCaravanLogin

    ? BOSS_KARVAN_MANAGEMENT_PATH

    : ROUTES.userProfile;

  const returnUrl = searchParams.get("returnUrl") ?? defaultReturn;

  const safeReturn =

    returnUrl.startsWith("/") && !returnUrl.startsWith("//")

      ? returnUrl

      : defaultReturn;



  const sessionSnapshot = { user, token, principalType };

  const hasIndividualSession = isIndividualUserSession(sessionSnapshot);

  const hasBossSession = isCaravanBossSession(sessionSnapshot);

  const panelContinueHref = hasBossSession

    ? BOSS_KARVAN_MANAGEMENT_PATH

    : ROUTES.userProfile;



  useEffect(() => {

    const reg = searchParams.get("register");

    if (reg === "caravan-rep" || reg === CARAVAN_BOSS_REGISTER) {

      setFlow("caravan");

    }

    if (searchParams.get("registered") === "1") {

      setRegisteredNotice(true);

    }

  }, [searchParams]);



  const loginForm = useForm<LoginCredentialsValues>({

    resolver: zodResolver(loginCredentialsSchema),

    defaultValues: { username: "", password: "" },

  });



  const repForm = useForm<CaravanRepresentativeValues>({

    resolver: zodResolver(caravanRepresentativeSchema),

    defaultValues: { fullName: "", nationalCode: "", caravanName: "" },

  });



  useEffect(() => {

    const wantFresh =

      searchParams.get("fresh") === "1" || searchParams.get("logout") === "1";

    if (!wantFresh) return;

    clearSessionLocal();

    setFlow("normal");

    setStep("login");

    setAuthError(null);

    loginForm.reset({ username: "", password: "" });

    repForm.reset({ fullName: "", nationalCode: "", caravanName: "" });

    router.replace("/login", { scroll: false });

  }, [searchParams, router, clearSessionLocal, loginForm, repForm]);



  const onLoginSubmit = async (data: LoginCredentialsValues) => {

    setAuthError(null);



    if (flow === "caravan" && hasIndividualSession) {

      setAuthError(

        "با حساب کاربری وارد هستید. ابتدا از پنل کاربر خارج شوید، سپس وارد پنل مدیر کاروان شوید.",

      );

      return;

    }

    if (flow === "normal" && hasBossSession) {

      setAuthError(

        "با حساب مدیر کاروان وارد هستید. ابتدا خارج شوید، سپس با حساب کاربری وارد شوید.",

      );

      return;

    }



    setIsSubmitting(true);

    const principalTypeForLogin = flow === "caravan" ? "caravan" : "individual";

    const result = await login(

      data.username,

      data.password,

      principalTypeForLogin,

    );

    setIsSubmitting(false);



    if (!result.ok) {

      setAuthError(result.error ?? "نام کاربری یا رمز عبور نامعتبر است.");

      return;

    }



    if (flow === "caravan") {

      setStep("representative");

      repForm.reset({ fullName: "", nationalCode: "", caravanName: "" });

      return;

    }



    router.replace(safeReturn);

    router.refresh();

  };



  const onRepSubmit = async (data: CaravanRepresentativeValues) => {

    setAuthError(null);

    setIsSubmitting(true);



    const principalId = useAuthStore.getState().principalId;

    if (!principalId) {

      setIsSubmitting(false);

      setAuthError("نشست کاروان یافت نشد. دوباره وارد شوید.");

      return;

    }



    const parts = data.fullName.trim().split(/\s+/).filter(Boolean);

    const name = parts[0] ?? "";

    const familyName = parts.slice(1).join(" ") || name;



    try {

      await caravanApi.changeCaravanPrincipal(principalId, {

        caravanId: principalId,

        name,

        familyName,

        nationalCode: data.nationalCode.replace(/\s/g, ""),

      });

      updateProfile({

        name: data.fullName.trim(),

        caravanName: data.caravanName.trim(),

      });

      router.replace(safeReturn);

      router.refresh();

    } catch (err) {

      const message =

        err instanceof ApiError

          ? err.message

          : err instanceof Error

            ? err.message

            : "ذخیره اطلاعات نماینده ناموفق بود.";

      setAuthError(message);

    } finally {

      setIsSubmitting(false);

    }

  };



  const exitSessionAndRestart = async () => {

    setIsSubmitting(true);

    try {

      await logout();

    } catch {

      clearSessionLocal();

    } finally {

      setIsSubmitting(false);

      setFlow("normal");

      setStep("login");

      setAuthError(null);

      loginForm.reset({ username: "", password: "" });

      repForm.reset({ fullName: "", nationalCode: "", caravanName: "" });

      router.replace(ROUTES.home);

      router.refresh();

    }

  };



  const heading =

    flow === "caravan" ? "ورود مدیر کاروان" : "ورود";



  return (

    <div

      className="mx-auto flex min-h-dvh w-full max-w-[calc(100%-2rem)] flex-col items-center justify-center px-4 py-10"

      dir="rtl"

    >

      {isLoggedIn && step === "login" ? (

        <div className="mb-4 flex w-full max-w-[384px] flex-col gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/95 p-4 text-sm text-[#586A64] shadow-sm">

          <p className="font-medium text-[#92400E]">

            با این مرورگر قبلاً وارد شده‌اید.

            {hasIndividualSession && flow === "caravan"

              ? " برای ورود به پنل مدیر کاروان ابتدا خارج شوید."

              : null}

            {hasBossSession && flow === "normal"

              ? " برای ورود به پنل کاربر ابتدا خارج شوید."

              : null}

          </p>

          <div className="flex flex-wrap gap-2">

            <Link

              href={panelContinueHref}

              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#175E47] px-4 text-sm font-semibold text-white hover:bg-[#1F7E5F]"

            >

              ادامه به پنل

            </Link>

            <button

              type="button"

              onClick={() => void exitSessionAndRestart()}

              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#92400E] bg-white px-4 text-sm font-semibold text-[#92400E] hover:bg-amber-100"

              disabled={isSubmitting}

            >

              خروج و بازگشت به خانه

            </button>

          </div>

        </div>

      ) : null}



      <div

        className={cn(

          "flex w-[384px] max-w-full flex-col gap-8 rounded-2xl bg-white p-8 shadow-sm",

          step === "representative" ? "min-h-min" : "min-h-[404px]",

        )}

      >

        {step === "login" ? (

          <>

            <div className="flex flex-col gap-2">

              <h1 className="text-xl font-semibold text-[#586A64]">{heading}</h1>

              <p className="text-sm leading-6 text-[#6B8079]">

                نام کاربری و رمز عبور خود را وارد کنید.

              </p>

              {registeredNotice ? (

                <p className="rounded-xl border border-[#279F78]/30 bg-[#F0F7F4] px-3 py-2 text-sm text-[#175E47]">

                  ثبت‌نام با موفقیت انجام شد. حالا وارد شوید.

                </p>

              ) : null}

              <Link

                href="/login/fresh"

                className="text-xs font-medium text-[#175E47] hover:underline"

              >

                ورود با حساب دیگر (پاک کردن نشست)

              </Link>

            </div>



            <form

              className="flex flex-col gap-6"

              onSubmit={loginForm.handleSubmit(onLoginSubmit)}

            >

              <Controller

                name="username"

                control={loginForm.control}

                render={({ field, fieldState }) => (

                  <IconLabelInput

                    {...field}

                    autoComplete="username"

                    placeholder="نام کاربری"

                    icon={<User className="size-5 shrink-0" aria-hidden />}

                    isValid={

                      (fieldState.isDirty || fieldState.isTouched) &&

                      !fieldState.error &&

                      field.value.trim().length > 0

                    }

                    aria-invalid={Boolean(fieldState.error)}

                  />

                )}

              />

              {loginForm.formState.errors.username ? (

                <p className="-mt-4 text-right text-xs text-[#D22B23]">

                  {loginForm.formState.errors.username.message}

                </p>

              ) : null}



              <Controller

                name="password"

                control={loginForm.control}

                render={({ field, fieldState }) => (

                  <IconLabelInput

                    {...field}

                    type="password"

                    autoComplete="current-password"

                    placeholder="رمز عبور"

                    icon={<ShieldUser className="size-5 shrink-0" aria-hidden />}

                    isValid={

                      (fieldState.isDirty || fieldState.isTouched) &&

                      !fieldState.error &&

                      field.value.length >= 4

                    }

                    aria-invalid={Boolean(fieldState.error)}

                  />

                )}

              />

              {loginForm.formState.errors.password ? (

                <p className="-mt-4 text-right text-xs text-[#D22B23]">

                  {loginForm.formState.errors.password.message}

                </p>

              ) : null}



              <span className="flex items-start gap-2 text-xs leading-5 text-[#6B8079]">

                <AlertCircle

                  className="mt-0.5 size-4 shrink-0 text-[#6B8079]"

                  aria-hidden

                />

                ثبت نام در هییت، به معنی پذیرش قوانین و مقررات این سرویس است.

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

                className="h-14 w-[320px] max-w-full self-center font-semibold"

                disabled={isSubmitting}

              >

                {isSubmitting ? "در حال ورود…" : "ورود"}

              </Button>



              <div className="flex w-full flex-col gap-2 text-sm">

                {flow === "normal" ? (

                  <p className="flex w-full justify-start text-[#279F78]">

                    <Link

                      href={`${ROUTES.login}?register=${CARAVAN_BOSS_REGISTER}`}

                      className="font-semibold text-[#175E47] hover:underline"

                      onClick={() => setFlow("caravan")}

                    >

                      ورود مدیر کاروان

                    </Link>

                  </p>

                ) : (

                  <button

                    type="button"

                    className="flex w-full justify-start font-semibold text-[#175E47] hover:underline"

                    onClick={() => {

                      setFlow("normal");

                      loginForm.clearErrors();

                    }}

                  >

                    ورود کاربر عادی

                  </button>

                )}

                <p className="flex w-full justify-start text-[#279F78]">

                  <Link

                    href={

                      flow === "caravan"

                        ? `${ROUTES.signIn}?type=caravan`

                        : ROUTES.signIn

                    }

                    className="font-semibold text-[#175E47] hover:underline"

                  >

                    حساب ندارید؟ ثبت‌نام

                  </Link>

                </p>

              </div>

            </form>

          </>

        ) : null}



        {step === "representative" ? (

          <>

            <div className="flex flex-col gap-2">

              <h1 className="text-xl font-semibold text-[#586A64]">

                تکمیل اطلاعات نماینده کاروان

              </h1>

              <p className="text-sm leading-6 text-[#6B8079]">

                لطفا اطلاعات نماینده را به درستی وارد کنید.

              </p>

            </div>



            <form

              className="flex flex-col gap-8"

              onSubmit={repForm.handleSubmit(onRepSubmit)}

            >

              <div className="flex flex-col gap-4">

                <Controller

                  name="fullName"

                  control={repForm.control}

                  render={({ field, fieldState }) => (

                    <IconLabelInput

                      {...field}

                      placeholder="نام و نام خانوادگی"

                      icon={<UserRound className="size-5" aria-hidden />}

                      isValid={

                        (fieldState.isDirty || fieldState.isTouched) &&

                        !fieldState.error &&

                        String(field.value).trim().length >= 3

                      }

                    />

                  )}

                />

                {repForm.formState.errors.fullName ? (

                  <p className="-mt-2 text-right text-xs text-[#D22B23]">

                    {repForm.formState.errors.fullName.message}

                  </p>

                ) : null}



                <Controller

                  name="nationalCode"

                  control={repForm.control}

                  render={({ field, fieldState }) => {

                    const raw = String(field.value).replace(/\s/g, "");

                    const digitsOk =

                      /^\d{10}$/.test(raw) && isValidIranNationalId(raw);

                    return (

                      <IconLabelInput

                        {...field}

                        type="text"

                        inputMode="numeric"

                        placeholder="کد ملی"

                        dir="ltr"

                        className="text-left"

                        inputClassName="text-left"

                        icon={<ShieldUser className="size-5" aria-hidden />}

                        isValid={

                          (fieldState.isDirty || fieldState.isTouched) &&

                          !fieldState.error &&

                          digitsOk

                        }

                      />

                    );

                  }}

                />

                {repForm.formState.errors.nationalCode ? (

                  <p className="-mt-2 text-right text-xs text-[#D22B23]">

                    {repForm.formState.errors.nationalCode.message}

                  </p>

                ) : null}



                <Controller

                  name="caravanName"

                  control={repForm.control}

                  render={({ field, fieldState }) => (

                    <IconLabelInput

                      {...field}

                      placeholder="نام کاروان"

                      icon={<Users className="size-5" aria-hidden />}

                      isValid={

                        (fieldState.isDirty || fieldState.isTouched) &&

                        !fieldState.error &&

                        String(field.value).trim().length >= 2

                      }

                    />

                  )}

                />

                {repForm.formState.errors.caravanName ? (

                  <p className="-mt-2 text-right text-xs text-[#D22B23]">

                    {repForm.formState.errors.caravanName.message}

                  </p>

                ) : null}

              </div>



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

                className="h-14 w-[320px] max-w-full self-center font-semibold"

                disabled={isSubmitting}

              >

                {isSubmitting ? "در حال ذخیره…" : "تکمیل ثبت نام"}

              </Button>

            </form>

          </>

        ) : null}



        <p className="text-center text-xs text-[#6B8079]">

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



export default function LoginClient() {

  return (

    <Suspense

      fallback={

        <div className="flex min-h-[50dvh] items-center justify-center" dir="rtl">

          <p className="text-sm text-[#61756F]">در حال بارگذاری…</p>

        </div>

      }

    >

      <LoginFormInner />

    </Suspense>

  );

}


