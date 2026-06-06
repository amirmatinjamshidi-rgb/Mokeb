import { MyReservationsContent } from "@/features/user-panel/components/reservations/MyReservationsContent";
import { mockReservations } from "@/features/user-panel/data/reservations.mock";

export default function MyReservationsPage() {
  return <MyReservationsContent reservations={mockReservations} />;
}
