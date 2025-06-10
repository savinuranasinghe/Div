import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Handle video loading and autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video plays when component mounts
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Video autoplay prevented:", error);
        }
      };
      
      // Try to play when video can start playing
      video.addEventListener('canplay', playVideo);
      
      return () => {
        video.removeEventListener('canplay', playVideo);
      };
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/assets/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay - Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Gradient Overlay - Additional styling for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-deep-navy-blue/20 via-transparent to-deep-navy-blue/40 z-20"></div>
      </div>

      {/* Fallback Background Animation (if video fails to load) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-neon-blue/5 to-transparent opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-electric-violet/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Content - Above video */}
      <div className="container mx-auto px-4 relative z-30 text-center">
        <h1 
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-10 opacity-0 transition-opacity duration-700"
          style={{ 
            lineHeight: "1.1"
          }}
        >
          {/* Cyan colored text with matching glow over video */}
          <span className="text-neon-blue block drop-shadow-lg">
            
          </span>
        </h1>
        
        <div 
          ref={ctaRef}
          className="flex justify-center opacity-0 transition-opacity duration-700"
        >
        
        </div>
      </div>


    </section>
  );
};

export default HeroSection;