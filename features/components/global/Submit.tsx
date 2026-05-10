"use client";

import Button from "@/features/UI/button";
import FormTextInput from "@/features/UI/FormTextInput";
import { PhoneCall } from "lucide-react";
import { useForm } from "react-hook-form";

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
    <div className="Gray-backGround mx-auto max-w-324 rounded-2xl px-4 py-3 min-h-39 shadow-lg shadow-gray-500/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="max-w-97.75 flex flex-col gap-1">
          <h2 className="text-2xl font-bold">همراهی با موکب</h2>
          <p className="text-base">
            برای اطلاع از برنامه های موکب ، شماره تماس خود را وارد کنید.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full md:w-auto min-w-0 items-start gap-2"
        >
          <FormTextInput<SubmitFormValues>
            name="phone"
            control={control}
            className="flex-1 min-w-0"
            placeholder="شماره موبایل"
            inputMode="tel"
            maxLength={11}
            rightIcon={PhoneCall}
            rightIconClassName="rotate-[270deg]"
            showLabel={false}
            showMandatory
            showLabelInInput
            showIconR
            showIconL={false}
            showHelper={false}
            showCounter={false}
            rules={{
              pattern: {
                value: /^09\d{9}$/,
                message: "شماره موبایل معتبر نیست",
              },
            }}
          />

          <Button
            type="submit"
            color="warning"
            radius="none"
            border="none"
            size="twoxl"
            width="lg"
            className="text-white shrink-0"
          >
            عضویت
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Submit;
