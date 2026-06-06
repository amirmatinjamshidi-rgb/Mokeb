"use client";

import Button from "@/features/shared/ui/button";
import { PhoneCall } from "lucide-react";
import { useForm } from "react-hook-form";
import { IconLabelInput } from "@/features/shared/ui/IconLabelInput";

type SubmitFormValues = {
  phone: string;
};

function Submit() {
  const { control, handleSubmit } = useForm<SubmitFormValues>({
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = (_data: SubmitFormValues) => {
    // Integrate API call here.
  };

  return (
    <div className="Gray-backGround mx-auto w-full min-h-37 rounded-2xl px-4 py-8 shadow-lg shadow-gray-300 sm:px-8 sm:py-10 md:px-12">
      <div className="flex w-full flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1 text-right">
          <h2 className="text-xl font-bold sm:text-2xl">همراهی با موکب</h2>
          <p className="text-sm sm:text-base">
            برای اطلاع از برنامه های موکب ، شماره تماس خود را وارد کنید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full min-w-0 flex-col gap-3 sm:max-w-md sm:flex-row sm:items-stretch sm:gap-2 md:max-w-lg"
        >
          <IconLabelInput
            icon={<PhoneCall />}
            inputClassName="text-right"
            labelClassName="text-right"
            placeholder="شماره موبایل"
          />

          <Button
            text="white"
            type="submit"
            color="warning"
            radius="md"
            border="none"
            width="lg"
            className="min-h-14 w-full shrink-0 text-base sm:w-auto sm:min-w-37"
          >
            عضویت
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Submit;
