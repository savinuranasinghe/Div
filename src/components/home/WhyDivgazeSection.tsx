import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, Target, Palette, Code } from "lucide-react";

const WhyDivgazeSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

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

    if (titleRef.current) observer.observe(titleRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const coreValues = [
    {
      id: "purpose",
      icon: <Target className="w-5 h-5 text-neon-blue" />,
      title: "Purpose-Driven Design",
      preview: "We craft digital experiences driven by purpose, emotion, and imagination.",
      details: "We believe great work begins by asking better questions, challenging assumptions, and creating with clear intent. Every pixel, every interaction, every line of code serves a meaningful purpose."
    },
    {
      id: "innovation",
      icon: <Lightbulb className="w-5 h-5 text-electric-violet" />,
      title: "Boundary-Pushing Innovation",
      preview: "We push boundaries — both creatively and technically — to build work that's meaningful.",
      details: "We're not interested in building just another product. We create solutions that are lasting, made for the future, and designed to give you competitive advantages that others simply can't replicate."
    },
    {
      id: "passion",
      icon: <Palette className="w-5 h-5 text-cyber-pink" />,
      title: "Deep Passion & Craft",
      preview: "We blend intuition with research, creativity with data, storytelling with code.",
      details: "Above all, we're deeply passionate about what we do. The best ideas live where art meets logic, where technical excellence meets creative vision, where innovation serves real human needs."
    },
    {
      id: "partnership",
      icon: <Code className="w-5 h-5 text-neon-blue" />,
      title: "Lasting Partnerships",
      preview: "Those who work with Divgaze return — not just for what we create, but how we create it.",
      details: "We don't just deliver projects; we build relationships. Our clients become partners in innovation, collaborators in pushing the boundaries of what's possible."
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-10 px-4 md:py-20 md:px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-electric-violet/5 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-neon-blue/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10 max-w-6xl">
        <h2 
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-16 opacity-0 bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent"
        >
          About Us
        </h2>
        
        <div 
          ref={contentRef}
          className="relative inline-block p-4 sm:p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl backdrop-blur-sm transition-shadow duration-700 opacity-0 w-full max-w-5xl my-4 md:my-0"
          style={{
            background: 'linear-gradient(135deg, rgba(40, 43, 72, 0.4) 0%, rgba(10, 15, 44, 0.6) 100%)',
            border: '2px solid rgba(0, 255, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
          }}
        >
          {/* Who We Are Section */}
          <div className="mb-6 md:mb-12">
            <h3 className="text-neon-blue font-semibold text-xl sm:text-2xl md:text-3xl mb-4">
              Who We Are
            </h3>
            <div className="text-soft-blue-gray text-sm sm:text-base md:text-lg leading-relaxed text-left space-y-4 mx-2 md:mx-0">
              <p>
                We're <span className="font-semibold">Divgaze</span> - a passionate, creative tech startup based in Sri Lanka, with deep roots extending to Melbourne, Australia.
              </p>
              <p>
                At our core, we're a team of curious builders and bold thinkers who believe in creating digital experiences that truly make a difference. We're not just here to deliver services, we're here to <span className="font-semibold">partner with you</span>, challenge ideas, and bring visions to life.
              </p>
              <p>
                What sets us apart? We put <span className="font-semibold">our clients first</span> — always. We dive deep into every project, explore every angle, and give our absolute best to craft solutions that are smart, scalable, and meaningful.
              </p>
              <p>
                We embrace <span className="font-semibold">experimentation</span>. We welcome <span className="font-semibold">risk</span>. Because we know real innovation happens outside the comfort zone.
              </p>
            </div>
          </div>

          {/* Why Choose Divgaze Transition */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-neon-blue font-semibold text-lg sm:text-xl md:text-2xl mb-4">
              Why Choose Divgaze?
            </h3>
            <p className="text-soft-blue-gray text-sm sm:text-base md:text-lg leading-relaxed mx-2 md:mx-0">
              We don't just deliver projects — we craft digital experiences that transform possibilities into realities.
            </p>
          </div>

          {/* Core Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 text-left mb-6 md:mb-8 mx-2 md:mx-0">
            {coreValues.map((value, index) => (
              <div 
                key={value.id}
                className="group"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div 
                  className="bg-gradient-to-br from-grid-purple/30 to-deep-navy-blue/40 p-3 md:p-6 rounded-lg border border-electric-violet/20 hover:border-electric-violet/40 transition-all duration-300 cursor-pointer"
                  onClick={() => toggleSection(value.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-electric-violet/20 rounded-lg">
                        {value.icon}
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-white leading-tight">
                        {value.title}
                      </h3>
                    </div>
                    <button className="flex-shrink-0 p-1 hover:bg-electric-violet/20 rounded transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center md:min-h-0 md:min-w-0">
                      {expandedSections[value.id] ? 
                        <ChevronUp className="w-5 h-5 text-electric-violet" /> : 
                        <ChevronDown className="w-5 h-5 text-electric-violet" />
                      }
                    </button>
                  </div>

                  {/* Preview Text */}
                  <p className="text-soft-blue-gray text-sm md:text-base leading-relaxed mb-3">
                    {value.preview}
                  </p>

                  {/* Expandable Details */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    expandedSections[value.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-3 border-t border-electric-violet/20">
                      <p className="text-soft-blue-gray text-sm md:text-base leading-relaxed">
                        {value.details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-4 md:pt-6 border-t border-electric-violet/20 mx-2 md:mx-0">
            <div className="bg-gradient-to-r from-neon-blue/10 to-electric-violet/10 p-3 md:p-6 rounded-lg border border-neon-blue/20">
              <p className="text-neon-blue font-semibold text-lg md:text-xl mb-2 text-center">
                We Take Care of Your Digital Presence
              </p>
              <p className="text-soft-blue-gray text-sm md:text-base text-center leading-relaxed">
                Let's collaborate to create digital experiences that don't just meet today's needs—they anticipate tomorrow's opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDivgazeSection;