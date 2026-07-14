"use client";

import { type ReactNode } from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import {
  BookOpen,
  ContactRound,
  Edit,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  Controller,
  type Control,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";

import FormTextInput from "./FormTextInput";
import { FormBloodTypeSelect } from "@/features/shared/ui/BloodTypeSelect";
import { PersianDateField } from "@/features/shared/ui/PersianDateField";
import { cn } from "@/boss-features/lib/utils";
import { colors, CONTROL_H } from "@/boss-features/reservation/tokens";
import type { ProfileFormValues } from "../lib/profileSchema";
const radioGreenSx = {
  padding: "6px",
  color: colors.neutral04,
  "&.Mui-checked": { color: colors.primary08 },
  "&.Mui-disabled": { color: colors.neutral04, opacity: 0.45 },
} as const;
const selectSx = {
  height: CONTROL_H,
  borderRadius: "12px",
  backgroundColor: colors.backgroundW,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.goldLine },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: colors.goldLine,
    borderWidth: "1px",
  },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "20px",
    color: colors.neutral08,
    paddingY: 1.5,
    paddingX: 2,
    textAlign: "right",
  },
};

function SectionDivider() {
  return <div className="h-px w-full border border-[#CBA52C]" />;
}

function FormRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 gap-2.5 md:grid-cols-2">
      {children}
    </div>
  );
}

function FieldCell({ children }: { children?: ReactNode }) {
  return <div className="w-full min-w-0 max-w-125.5">{children}</div>;
}

type SectionHeaderProps = {
  title: string;
  showEditButton?: boolean;
  isEditing?: boolean;
  onEditToggle?: () => void;
};

function SectionHeader({
  title,
  showEditButton = false,
  isEditing = false,
  onEditToggle,
}: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="text-base font-bold text-[#175E47]">{title}</h2>
      {showEditButton ? (
        <button
          type="button"
          onClick={onEditToggle}
          className="flex gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-[#446D5D] transition"
        >
          <Edit /> {isEditing ? "ذخیره اطلاعات" : "ویرایش اطلاعات"}
        </button>
      ) : null}
    </div>
  );
}

type Props = {
  control: Control<ProfileFormValues>;
  setValue: UseFormSetValue<ProfileFormValues>;
  watch: UseFormWatch<ProfileFormValues>;
  disabled?: boolean;
  showEditButton?: boolean;
  isEditing?: boolean;
  onEditToggle?: () => void;
};

