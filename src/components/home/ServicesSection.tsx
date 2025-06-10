import React, { useEffect, useRef, useState } from "react";
import { Code, Smartphone, CreditCard, BarChart3, LineChart, Palette, Globe, Sparkles, Zap, X, ArrowRight } from "lucide-react";

// Service data with detailed descriptions and benefits
const servicesData = [
  {
    id: 1,
    title: "Web & Mobile App Development",
    description: "We create powerful websites and mobile applications that don't just look good—they drive real business results. Whether you need a professional business website, a customer-facing mobile app, or a complete digital platform, we build solutions that work as hard as you do, 24/7.",
    icon: <Code className="h-6 w-6 text-neon-blue" />,
    features: ["Increase Sales 24/7 - Your website and app work round the clock, even while you sleep", "Reach More Customers - Mobile-first approach captures the majority of internet users browsing on mobile devices", "Save Time & Money - Automated processes reduce manual work and operational costs", "Build Trust Instantly - Professional digital presence that makes customers confident in your business", "Stay Ahead of Competition - Modern, fast-loading platforms that outperform outdated competitors", "Data-Driven Growth - Built-in analytics show you exactly how to improve and grow", "Global Ready - Multi-language support with international payment gateways for worldwide reach"],
    technologies: ["React", "Flutter", "Node.js", "MongoDB", "Firebase"]
  },
  {
    id: 2,
    title: "Custom Software Solutions",
    description: "We build tailor-made software that fits your business like a glove—no compromises, no workarounds, no settling for 'good enough.' From streamlining complex workflows to creating entirely new business models, our custom software solutions transform your unique challenges into competitive advantages.",
    icon: <Smartphone className="h-6 w-6 text-neon-blue" />,
    features: ["Perfect Business Fit - Software designed specifically for your processes, not forcing you to adapt to generic solutions", "Competitive Advantage - Unique capabilities that your competitors simply can't replicate or buy off the shelf", "Scalable Growth - Solutions that evolve and expand as your business grows, without costly replacements", "Maximum Efficiency - Eliminate manual tasks and streamline operations with automation built for your exact needs", "Full Control - Own your technology stack completely, with no licensing fees or vendor dependencies", "Seamless Integration - Connects perfectly with your existing systems and tools for unified operations", "Future-Proof Investment - Built with modern architecture that adapts to new technologies and business requirements"],
    technologies: ["Python", "Java", "C#", "Cloud Services", "Docker"]
  },
  {
    id: 3,
    title: "SaaS & E-commerce",
    description: "We create subscription-based software platforms and powerful online stores that generate recurring revenue and drive sales growth. Whether you need a SaaS platform to serve multiple customers or a high-converting e-commerce store, we build scalable solutions that turn your ideas into profitable digital businesses.",
    icon: <CreditCard className="h-6 w-6 text-neon-blue" />,
    features: ["Recurring Revenue Streams - Build sustainable income through subscription models and repeat online sales", "Global Market Reach - Sell to customers worldwide with multi-currency, multi-language capabilities", "Automated Operations - Handle orders, subscriptions, and customer management with minimal manual intervention", "Data-Driven Insights - Advanced analytics reveal customer behavior and optimize your sales strategies", "Scalable Infrastructure - Handle growing customer bases and transaction volumes without performance issues", "Secure Payment Processing - Multiple payment gateways ensure safe, smooth transactions for your customers", "Mobile-Optimized Experience - Capture sales from the majority of users shopping on mobile devices"],
    technologies: ["AWS", "Stripe", "PayPal", "Kubernetes", "Redis"]
  },
  {
    id: 4,
    title: "AI & Data Analytics Solutions",
    description: "We transform your business data into intelligent insights and automated decisions using cutting-edge AI technology. From AI chatbots and virtual assistants that handle customer service 24/7, to computer vision solutions that automate visual tasks, voice recognition tools, and marketing performance dashboards—we help you make smarter decisions faster and automate complex processes that drive real business growth.",
    icon: <BarChart3 className="h-6 w-6 text-neon-blue" />,
    features: ["Predictive Decision Making - Forecast trends, customer behavior, and market opportunities before they happen", "Automated Intelligence - AI handles complex tasks and decisions, freeing your team for strategic work", "Real-Time Business Insights - Interactive dashboards reveal hidden patterns and opportunities in your data", "Competitive Advantage - AI-powered capabilities that most competitors don't have access to", "Cost Reduction - Automate expensive manual processes and optimize resource allocation", "Customer Understanding - Deep insights into customer preferences and behavior patterns", "Risk Mitigation - Early warning systems identify potential problems before they impact your business"],
    technologies: ["TensorFlow", "Python", "Power BI", "Tableau", "Apache Spark"]
  },
  {
    id: 5,
    title: "Digital Marketing",
    description: "We create comprehensive digital marketing strategies that turn online visibility into measurable business growth. From search engine optimization and social media campaigns to paid advertising and content marketing, we use data-driven approaches to reach your ideal customers, build brand authority, and convert prospects into loyal customers across all digital channels.",
    icon: <LineChart className="h-6 w-6 text-neon-blue" />,
    features: ["Increased Online Visibility - Dominate search results and social media to be found by customers actively looking for your services", "Targeted Customer Acquisition - Reach precisely the right audience with laser-focused campaigns that maximize conversion rates", "Measurable ROI - Track every dollar spent with detailed analytics showing exactly which strategies drive sales", "Brand Authority Building - Establish your business as the trusted expert in your industry through strategic content", "Multi-Channel Presence - Consistent messaging across all platforms where your customers spend time", "Cost-Effective Growth - Generate more leads and sales for less than traditional advertising methods", "Automated Lead Generation - Marketing systems that work continuously to bring in qualified prospects"],
    technologies: ["Google Analytics", "SEMrush", "HubSpot", "Meta Ads", "Google Ads"]
  },
  {
    id: 6,
    title: "Graphic Designing and Video Editing Services",
    description: "We create stunning visual content that captures attention, communicates your message, and drives action. From brand identities and marketing materials to professional videography (available in Sri Lanka and Australia), engaging video content, and social media graphics, we transform your ideas into powerful visual stories that resonate with your audience and elevate your brand above the competition.",
    icon: <Palette className="h-6 w-6 text-neon-blue" />,
    features: ["Professional Brand Image - Polished visuals that instantly build credibility and trust with your audience", "Increased Engagement - Eye-catching designs and videos that stop scrolling and drive interaction", "Consistent Brand Identity - Cohesive visual language across all platforms that strengthens brand recognition", "Higher Conversion Rates - Compelling visuals that guide customers toward purchasing decisions", "Social Media Impact - Share-worthy content that amplifies your reach and builds community", "Professional Production Quality - High-end videography and editing that rivals major brand campaigns", "Cost-Effective Content - Professional-quality visuals and video production without the overhead of in-house teams"],
    technologies: ["Adobe Creative Suite", "After Effects", "Cinema 4D", "Figma", "DaVinci Resolve"]
  },
  {
    id: 7,
    title: "Website/Social Media Handling",
    description: "We take complete ownership of your digital presence, managing your website performance and social media channels so you can focus on running your business. From content creation and community engagement to technical maintenance and performance optimization, we ensure your online presence works 24/7 to attract customers and build your brand.",
    icon: <Globe className="h-6 w-6 text-neon-blue" />,
    features: ["Consistent Online Presence - Regular, engaging content that keeps your brand visible and relevant", "Professional Management - Expert handling of all technical updates, security, and performance optimization", "Community Building - Active engagement with your audience that builds loyalty and drives word-of-mouth marketing", "Time Freedom - Focus on your core business while we handle all digital marketing tasks", "Performance Monitoring - Continuous tracking and optimization to improve results and ROI", "Crisis Management - Quick response to any issues or negative feedback to protect your reputation", "Growth-Focused Strategy - Data-driven content and campaigns designed to increase followers and conversions"],
    technologies: ["WordPress", "Shopify", "Social Media APIs", "Analytics Tools", "Buffer"]
  },
  {
    id: 8,
    title: "AI-Generated Services",
    description: "We harness cutting-edge artificial intelligence to create stunning content at scale without traditional production costs. From AI-generated influencers and product photography to AI video creation and custom voice & avatar generation, we deliver high-quality digital assets that revolutionize how you create and distribute content for your brand.",
    icon: <Sparkles className="h-6 w-6 text-neon-blue" />,
    features: ["Unlimited Content Creation - Generate endless variations of photos, videos, and promotional materials without scheduling shoots", "Cost-Effective Production - Eliminate expensive photography, videography, and talent costs while maintaining professional quality", "Brand Consistency - AI ensures perfect brand alignment across all generated content and messaging", "Rapid Turnaround - Create campaign assets in hours instead of weeks, enabling faster market response", "Scalable Personalization - Generate customized content for different audiences and markets simultaneously", "Creative Flexibility - Experiment with unlimited concepts and styles without additional production costs", "Future-Proof Marketing - Stay ahead with cutting-edge technology that most competitors haven't adopted yet"],
    technologies: ["OpenAI", "Midjourney", "Stable Diffusion", "Custom AI Models", "GPT-4"]
  },
  {
    id: 9,
    title: "Work Smarter: AI Optimization for Teams",
    description: "We transform how your team works by implementing intelligent AI solutions that automate repetitive tasks, streamline workflows, and enhance decision-making processes. From process analysis and custom AI tool integration to comprehensive team education on AI tools like ChatGPT and productivity optimization strategies, we help your organization achieve more with less effort while maintaining the human touch that drives innovation.",
    icon: <Zap className="h-6 w-6 text-neon-blue" />,
    features: ["Massive Time Savings - Automate routine tasks so your team focuses on high-value strategic work that drives growth", "Increased Productivity - AI-powered workflows that eliminate bottlenecks and accelerate project completion", "Enhanced Decision Making - Data-driven insights and AI recommendations that improve business choices", "Reduced Operational Costs - Lower overhead through intelligent automation and optimized resource allocation", "Competitive Advantage - AI capabilities that give you an edge over competitors still using manual processes", "AI Skills Training - Educate your team on effectively using AI tools like ChatGPT and other productivity platforms to maximize efficiency", "Process Optimization - Identify time-wasting activities and implement smart solutions that save hours of manual work daily", "Improved Employee Satisfaction - Remove tedious tasks so teams can focus on creative and meaningful work"],
    technologies: ["Zapier", "Microsoft Power Automate", "Custom AI", "API Integrations", "Slack Bots"]
  }
];

