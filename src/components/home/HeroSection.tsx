// src/components/home/HeroSection.tsx (Updated)
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import NeuralNetworkBackground from "./NeuralNetworkBackground"; // Replace the old background

const HeroSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === titleRef.current) {
              titleRef.current.classList.add("animate-fade-in");
            } else if (entry.target === ctaRef.current) {
              setTimeout(() => {
                ctaRef.current?.classList.add("animate-fade-in");
              }, 600);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Neural Network Background Animation */}
      <NeuralNetworkBackground />
      
      {/* Static Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-blue/5 to-transparent opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-electric-violet/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Additional animated elements for more visual interest */}
        <div className="absolute top-1/2 left-1/2 w-24 md:w-48 h-24 md:h-48 bg-neon-blue/3 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-16 md:w-32 h-16 md:h-32 bg-electric-violet/4 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-30 text-center">
        <h1 
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-10 opacity-0 transition-opacity duration-700"
          style={{ 
            lineHeight: "1.1"
          }}
        >
          <span className="text-neon-blue block drop-shadow-lg">
            Beyond Boundaries
          </span>
          <span className="text-white block">
            Digital Innovation
          </span>
        </h1>
        
        <div 
          ref={ctaRef}
          className="flex justify-center opacity-0 transition-opacity duration-700"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              onClick={() => scrollToSection('services')}
              className="bg-gradient-to-r from-neon-blue to-electric-violet text-white hover:from-electric-violet hover:to-neon-blue transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Explore Our Services
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            
            <Button 
              onClick={() => scrollToSection('contact')}
              variant="outline" 
              className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;