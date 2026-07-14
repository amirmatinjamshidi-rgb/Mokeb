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
import {
  UserPlus,
  User,
  Phone,
  ShieldCheck,
  HeartPulse,
  ContactRound,
  Pencil,
  FileText,
} from "lucide-react";
import {
  Controller,
  Control,
  useFormContext,
  useWatch,
  type FieldPath,
} from "react-hook-form";

import Button from "@admin-kit/ui/Button";
import { isControlledInputValid } from "@admin-kit/shared/lib/inputValidation";
import { cn } from "@admin-kit/shared/lib/utils";
import { IconLabelInput } from "@admin-kit/ui/IconLabelInput";
import { colors, CONTROL_H } from "@admin-kit/shared/tokens";
import { FormBloodTypeSelect } from "@/features/shared/ui/BloodTypeSelect";
import type {
  PilgrimFormValues,
  RegistrationFormValues,
} from "@admin-kit/schemas/supervisorFormSchemas";

/** Same shell as `ReservationFilters` + Karvan reservations controls */
const controlShellClass =
  "flex h-14 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-5 text-sm text-[#61756F] transition-all duration-300 hover:border-[#175E47] focus-within:border-[#175E47]";

const radioGreenSx = {
  padding: "6px",
  color: colors.neutral04,
  "&.Mui-checked": { color: colors.primary08 },
  "&.Mui-disabled": { color: colors.neutral04, opacity: 0.45 },
} as const;

const formControlLabelSx = {
  marginInlineEnd: 0,
  "& .MuiFormControlLabel-label": {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: colors.neutral08,
  },
} as const;

const selectFormControlSx = {
  margin: 0,
  "& .MuiFormHelperText-root": {
    marginTop: "6px",
    marginBottom: 0,
  },
} as const;

const selectKarvanSx = {
  height: CONTROL_H,
  minHeight: CONTROL_H,
  maxHeight: CONTROL_H,
  borderRadius: "8px",
  backgroundColor: colors.backgroundW,
  boxSizing: "border-box",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary08 },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.primary08,
    borderWidth: "1px",
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "20px",
    color: colors.neutral08,
    minHeight: "unset",
    height: "100%",
    boxSizing: "border-box",
    padding: "0 40px 0 16px",
    textAlign: "right",
  },
  "& .MuiSelect-icon": {
    top: "50%",
    transform: "translateY(-50%)",
  },
} as const;

