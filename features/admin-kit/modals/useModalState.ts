"use client";

import { useCallback, useState } from "react";

/** Controlled open/close for a single modal. */
export function useModalState(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const toggleModal = useCallback(() => setOpen((v) => !v), []);

  return { open, setOpen, openModal, closeModal, toggleModal };
}

/** Form modal + optional view/detail target (table row actions pattern). */
export function useFormAndViewModals<T>() {
  const form = useModalState(false);
  const [viewTarget, setViewTarget] = useState<T | null>(null);

  const openView = useCallback((row: T) => setViewTarget(row), []);
  const closeView = useCallback(() => setViewTarget(null), []);

  return {
    formOpen: form.open,
    openForm: form.openModal,
    closeForm: form.closeModal,
    viewTarget,
    openView,
    closeView,
    isViewOpen: viewTarget !== null,
  };
}