const ServiceModal = ({ service, isOpen, onClose }) => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay content animation to allow modal to scale first
      const timer = setTimeout(() => setContentVisible(true), 200);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      setContentVisible(false);
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !service) return null;

  return (
    <>
      {/* Backdrop with glassmorphism effect */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
        <div 
          className={`
            relative w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto
            bg-gradient-to-br from-grid-purple/70 to-deep-navy-blue/70
            backdrop-blur-xl border-2 border-neon-blue/40
            rounded-lg md:rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.4)]
            transform transition-all duration-500 ease-out
            ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - Fixed for mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 rounded-full bg-neon-blue/20 hover:bg-neon-blue/40 transition-colors duration-300 group min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 text-neon-blue group-hover:text-white" />
          </button>

          <div className="p-4 md:p-8 lg:p-12">
            {/* Header with animated icon */}
            <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8 transform transition-all duration-700 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className={`p-3 md:p-4 bg-neon-blue/20 rounded-xl flex items-center justify-center transition-all duration-500 ${contentVisible ? 'scale-100' : 'scale-0'}`}>
                <div className="scale-125 md:scale-150">
                  {service.icon}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent">
                  {service.title}
                </h2>
                <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-neon-blue to-electric-violet rounded-full mt-2"></div>
              </div>
            </div>

            {/* Description with typewriter effect */}
            <div className={`mb-6 md:mb-8 transform transition-all duration-700 delay-200 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="text-sm md:text-base leading-relaxed text-soft-blue-gray">
                {service.description}
              </p>
            </div>

            {/* Benefits Section */}
            <div className="mb-6 md:mb-8">
              <div className={`transform transition-all duration-700 delay-400 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <h3 className="text-lg md:text-xl font-semibold text-neon-blue mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                  Benefits You Get
                </h3>
                <ul className="space-y-3">
                  {service.features?.map((feature, index) => (
                    <li 
                      key={index} 
                      className={`flex items-start gap-3 transform transition-all duration-500 ${contentVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                      style={{transitionDelay: `${600 + index * 100}ms`}}
                    >
                      <div className="w-1.5 h-1.5 bg-electric-violet rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-soft-blue-gray leading-relaxed text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Why Collaborate Section */}
            <div className={`mb-6 md:mb-8 transform transition-all duration-700 delay-500 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="p-4 md:p-6 bg-gradient-to-r from-neon-blue/10 to-electric-violet/10 rounded-lg border border-neon-blue/20">
                <h3 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent mb-3">
                  Why Collaborate with Us?
                </h3>
                <p className="text-soft-blue-gray leading-relaxed text-sm md:text-base">
                  We go <span className="text-neon-blue font-semibold">Beyond Boundaries</span> to create future-ready solutions that don't just meet today's needs—they anticipate tomorrow's opportunities. Our passion drives us to build transformative digital experiences that push the limits of what's possible, ensuring your business stays ahead while competitors catch up.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className={`flex flex-col gap-3 md:gap-4 transform transition-all duration-700 delay-600 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <button 
                onClick={() => {
                  // Scroll to contact section
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }
                }}
                className="w-full bg-gradient-to-r from-neon-blue to-electric-violet text-white px-4 md:px-6 py-3 md:py-4 rounded-lg font-semibold hover:from-electric-violet hover:to-neon-blue transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group text-sm md:text-base"
              >
                Get Started with This Service
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, index, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              cardRef.current?.classList.add("animate-fade-in");
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [index]);

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className="bg-grid-purple/20 border border-electric-violet/10 rounded-lg p-4 md:p-6 hover:transform hover:scale-105 transition-all duration-300 group opacity-0 hover:border-electric-violet/30 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)] cursor-pointer min-h-[120px] md:min-h-[140px]"
    >
      <div className="p-2 md:p-3 bg-neon-blue/10 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-neon-blue/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-bold mb-2">{title}</h3>
      <p className="text-soft-blue-gray text-sm md:text-base">Click to learn more about this service</p>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (descriptionRef.current) observer.observe(descriptionRef.current);

    return () => observer.disconnect();
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 pt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 opacity-0"
          >
            Our Services
          </h2>
          <p 
            ref={descriptionRef}
            className="text-soft-blue-gray max-w-2xl mx-auto opacity-0"
          >
            We offer a comprehensive range of digital services to help your business thrive in the digital landscape.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              title={service.title}
              description="Click to learn more about this service"
              icon={service.icon}
              index={index}
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default ServicesSection;