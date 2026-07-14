import { ReservationSectionPad } from "@/features/reservation/layouts/SiteReservationLayout";
import { ReservationHero } from "@/features/reservation/components/ReservationHero";
import { CapacityReservationSection } from "@/features/reservation/components/CapacityReservationSection";
import { ContinueReservationButton } from "@/features/reservation/components/ContinueReservationButton";
import { ScrollToTopButton } from "@/features/reservation/components/ScrollToTopButton";
import { GeneralReservationGate } from "@/features/reservation/components/GeneralReservationGate";
import Submit from "@/features/shared/components/Submit";

export default function page() {
  return (
    <GeneralReservationGate>
      <main className="min-h-screen w-full min-w-0 bg-white text-[#175E47]">
        <ReservationHero />

        <ReservationSectionPad className="w-full">
          <CapacityReservationSection />
          <ContinueReservationButton />
        </ReservationSectionPad>

        <div className="page-container py-8 sm:py-10">
          <Submit />
        </div>

        <div className="page-container flex justify-start pb-6 pt-2">
          <ScrollToTopButton />
        </div>
      </main>
    </GeneralReservationGate>
  );
}
