import React from "react";
import Hero from "@/features/marketing/home/Hero";
import Submit from "@/features/shared/components/Submit";
import AbilityCardList from "@/features/marketing/home/AbilityCard";
import ServicesSection from "@/features/marketing/home/ServicesSection";
import KarvanRoad from "@/features/shared/ui/KarvanRoad";
import HomeAccordion from "@/features/marketing/home/HomeAccordion";
import { HomeReservationBoxes } from "@/features/marketing/home/HomeReservationBoxes";
import HazratImage from "@/features/marketing/home/hazratImage";

function page() {
  return (
    <>
      <Hero />
      <div className="page-container flex flex-col gap-10 pb-12 pt-6 sm:gap-14 md:gap-20">
        <ServicesSection />
        <HomeReservationBoxes />
        <HazratImage />
        <KarvanRoad />
        <HomeAccordion />
        <AbilityCardList />
        <Submit />
      </div>
    </>
  );
}

export default page;
