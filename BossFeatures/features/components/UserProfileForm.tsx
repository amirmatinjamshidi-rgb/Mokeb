"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  profileDefaultValues,
  profileSchema,
  type ProfileFormValues,
} from "../lib/profileSchema";
import { ProfileFormFields } from "./ProfileFormFields";
import { useBossProfile, useUpdateBossProfile } from "../api/hooks";

export function UserProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { data: profileData, isLoading, error } = useBossProfile();
  const updateProfile = useUpdateBossProfile();

  const { control, handleSubmit, setValue, watch, reset } =
    useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: profileDefaultValues,
    });

  useEffect(() => {
    if (profileData) {
      reset({ ...profileDefaultValues, ...profileData });
    }
  }, [profileData, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setSaveError(null);
    try {
      await updateProfile.mutateAsync(data);
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "ذخیره اطلاعات ناموفق بود.",
      );
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      void handleSubmit(onSubmit)();
      return;
    }
    setIsEditing(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-277 flex-col gap-y-10 rounded-2xl bg-white px-10 py-8 shadow-[0px_4px_12px_0px_#00000024]"
      dir="rtl"
      noValidate
    >
      {isLoading ? (
        <p className="text-sm text-gray-500">در حال بارگذاری اطلاعات…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-500">
          {error instanceof Error ? error.message : "خطا در دریافت اطلاعات"}
        </p>
      ) : null}
      {saveError ? <p className="text-sm text-red-500">{saveError}</p> : null}

      <ProfileFormFields
        control={control}
        setValue={setValue}
        watch={watch}
        disabled={!isEditing || updateProfile.isPending}
        showEditButton
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
      />
    </form>
  );
}