/** Avoids Select staying visually “open” / focused after the menu closes (RTL + register inputs). */
const selectMenuProps = {
  disableScrollLock: true as const,
  disableAutoFocus: true as const,
  disableRestoreFocus: true as const,
  onClose: () => {
    requestAnimationFrame(() => {
      const a = document.activeElement;
      if (a instanceof HTMLElement) {
        a.blur();
      }
    });
  },
  MenuListProps: {
    dense: true,
    sx: { py: 0.5 },
  },
  PaperProps: {
    sx: {
      direction: "rtl" as const,
      "& .MuiMenuItem-root": {
        minHeight: 36,
        fontSize: 14,
        py: 0.5,
      },
    },
  },
};

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
  const { setValue } = useFormContext<RegistrationFormValues>();

  const field = (name: keyof PilgrimFormValues) =>
    `${fieldPrefix}.${String(name)}` as FieldPath<RegistrationFormValues>;

  const nationality = useWatch({
    control,
    name: field("nationality"),
  }) as PilgrimFormValues["nationality"] | undefined;

  const isForeign = nationality === "foreign";

  return (
    <div className="w-full p-0 md:p-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-base font-medium text-[#D4AF37] sm:px-4 sm:text-lg">
            <UserPlus size={16} className="shrink-0" /> {title}
          </div>

          <Button
            color="white"
            text="darkGreen"
         
            size="sm"
            width="auto"
            className="w-full gap-2 px-4 sm:w-auto"
            type="button"
          >
            <Pencil size={16} />
            انتخاب از زائران سابق
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
                  icon={<User size={18} />}
                  placeholder="نام"
                  isValid={isControlledInputValid({
                    value: inputString(f.value),
                    fieldState,
                  })}
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
                  icon={<User size={18} />}
                  placeholder="نام خانوادگی"
                  isValid={isControlledInputValid({
                    value: inputString(f.value),
                    fieldState,
                  })}
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
            render={({ field: f, fieldState }) => (
              <IconLabelInput
                name={f.name}
                ref={f.ref}
                onBlur={f.onBlur}
                onChange={f.onChange}
                value={inputString(f.value)}
                icon={<User size={18} />}
                placeholder="نام مستعار"
                isValid={isControlledInputValid({
                  value: inputString(f.value),
                  fieldState,
                  required: false,
                })}
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
                  icon={<User size={18} />}
                  placeholder="نام پدر"
                  isValid={isControlledInputValid({
                    value: inputString(f.value),
                    fieldState,
                  })}
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Controller
            name={field("gender")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full">
                <div
                  className={cn(
                    controlShellClass,
                    fieldState.error && "border-red-400",
                  )}
                >
                  <span className="shrink-0 text-sm font-medium text-[#61756F]">
                    جنسیت
                  </span>
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
                      control={<Radio size="small" sx={radioGreenSx} />}
                      label="مرد"
                      sx={formControlLabelSx}
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio size="small" sx={radioGreenSx} />}
                      label="زن"
                      sx={formControlLabelSx}
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
                    controlShellClass,
                    fieldState.error && "border-red-400",
                  )}
                >
                  <span className="shrink-0 text-sm font-medium text-[#61756F]">
                    ملیت
                  </span>
                  <RadioGroup
                    row
                    name={f.name}
                    onBlur={f.onBlur}
                    onChange={(e) => {
                      const v = (e.target as HTMLInputElement)
                        .value as PilgrimFormValues["nationality"];
                      f.onChange(v);
                      setValue(field("nationalCode"), "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    ref={f.ref}
                    value={f.value === "foreign" ? "foreign" : "iranian"}
                  >
                    <FormControlLabel
                      value="iranian"
                      control={<Radio size="small" sx={radioGreenSx} />}
                      label="ایرانی"
                      sx={formControlLabelSx}
                    />
                    <FormControlLabel
                      value="foreign"
                      control={<Radio size="small" sx={radioGreenSx} />}
                      label="غیر ایرانی"
                      sx={formControlLabelSx}
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
                icon={
                  isForeign ? (
                    <FileText size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )
                }
                placeholder={
                  isForeign ? "شماره پاسپورت" : "کد ملی"
                }
                isValid={isControlledInputValid({
                  value: inputString(f.value),
                  fieldState,
                })}
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Controller
            name={field("province")}
            control={control}
            render={({ field: f, fieldState }) => (
              <FormControl
                fullWidth
                error={!!fieldState.error}
                sx={selectFormControlSx}
              >
                <Select
                  name={f.name}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  inputRef={f.ref}
                  value={inputString(f.value)}
                  displayEmpty
                  sx={selectKarvanSx}
                  MenuProps={selectMenuProps}
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
              <FormControl
                fullWidth
                error={!!fieldState.error}
                sx={selectFormControlSx}
              >
                <Select
                  name={f.name}
                  onBlur={f.onBlur}
                  onChange={f.onChange}
                  inputRef={f.ref}
                  value={inputString(f.value)}
                  displayEmpty
                  sx={selectKarvanSx}
                  MenuProps={selectMenuProps}
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
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
                  icon={<Phone size={18} />}
                  placeholder="شماره موبایل 1 (واتساپ)"
                  isValid={isControlledInputValid({
                    value: inputString(f.value),
                    fieldState,
                  })}
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
                  icon={<Phone size={18} />}
                  placeholder="شماره موبایل 2 (واتساپ)"
                  isValid={isControlledInputValid({
                    value: inputString(f.value),
                    fieldState,
                  })}
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
                icon={<ContactRound size={18} />}
                placeholder="تلفن یکی از آشنایان در ایران"
                isValid={isControlledInputValid({
                  value: inputString(f.value),
                  fieldState,
                })}
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <FormBloodTypeSelect
            name={field("bloodType")}
            control={control}
            allowEmpty
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
                  icon={<HeartPulse size={18} />}
                  placeholder="سابقه بیماری"
                  isValid={isControlledInputValid({
                    value: inputString(f.value),
                    fieldState,
                  })}
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
