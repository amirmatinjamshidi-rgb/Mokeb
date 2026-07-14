"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import PilgrimInfoForm from "@admin-kit/forms/supervisor/PilgrimInfoForm";
import { useSupervisorFormStore } from "@admin-kit/forms/supervisor/useSupervisorFormStore";
import {
  emptyPilgrim,
  pilgrimRegistrationSchema,
  type RegistrationFormValues,
} from "@admin-kit/schemas/supervisorFormSchemas";
import { cn } from "@admin-kit/shared/lib/utils";
import Button from "@admin-kit/ui/Button";

type Props = {
  className?: string;
  submitLabel?: string;
};

export function SupervisorStep({
  className,
  submitLabel = "ثبت سرپرست",
}: Props) {
  const setRegistrationDraft = useSupervisorFormStore(
    (s) => s.setRegistrationDraft,
  );
  const registrationDraft = useSupervisorFormStore((s) => s.registrationDraft);
  const onSupervisorSubmit = useSupervisorFormStore((s) => s.onSupervisorSubmit);

  const schema = useMemo(() => pilgrimRegistrationSchema(1), []);

  const defaultValues = useMemo(
    () => registrationDraft ?? { pilgrims: [emptyPilgrim()] },
    [registrationDraft],
  );

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { control, handleSubmit } = methods;

  const onSubmit = (data: RegistrationFormValues) => {
    setRegistrationDraft(data);
    onSupervisorSubmit?.(data);
  };

  return (
    <div className={cn("w-full", className)}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-0 py-3 sm:py-4 md:py-5"
          dir="rtl"
          noValidate
        >
          <PilgrimInfoForm
            control={control}
            fieldPrefix="pilgrims.0"
            title="سرپرست"
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              color="darkGreen"
              text="white"
              radius="md"
              border="none"
              size="twoxl"
              width="auto"
              className="min-w-40 w-full max-w-[502px] font-semibold"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
