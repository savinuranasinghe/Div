import React from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedProject from "@/components/home/FeaturedProject";
import WhyDivgazeSection from "@/components/home/WhyDivgazeSection";
// import ContactSection from "@/components/home/ContactSection"; // Remove old import
import ProfessionalContactSection from "@/components/home/ProfessionalContactSection"; // Add new import
import CustomerCounterSection from "@/components/home/CustomerCounterSection";
import Layout from "@/components/layout/Layout";

const Home: React.FC = () => {
  return (
    <Layout>
      <div id="home">
        <HeroSection />
      </div>
      <div id="services">
        <ServicesSection />
      </div>
      <div id="about">
        <WhyDivgazeSection />
      </div>
      <FeaturedProject />
      <CustomerCounterSection />
      <div id="contact">
        <ProfessionalContactSection />
      </div>
    </Layout>
  );
};

export default Home;