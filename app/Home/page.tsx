import React from "react";
import Container from "@mui/material/Container";
import Hero from "@/features/components/Home/Hero";
import Submit from "@/features/components/global/Submit";
import AbilityCardList from "@/features/components/Home/AbilityCard";
import ServicesSection from "@/features/components/Home/ServicesSection";
import KarvanRoad from "@/features/UI/KarvanRoad";
import HomeAccordion from "@/features/components/Home/HomeAccordion";
function page() {
  return (
    <>
      <Hero />
      <Container maxWidth="xl" className="flex gap-20 flex-col">
        <Submit />
        <AbilityCardList />
        <ServicesSection />
        <KarvanRoad />
        <HomeAccordion />
      </Container>
    </>
  );
}

export default page;
