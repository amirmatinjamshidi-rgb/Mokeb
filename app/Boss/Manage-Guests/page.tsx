"use client";

import { useState } from "react";
import { MyAccompanyContent } from "@/boss-features/components/ZaerManagement/KarvanManagementContent";
import {
  useAddBossCompanion,
  useBossCompanions,
  useRemoveBossCompanion,
  useUploadBossCompanionFile,
} from "@/boss-features/api/hooks";
import type { Accompany } from "@/boss-features/components/ManagementSchema";
import { useDebouncedValue } from "@/features/shared/hooks/useDebouncedValue";

export default function ManageGuestsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const { data: companions = [], isLoading } =
    useBossCompanions(debouncedSearch);
  const addCompanion = useAddBossCompanion();
  const removeCompanion = useRemoveBossCompanion();
  const uploadFile = useUploadBossCompanionFile();

  return (
    <MyAccompanyContent
      initialAccompanies={companions}
      isLoading={isLoading}
      search={search}
      onSearchChange={setSearch}
      onAdd={(values) => addCompanion.mutateAsync(values)}
      onDelete={async (row: Accompany) => {
        const key =
          row.nationalCode?.trim() ||
          row.passportNumber?.trim() ||
          String(row.id).trim();
        if (!key) {
          throw new Error("کد ملی یا پاسپورت برای حذف لازم است.");
        }
        await removeCompanion.mutateAsync(key);
      }}
      onExcelUpload={async (file) => {
        await uploadFile.mutateAsync(file);
      }}
      uploading={uploadFile.isPending}
      adding={addCompanion.isPending}
    />
  );
}
