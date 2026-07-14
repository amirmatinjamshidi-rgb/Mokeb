"use client";

import { MyAccompanyContent } from "@/boss-features/components/ZaerManagement/KarvanManagementContent";
import {
  useAddBossCompanion,
  useBossCompanions,
  useRemoveBossCompanion,
  useUploadBossCompanionFile,
} from "@/boss-features/api/hooks";
import type { Accompany } from "@/boss-features/components/ManagementSchema";

export default function ManageGuestsPage() {
  const { data: companions = [], isLoading } = useBossCompanions();
  const addCompanion = useAddBossCompanion();
  const removeCompanion = useRemoveBossCompanion();
  const uploadFile = useUploadBossCompanionFile();

  return (
    <MyAccompanyContent
      initialAccompanies={companions}
      isLoading={isLoading}
      onAdd={(values) => addCompanion.mutateAsync(values)}
      onDelete={(row: Accompany) =>
        removeCompanion.mutateAsync(String(row.id))
      }
      onExcelUpload={(file) => void uploadFile.mutate(file)}
    />
  );
}
