import React, { useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const WhyAI: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const rainiRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (introRef.current) observer.observe(introRef.current);
    if (gridRef.current) observer.observe(gridRef.current);
    if (benefitsRef.current) observer.observe(benefitsRef.current);
    if (rainiRef.current) observer.observe(rainiRef.current);

    return () => observer.disconnect();
  }, []);

  // Gallery images - replace with your actual images
  const galleryImages = [
    { src: "/assets/ai1.png", alt: "AI-generated marketing visual 1" },
    { src: "/assets/ai2.png", alt: "AI-generated marketing visual 2" },
    { src: "/assets/ai3.png", alt: "AI-generated marketing visual 3" },
    { src: "/assets/ai4.png", alt: "AI-generated marketing visual 4" },
    { src: "/assets/ai5.png", alt: "AI-generated marketing visual 5" },
    { src: "/assets/ai6.png", alt: "AI-generated marketing visual 6" },
    { src: "/assets/ai7.png", alt: "AI-generated marketing visual 7" },
    { src: "/assets/ai8.png", alt: "AI-generated marketing visual 8" },
    { src: "/assets/ai9.png", alt: "AI-generated marketing visual 9" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 mt-16">
        {/* Benefits Section - at the top */}
        <div 
          ref={benefitsRef} 
          className="bg-grid-purple/20 p-4 md:p-8 rounded-lg border border-neon-blue/30 shadow-[0_0_20px_rgba(0,255,255,0.3)] opacity-0 mb-12 md:mb-16"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-neon-blue">
            Benefits of AI-Generated Content
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-blue/20 p-1 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-blue text-sm md:text-base">Cost-Effective Production</h3>
                  <p className="text-soft-blue-gray text-sm md:text-base">Eliminate expenses related to photoshoots, studios, travel, and talent fees while maintaining professional quality.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-blue/20 p-1 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-blue text-sm md:text-base">Rapid Iteration</h3>
                  <p className="text-soft-blue-gray text-sm md:text-base">Generate and refine multiple creative concepts in hours instead of weeks, enabling faster campaign launches.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-blue/20 p-1 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-blue text-sm md:text-base">Unlimited Creativity</h3>
                  <p className="text-soft-blue-gray text-sm md:text-base">Explore creative concepts that would be impractical or impossible to capture with traditional photography or video.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-blue/20 p-1 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-blue text-sm md:text-base">Personalization at Scale</h3>
                  <p className="text-soft-blue-gray text-sm md:text-base">Create thousands of tailored visuals for different audience segments, locations, or campaigns with minimal effort.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-blue/20 p-1 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-blue text-sm md:text-base">Consistent Brand Identity</h3>
                  <p className="text-soft-blue-gray text-sm md:text-base">Ensure visual consistency across all marketing materials by applying the same style parameters to every generation.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-neon-blue/20 p-1 rounded-full flex-shrink-0">
                  <Check className="h-4 w-4 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-neon-blue text-sm md:text-base">Future-Proof Marketing</h3>
                  <p className="text-soft-blue-gray text-sm md:text-base">Stay ahead of competitors by embracing cutting-edge technology that continuously improves in quality and capabilities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet Raini Section */}
        <div 
          ref={rainiRef} 
          className="opacity-0 mb-12 md:mb-16"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-neon-blue to-cyber-pink bg-clip-text text-transparent px-2 md:px-0">
            Meet Raini – AI Influencer
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
            {/* Text column - spans 5/12 on large screens */}
            <div className="lg:col-span-5 space-y-4 md:space-y-6 px-2 md:px-0">
              <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg">
                <strong>Raini</strong> is a next-generation AI influencer born in the heart of <strong>Sri Lanka</strong> — a proud <strong>Sinhala girl</strong> blending cultural authenticity with futuristic charm.
              </p>
              <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg">
                At just <strong>22 years old</strong>, Raini embodies warmth, creativity, and quiet confidence. She represents a new era of digital influence — one that's not only visually captivating but emotionally resonant.
              </p>
              <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg">
                More than just a virtual persona, Raini is a <strong>digital storyteller</strong>. She's passionate about <strong>fashion</strong>, <strong>mindful living</strong>, and using technology to celebrate <strong>identity and innovation</strong>. Her calming energy and modern style create a strong, relatable connection with her audience — especially among Gen Z and digital-first communities.
              </p>
              <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg">
                With over <strong>100K views on TikTok</strong>, Raini has already begun to turn heads.
              </p>
              <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg">
                Whether it's:
              </p>
              <ul className="text-soft-blue-gray text-sm md:text-base lg:text-lg space-y-1 md:space-y-2 ml-4">
                <li>• Social media campaigns</li>
                <li>• Brand storytelling</li>
                <li>• Virtual appearances or product placement</li>
              </ul>
              <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg">
                Raini delivers a <strong>soulful, smart, and stylish presence</strong> that speaks to the future of digital marketing.
              </p>
              <div className="bg-grid-purple/20 p-4 md:p-6 rounded-lg border border-cyber-pink/20">
                <p className="text-cyber-pink font-semibold text-base md:text-lg mb-2">
                  Want a virtual influencer for your brand?
                </p>
                <p className="text-soft-blue-gray text-sm md:text-base">
                  We can help you create your own AI personality — fully tailored to your audience, culture, and goals.
                </p>
                <p className="text-soft-blue-gray font-medium mt-2 text-sm md:text-base">
                  Let's build the future of influence, together.
                </p>
              </div>
              
              {/* TikTok Button */}
              <div className="pt-2 md:pt-4">
                <Button asChild variant="outline" className="border-cyber-pink text-cyber-pink hover:bg-cyber-pink/10 group w-full md:w-auto">
                  <a 
                    href="https://www.tiktok.com/@__.raini.___" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    Follow Raini on TikTok
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            
            {/* Image gallery column - spans 7/12 on large screens */}
            <div className="lg:col-span-7 grid grid-cols-12 gap-3 md:gap-4 px-2 md:px-0">
              {/* Left column with 2 stacked images - spans 5/12 columns */}
              <div className="col-span-5 space-y-3 md:space-y-4">
                {/* Top image */}
                <div className="aspect-[3/4] bg-grid-purple/40 rounded-lg border border-neon-blue/20 hover:border-neon-blue/50 transition-all duration-500 overflow-hidden group shadow-[0_0_0_rgba(0,255,255,0)] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                  <img 
                    src="/assets/raini-square1.png" 
                    alt="Raini portrait" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                
                {/* Bottom image */}
                <div className="aspect-[3/4] bg-grid-purple/40 rounded-lg border border-electric-violet/20 hover:border-electric-violet/50 transition-all duration-500 overflow-hidden group shadow-[0_0_0_rgba(138,43,226,0)] hover:shadow-[0_0_15px_rgba(138,43,226,0.3)]">
                  <img 
                    src="/assets/raini-square2.png" 
                    alt="Raini lifestyle" 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
              </div>
              
              {/* Right full-height image - spans 7/12 columns */}
              <div className="col-span-7 aspect-[9/16] h-full bg-grid-purple/40 rounded-lg border border-cyber-pink/20 hover:border-cyber-pink/50 transition-all duration-500 overflow-hidden group shadow-[0_0_0_rgba(255,46,245,0)] hover:shadow-[0_0_15px_rgba(255,46,245,0.3)]">
                <img 
                  src="/assets/raini-tiktok.jpg" 
                  alt="Raini in a TikTok format" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div 
          ref={gridRef} 
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12 md:mb-16 opacity-0"
        >
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square bg-grid-purple/40 rounded-lg border border-neon-blue/20 hover:border-neon-blue/50 transition-all duration-500 overflow-hidden group shadow-[0_0_0_rgba(0,255,255,0)] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* Introduction Section - at the bottom */}
        <div 
          ref={introRef} 
          className="opacity-0 mb-8 md:mb-16 max-w-3xl mx-4 md:mx-0"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent">
            The Future of Visual Marketing
          </h2>
          <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg mb-4 md:mb-6">
            AI-generated content is revolutionizing digital marketing by enabling brands to create 
            personalized, high-quality visuals at scale. From custom product photography to virtual 
            influencers, AI empowers marketers to deliver compelling content without the traditional 
            constraints of time, budget, or logistics.
          </p>
          <p className="text-soft-blue-gray text-sm md:text-base lg:text-lg">
            At Divgaze, we're helping forward-thinking brands leverage this transformative technology
            to stay ahead of the curve and connect with audiences in innovative ways. Contact us today
            to explore how AI-generated content can transform your marketing strategy.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default WhyAI;