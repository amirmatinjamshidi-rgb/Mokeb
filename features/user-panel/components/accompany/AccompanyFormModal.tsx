"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  profileDefaultValues,
  profileSchema,
  type ProfileFormValues,
} from "../../lib/profileSchema";
import { ProfileFormFields } from "../profile/ProfileFormFields";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
};

export function AccompanyFormModal({ open, onClose, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit, setValue, watch, reset } =
    useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues: profileDefaultValues,
    });

  if (!open) return null;

  const submit = async (data: ProfileFormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
      reset(profileDefaultValues);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-md"
        dir="rtl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#175E47]">افزودن همسفر جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
            aria-label="بستن"
            disabled={submitting}
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-10"
          noValidate
        >
          <ProfileFormFields
            control={control}
            setValue={setValue}
            watch={watch}
            disabled={submitting}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-gray-300 px-6 py-2 text-sm font-medium text-gray-500"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#175E47] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1F7E5F] disabled:opacity-60"
            >
              {submitting ? "در حال ثبت…" : "ثبت"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
