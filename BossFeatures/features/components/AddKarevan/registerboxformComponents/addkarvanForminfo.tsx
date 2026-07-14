"use client";

import { memo, useCallback, useMemo } from "react";
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
  UsersRound,
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
  useWatch,
  type FieldPath,
  type UseFormSetValue,
} from "react-hook-form";

import Button from "@/boss-features/UI/button";
import FormTextInput from "@/boss-features/components/FormTextInput";
import { FormBloodTypeSelect } from "@/features/shared/ui/BloodTypeSelect";
import { cn } from "@/boss-features/lib/utils";
import { colors, CONTROL_H } from "@/boss-features/reservation/tokens";
import type { PilgrimFormValues, RegistrationFormValues } from "../FormSchemas";
import {
  getCitiesForProvince,
  IRAN_PROVINCES,
} from "@/boss-features/data/iranLocations";

const controlShellClass =
  "flex h-14 w-full max-w-[502px] min-w-0 items-center justify-between gap-2.5 rounded-lg border-white bg-white px-5 text-sm text-[#61756F] transition-all duration-300 hover:border-[#175E47] focus-within:border-[#175E47] focus-within:ring-1 focus-within:ring-[#175E47]/35";

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
  "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary08 },
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
  setValue: UseFormSetValue<RegistrationFormValues>;
  fieldPrefix: `pilgrims.${number}`;
  title: string;
};

type NationalCodeFieldProps = {
  control: Control<RegistrationFormValues>;
  fieldPrefix: `pilgrims.${number}`;
};

const PilgrimNationalCodeField = memo(function PilgrimNationalCodeField({
  control,
  fieldPrefix,
}: NationalCodeFieldProps) {
  const nationalityPath =
    `${fieldPrefix}.nationality` as FieldPath<RegistrationFormValues>;
  const nationality = useWatch({
    control,
    name: nationalityPath,
  }) as PilgrimFormValues["nationality"] | undefined;
  const isForeign = nationality === "foreign";
  const nationalCodeName =
    `${fieldPrefix}.nationalCode` as FieldPath<RegistrationFormValues>;

  return (
    <FormTextInput
      key={isForeign ? "passport-field" : "national-field"}
      name={nationalCodeName}
      control={control}
      placeholder={isForeign ? "شماره پاسپورت" : "کد ملی"}
      rightIcon={isForeign ? FileText : ShieldCheck}
      valueFilter={isForeign ? "passportId" : "digits"}
      maxLength={isForeign ? undefined : 10}
      variant="karvan"
    />
  );
});

function PilgrimInfoFormInner({ control, setValue, fieldPrefix, title }: Props) {
  const field = useCallback(
    (name: keyof PilgrimFormValues) =>
      `${fieldPrefix}.${name}` as FieldPath<RegistrationFormValues>,
    [fieldPrefix],
  );

  const provincePath = field("province");
  const selectedProvince = useWatch({
    control,
    name: provincePath,
  }) as string | undefined;

  const cityOptions = useMemo(
    () => getCitiesForProvince(selectedProvince ?? ""),
    [selectedProvince],
  );

  return (
    <div className="w-full p-0">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-base font-medium text-[#D4AF37] sm:px-4 sm:text-lg">
            <UsersRound size={16} className="shrink-0" /> {title}
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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <FormTextInput
            name={field("firstName")}
            control={control}
            placeholder="نام"
            rightIcon={User}
            valueFilter="noDigits"
            variant="karvan"
          />
          <FormTextInput
            name={field("lastName")}
            control={control}
            placeholder="نام خانوادگی"
            rightIcon={User}
            valueFilter="noDigits"
            variant="karvan"
          />
          <FormTextInput
            name={field("nickName")}
            control={control}
            placeholder="نام مستعار"
            rightIcon={User}
            valueFilter="noDigits"
            variant="karvan"
            required={false}
            showMandatory={false}
          />
          <FormTextInput
            name={field("fatherName")}
            control={control}
            placeholder="نام پدر"
            rightIcon={User}
            valueFilter="noDigits"
            variant="karvan"
          />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Controller
            name={field("gender")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full max-w-[502px]">
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
              <div className="w-full max-w-[502px]">
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
                      setValue(
                        `${fieldPrefix}.nationalCode` as FieldPath<RegistrationFormValues>,
                        "",
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        },
                      );
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

        <PilgrimNationalCodeField control={control} fieldPrefix={fieldPrefix} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Controller
            name={field("province")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full max-w-[502px]">
                <FormControl
                  fullWidth
                  error={!!fieldState.error}
                  sx={selectFormControlSx}
                >
                  <Select
                    name={f.name}
                    onBlur={f.onBlur}
                    onChange={(e) => {
                      f.onChange(e);
                      setValue(field("city"), "");
                    }}
                    inputRef={f.ref}
                    value={inputString(f.value)}
                    displayEmpty
                    sx={selectKarvanSx}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="">استان محل سکونت</MenuItem>
                    {IRAN_PROVINCES.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error?.message ? (
                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                  ) : null}
                </FormControl>
              </div>
            )}
          />

          <Controller
            name={field("city")}
            control={control}
            render={({ field: f, fieldState }) => (
              <div className="w-full max-w-[502px]">
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
                    {cityOptions.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldState.error?.message ? (
                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                  ) : null}
                </FormControl>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <FormTextInput
            name={field("mobile1")}
            control={control}
            placeholder="شماره موبایل 1 (واتساپ)"
            rightIcon={Phone}
            valueFilter="digits"
            maxLength={11}
            variant="karvan"
          />
          <FormTextInput
            name={field("mobile2")}
            control={control}
            placeholder="شماره موبایل 2 (واتساپ)"
            rightIcon={Phone}
            valueFilter="digits"
            maxLength={11}
            variant="karvan"
          />
        </div>

        <FormTextInput
          name={field("relativePhone")}
          control={control}
          placeholder="تلفن یکی از آشنایان در ایران"
          rightIcon={ContactRound}
          valueFilter="digits"
          variant="karvan"
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <FormBloodTypeSelect
            name={field("bloodType")}
            control={control}
            allowEmpty
          />
          <FormTextInput
            name={field("diseaseHistory")}
            control={control}
            placeholder="سابقه بیماری"
            rightIcon={HeartPulse}
            valueFilter="none"
            variant="karvan"
            required={false}
            showMandatory={false}
          />
        </div>
      </div>
    </div>
  );
}

const PilgrimInfoForm = memo(PilgrimInfoFormInner);
export default PilgrimInfoForm;
