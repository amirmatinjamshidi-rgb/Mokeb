type FieldInteractionState = {
  error?: { message?: string } | null;
  isDirty?: boolean;
  isTouched?: boolean;
};

export function isControlledInputValid(params: {
  value: string | undefined | null;
  fieldState: FieldInteractionState;
  required?: boolean;
}): boolean {
  const { value, fieldState, required = true } = params;
  const hasInteracted = Boolean(fieldState.isDirty || fieldState.isTouched);

  if (!hasInteracted || fieldState.error) {
    return false;
  }

  if (required) {
    return String(value ?? "").trim().length > 0;
  }

  return true;
}