export function ProfileFormFields({
  control,
  setValue,
  watch,
  disabled = false,
  showEditButton = false,
  isEditing = false,
  onEditToggle,
}: Props) {
  const birthDate = watch("birthDate");
  const passportExpiry = watch("passportExpiry");

  return (
    <>
      <section className="flex flex-col gap-10">
        <SectionHeader
          title="اطلاعات شخصی"
          showEditButton={showEditButton}
          isEditing={isEditing}
          onEditToggle={onEditToggle}
        />
        <FormRow>
          <FieldCell>
            <FormTextInput
              name="fullName"
              control={control}
              placeholder="نام و نام خانوادگی"
              rightIcon={User}
              disabled={disabled}
              valueFilter="noDigits"
            />
          </FieldCell>
          <FieldCell>
            <FormTextInput
              name="fatherName"
              control={control}
              placeholder="نام پدر"
              rightIcon={User}
              disabled={disabled}
              valueFilter="noDigits"
            />
          </FieldCell>
        </FormRow>
        <FormRow>
          <FieldCell>
            <Controller
              name="gender"
              control={control}
              render={({ field: f, fieldState }) => (
                <div className="w-full">
                  <div
                    className={cn(
                      "flex h-14 items-center justify-between  px-4",
                      fieldState.error && "border-red-400",
                    )}
                  >
                    <span className="text-sm text-gray-500">جنسیت</span>
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
                        control={
                          <Radio
                            size="small"
                            sx={radioGreenSx}
                            disabled={disabled}
                          />
                        }
                        label="مرد"
                      />
                      <FormControlLabel
                        value="female"
                        control={
                          <Radio
                            size="small"
                            sx={radioGreenSx}
                            disabled={disabled}
                          />
                        }
                        label="زن"
                      />
                    </RadioGroup>
                  </div>
                  {fieldState.error?.message ? (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </FieldCell>
          <FieldCell />
        </FormRow>
        <FormRow>
          <FieldCell>
            <Controller
              name="birthDate"
              control={control}
              render={({ fieldState }) => (
                <PersianDateField
                  placeholder="تاریخ تولد *"
                  value={birthDate}
                  onChange={(v) =>
                    setValue("birthDate", v, { shouldValidate: true })
                  }
                  error={fieldState.error?.message}
                  disabled={disabled}
                />
              )}
            />
          </FieldCell>
          <FieldCell>
            <FormTextInput
              name="city"
              control={control}
              placeholder="شهر"
              rightIcon={MapPin}
              disabled={disabled}
              valueFilter="noDigits"
            />
          </FieldCell>
        </FormRow>
      </section>

      <SectionDivider />

      <section className="flex flex-col gap-10">
        <SectionHeader title="اطلاعات شناسایی" />
        <FormRow>
          <FieldCell>
            <Controller
              name="nationality"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl
                  fullWidth
                  error={!!fieldState.error}
                  disabled={disabled}
                >
                  <div className="relative">
                    <Select
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      inputRef={field.ref}
                      value={field.value}
                      displayEmpty
                      disabled={disabled}
                      sx={{
                        ...selectSx,
                        "& .MuiSelect-select": {
                          ...selectSx["& .MuiSelect-select"],
                          paddingInlineEnd: 5,
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        ملیت *
                      </MenuItem>
                      <MenuItem value="iranian">ایرانی</MenuItem>
                      <MenuItem value="foreign">غیر ایرانی</MenuItem>
                    </Select>
                  </div>
                  {fieldState.error?.message ? (
                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
          </FieldCell>
          <FieldCell>
            <FormTextInput
              name="nationalCode"
              control={control}
              placeholder="کد ملی"
              rightIcon={ShieldCheck}
              disabled={disabled}
              valueFilter="digits"
              maxLength={10}
            />
          </FieldCell>
        </FormRow>
        <FormRow>
          <FieldCell>
            <FormTextInput
              name="passportNumber"
              control={control}
              placeholder="شماره پاسپورت"
              rightIcon={BookOpen}
              disabled={disabled}
              valueFilter="passportId"
              maxLength={20}
            />
          </FieldCell>
          <FieldCell>
            <Controller
              name="passportExpiry"
              control={control}
              render={({ fieldState }) => (
                <PersianDateField
                  placeholder="تاریخ انقضای پاسپورت *"
                  value={passportExpiry}
                  onChange={(v) =>
                    setValue("passportExpiry", v, { shouldValidate: true })
                  }
                  error={fieldState.error?.message}
                  disabled={disabled}
                />
              )}
            />
          </FieldCell>
        </FormRow>
      </section>

      <SectionDivider />

      <section className="flex flex-col gap-10">
        <SectionHeader title="اطلاعات سلامت" />
        <FormRow>
          <FieldCell>
            <FormBloodTypeSelect
              name="bloodType"
              control={control}
              disabled={disabled}
              allowEmpty
            />
          </FieldCell>
          <FieldCell>
            <FormTextInput
              name="diseaseHistory"
              control={control}
              placeholder="سابقه بیماری"
              required={false}
              rightIcon={HeartPulse}
              showMandatory={false}
              disabled={disabled}
            />
          </FieldCell>
        </FormRow>
      </section>

      <SectionDivider />

      <section className="flex flex-col gap-10">
        <SectionHeader title="اطلاعات تماس" />
        <FormRow>
          <FieldCell>
            <FormTextInput
              name="mobile1"
              control={control}
              placeholder="شماره موبایل اول"
              rightIcon={Phone}
              disabled={disabled}
              valueFilter="digits"
              maxLength={11}
            />
          </FieldCell>
          <FieldCell>
            <FormTextInput
              name="mobile2"
              control={control}
              placeholder="شماره موبایل دوم"
              rightIcon={Phone}
              disabled={disabled}
              valueFilter="digits"
              maxLength={11}
            />
          </FieldCell>
        </FormRow>
        <FormRow>
          <FieldCell>
            <FormTextInput
              name="relativePhone"
              control={control}
              placeholder="تلفن یکی از آشنایان در ایران"
              rightIcon={ContactRound}
              disabled={disabled}
              valueFilter="digits"
              maxLength={15}
            />
          </FieldCell>
          <FieldCell />
        </FormRow>
      </section>
    </>
  );
}
