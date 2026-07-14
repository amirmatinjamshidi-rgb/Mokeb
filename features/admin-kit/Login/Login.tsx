"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {  ShieldUser, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ROUTES } from "@admin-kit/navigation/routes";
import { useAuthStore } from "@admin-kit/shared/store/authStore";
import Button from "@admin-kit/ui/Button";
import FormTextInput from "@admin-kit/ui/FormTextInput";

const loginSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const loginDefaultValues: LoginFormValues = {
  username: "",
  password: "",
};

type Props = {
  className?: string;
  disabled?: boolean;
};

export default function Login({ className, disabled = false }: Props) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formDisabled = disabled || isSubmitting;

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const result = await login(values.username, values.password);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "نام کاربری یا رمز عبور نامعتبر است.");
      return;
    }
    setError(null);
    router.push(ROUTES.dashboard);
    router.refresh();
  });

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full max-w-[384px] flex-col items-center justify-center gap-6 rounded-2xl bg-white p-3 shadow-md shadow-gray-300 ${className ?? ""}`}
    >
      <div className="flex flex-col items-center gap-4 p-2 text-gray-500 text-center">
        <span className="text-2xl font-bold text-gray-500">ورود</span>
        <span className="text-sm text-gray-500">
          لطفا برای ورود به سامانه، اطلاعات خود را وارد کنید.
        </span>
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        <FormTextInput
          name="username"
          control={control}
          placeholder="نام کاربری"
          rightIcon={User}
          disabled={formDisabled}
          valueFilter="none"
        />

        <FormTextInput
          name="password"
          control={control}
          placeholder="رمز عبور"
          rightIcon={ShieldUser}
          disabled={formDisabled}
          inputType="password"
        />

        {error ? <p className="w-full text-center text-xs text-red-500">{error}</p> : null}
      </div>

      <Button
        type="submit"
        color="darkGreen"
        text="white"
        radius="md"
        size="twoxl"
        width="xl"
        disabled={formDisabled}
        className="w-full"
      >
        ورود
      </Button>
    </form>
  );
}
