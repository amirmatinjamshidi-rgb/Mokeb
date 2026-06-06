"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  profileDefaultValues,
  profileSchema,
  type ProfileFormValues,
} from "../../lib/profileSchema";
import { ProfileFormFields } from "./ProfileFormFields";

export function UserProfileForm() {
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaultValues,
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
    setIsEditing(false);
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
      className="mx-auto flex w-full max-w-277 flex-col gap-10 rounded-2xl bg-white px-10 py-8 shadow-[0px_4px_12px_0px_#00000024]"
      dir="rtl"
      noValidate
    >
      <ProfileFormFields
        control={control}
        setValue={setValue}
        watch={watch}
        disabled={!isEditing}
        showEditButton
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
      />
    </form>
  );
}
