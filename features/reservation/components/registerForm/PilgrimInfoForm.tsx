"use client";

import {
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { UserPlus } from "lucide-react";
import { Controller, Control, type FieldPath } from "react-hook-form";

import {
  User,
  Phone,
  ShieldCheck,
  HeartPulse,
  Droplets,
  ContactRound,
  Pencil,
} from "lucide-react";

import Button from "@/features/shared/ui/button";
import { IconLabelInput } from "@/features/shared/ui/IconLabelInput";
import { cn } from "@/features/shared/lib/utils";
import type {
  PilgrimFormValues,
  RegistrationFormValues,
} from "./pilgrimRegistrationSchema";

function inputString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

type Props = {
  control: Control<RegistrationFormValues>;
  fieldPrefix: `pilgrims.${number}`;
  title: string;
};

export default function PilgrimInfoForm({
  control,
  fieldPrefix,
  title,
}: Props) {
  const field = (name: keyof PilgrimFormValues) =>
    `${fieldPrefix}.${name}` as FieldPath<RegistrationFormValues>;

  return (
    <div className="w-full rounded-2xl bg-white p-4  md:p-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-base font-medium text-[#D4AF37] sm:px-4 sm:text-lg">
            <UserPlus size={16} className="shrink-0" /> {title}
          </div>

          <Button
            color="white"
            border="gray"
            size="sm"
            width="auto"
            className="w-full gap-2 px-4 sm:w-auto"
            type="button"
          >
            <Pencil size={16} />
            انتخاب از زائران سابق
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Controller
            name={field("firstName")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <IconLabelInput
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  value={inputString(f.value)}
                  // label="نام"
                  icon={<User size={18} />}
                  placeholder="نام"
                  className={cn(fieldState.error && "border-red-400")}
                />
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <Controller
            name={field("lastName")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <IconLabelInput
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  value={inputString(f.value)}
                  // label="نام خانوادگی"
                  icon={<User size={18} />}
                  placeholder="نام خانوادگی"
                  className={cn(fieldState.error && "border-red-400")}
                />
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <Controller
            name={field("nickName")}
            control={control}
            render={({ field: f }) => (
              <IconLabelInput
                name={f.name}
                ref={f.ref}
                onBlur={f.onBlur}
                onChange={f.onChange}
                value={inputString(f.value)}
                // label="نام مستعار"
                icon={<User size={18} />}
                placeholder="نام مستعار"
              />
            )}
          />

          <Controller
            name={field("fatherName")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <IconLabelInput
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  value={inputString(f.value)}
                  // label="نام پدر"
                  icon={<User size={18} />}
                  placeholder="نام پدر"
                  className={cn(fieldState.error && "border-red-400")}
                />
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Controller
            name={field("gender")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <div
                  className={cn(
                    "flex h-14 items-center justify-between rounded-xl border px-4",
                    fieldState.error ? "border-red-400" : "border-[#E5E7EB]",
                  )}
                >
                  <span>جنسیت</span>
                  <RadioGroup
                    row
                    name={f.name}
                    onBlur={f.onBlur}
                    onChange={f.onChange}
                    ref={f.ref}
                    value={f.value === "female" ? "female" : "male"}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="مرد"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="زن"
                    />
                  </RadioGroup>
                </div>
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <Controller
            name={field("nationality")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <div
                  className={cn(
                    "flex h-14 items-center justify-between rounded-xl border px-4",
                    fieldState.error ? "border-red-400" : "border-[#E5E7EB]",
                  )}
                >
                  <span>ملیت</span>
                  <RadioGroup
                    row
                    name={f.name}
                    onBlur={f.onBlur}
                    onChange={f.onChange}
                    ref={f.ref}
                    value={f.value === "foreign" ? "foreign" : "iranian"}
                  >
                    <FormControlLabel
                      value="iranian"
                      control={<Radio />}
                      label="ایرانی"
                    />
                    <FormControlLabel
                      value="foreign"
                      control={<Radio />}
                      label="غیر ایرانی"
                    />
                  </RadioGroup>
                </div>
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>

        <Controller
          name={field("nationalCode")}
          control={control}
          render={({ field: f, fieldState }) => (
            <div className="w-full">
              <IconLabelInput
                name={f.name}
                ref={f.ref}
                onBlur={f.onBlur}
                onChange={f.onChange}
                value={inputString(f.value)}
                // label="کد ملی"
                icon={<ShieldCheck size={18} />}
                placeholder="کد ملی"
                className={cn(fieldState.error && "border-red-400")}
              />
              {fieldState.error?.message ? (
                <p className="mt-1.5 text-right text-xs text-red-600">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Controller
            name={field("province")}
            control={control}
            render={({ field: f, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <Select
                  name={f.name}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  inputRef={f.ref}
                  value={inputString(f.value)}
                  displayEmpty
                  sx={{ height: 56 }}
                >
                  <MenuItem value="">استان محل سکونت</MenuItem>
                  <MenuItem value="tehran">تهران</MenuItem>
                  <MenuItem value="qom">قم</MenuItem>
                </Select>
                {fieldState.error?.message ? (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <Controller
            name={field("city")}
            control={control}
            render={({ field: f, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <Select
                  name={f.name}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  inputRef={f.ref}
                  value={inputString(f.value)}
                  displayEmpty
                  sx={{ height: 56 }}
                >
                  <MenuItem value="">شهر محل سکونت</MenuItem>
                  <MenuItem value="tehran">تهران</MenuItem>
                  <MenuItem value="rey">ری</MenuItem>
                </Select>
                {fieldState.error?.message ? (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Controller
            name={field("mobile1")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <IconLabelInput
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  value={inputString(f.value)}
                  // label="موبایل 1"
                  icon={<Phone size={18} />}
                  placeholder="شماره موبایل 1 (واتساپ)"
                  className={cn(fieldState.error && "border-red-400")}
                />
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <Controller
            name={field("mobile2")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <IconLabelInput
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  value={inputString(f.value)}
                  // label="موبایل 2"
                  icon={<Phone size={18} />}
                  placeholder="شماره موبایل 2 (واتساپ)"
                  className={cn(fieldState.error && "border-red-400")}
                />
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>

        <Controller
          name={field("relativePhone")}
          control={control}
          render={({ field: f, fieldState }) => (
            <div className="w-full">
              <IconLabelInput
                name={f.name}
                ref={f.ref}
                onBlur={f.onBlur}
                onChange={f.onChange}
                value={inputString(f.value)}
                // label="تلفن آشنا"
                icon={<ContactRound size={18} />}
                placeholder="تلفن یکی از آشنایان در ایران"
                className={cn(fieldState.error && "border-red-400")}
              />
              {fieldState.error?.message ? (
                <p className="mt-1.5 text-right text-xs text-red-600">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Controller
            name={field("bloodType")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <IconLabelInput
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  value={inputString(f.value)}
                  // label="گروه خونی"
                  icon={<Droplets size={18} />}
                  placeholder="گروه خونی"
                  className={cn(fieldState.error && "border-red-400")}
                />
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <Controller
            name={field("diseaseHistory")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <IconLabelInput
                  name={f.name}
                  ref={f.ref}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  value={inputString(f.value)}
                  // label="سابقه بیماری"
                  icon={<HeartPulse size={18} />}
                  placeholder="سابقه بیماری"
                  className={cn(fieldState.error && "border-red-400")}
                />
                {fieldState.error?.message ? (
                  <p className="mt-1.5 text-right text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
