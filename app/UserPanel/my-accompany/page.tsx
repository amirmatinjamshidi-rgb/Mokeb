import { MyAccompanyContent } from "@/features/user-panel/components/accompany/MyAccompanyContent";
import { mockAccompanies } from "@/features/user-panel/data/accompany.mock";

export default function MyAccompanyPage() {
  return <MyAccompanyContent initialAccompanies={mockAccompanies} />;
}
