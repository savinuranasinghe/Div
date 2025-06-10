import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedProject: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === titleRef.current || entry.target === descriptionRef.current) {
              entry.target.classList.add("animate-fade-in");
            } else if (entry.target === contentRef.current) {
              entry.target.classList.add("animate-slide-in-left");
            } else if (entry.target === mediaRef.current) {
              entry.target.classList.add("animate-slide-in-right");
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    if (mediaRef.current) observer.observe(mediaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-grid-purple/20 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-electric-violet/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 opacity-0"
          >
            AI-Generated Services
          </h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div 
            ref={contentRef}
            className="order-2 md:order-1 opacity-0"
          >
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent">Bring your brand to life with AI-powered visuals.</h3>
            <p className="text-soft-blue-gray mb-4">
                From virtual influencers to custom product photography and promotional videos, we generate high-quality content at scale with style and precision.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 group">
                <div className="h-1 w-1 bg-neon-blue rounded-full group-hover:w-2 transition-all duration-300"></div>
                <p className="group-hover:text-neon-blue transition-colors duration-300">AI Influencers: Virtual personalities for social media and brand campaigns</p>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="h-1 w-1 bg-neon-blue rounded-full group-hover:w-2 transition-all duration-300"></div>
                <p className="group-hover:text-neon-blue transition-colors duration-300">Product Photography: Hyper-realistic, studio-quality images without a physical shoot</p>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="h-1 w-1 bg-neon-blue rounded-full group-hover:w-2 transition-all duration-300"></div>
                <p className="group-hover:text-neon-blue transition-colors duration-300">Video Generation: Scripted or dynamic videos tailored to your brand identity</p>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="h-1 w-1 bg-neon-blue rounded-full group-hover:w-2 transition-all duration-300"></div>
                <p className="group-hover:text-neon-blue transition-colors duration-300">Voice & Avatar Generation: Create custom AI voices and animated avatars for product demos, tutorials, or virtual assistants available.</p>
              </div>
            </div>
            
            <Button asChild variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 group">
              <Link to="/why-ai" className="flex items-center gap-2">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          <div 
            ref={mediaRef}
            className="order-1 md:order-2 relative opacity-0"
          >
            {/* Main project image (replacing the video placeholder) */}
            <div className="aspect-video bg-grid-purple/40 rounded-lg overflow-hidden relative border border-neon-blue/20 hover:border-neon-blue/50 transition-all duration-500 group shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]">
              <img 
                src="/assets/pic1.png" 
                alt="Raini AI influencer main project showcase" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* First square image */}
              <div className="aspect-square bg-grid-purple/40 rounded-lg border border-neon-blue/20 hover:border-neon-blue/50 transition-all duration-500 overflow-hidden group shadow-[0_0_0_rgba(0,255,255,0)] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                <img 
                  src="/assets/pic2.png" 
                  alt="Raini AI influencer content example 1" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              
              {/* Second square image */}
              <div className="aspect-square bg-grid-purple/40 rounded-lg border border-electric-violet/20 hover:border-electric-violet/50 transition-all duration-500 overflow-hidden group shadow-[0_0_0_rgba(138,43,226,0)] hover:shadow-[0_0_15px_rgba(138,43,226,0.3)]">
                <img 
                  src="/assets/pic3.png" 
                  alt="Raini AI influencer content example 2" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;