import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

const ServiceModal = ({ service, isOpen, onClose }) => {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay content animation to allow modal to scale first
      const timer = setTimeout(() => setContentVisible(true), 200);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`
            relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
            bg-gradient-to-br from-grid-purple/90 to-deep-navy-blue/90
            backdrop-blur-xl border-2 border-electric-violet/30
            rounded-2xl shadow-[0_0_50px_rgba(138,43,226,0.3)]
            transform transition-all duration-500 ease-out
            ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-10 left-10 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-neon-blue rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-electric-violet rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-10 right-10 w-1 h-1 bg-neon-blue rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-electric-violet/20 hover:bg-electric-violet/40 transition-colors duration-300 group"
          >
            <X className="w-5 h-5 text-electric-violet group-hover:text-white" />
          </button>

          <div className="p-8 md:p-12">
            {/* Header with animated icon */}
            <div className={`flex items-center gap-6 mb-8 transform transition-all duration-700 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className={`p-4 bg-neon-blue/20 rounded-xl flex items-center justify-center transition-all duration-500 ${contentVisible ? 'scale-100' : 'scale-0'}`}>
                <div className="scale-150">
                  {service.icon}
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent">
                  {service.title}
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-neon-blue to-electric-violet rounded-full mt-2"></div>
              </div>
            </div>

            {/* Description with typewriter effect */}
            <div className={`mb-8 transform transition-all duration-700 delay-200 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <p className="text-lg md:text-xl text-soft-blue-gray leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Features and Technologies Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Features */}
              <div className={`transform transition-all duration-700 delay-400 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <h3 className="text-xl font-semibold text-neon-blue mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {service.features?.map((feature, index) => (
                    <li 
                      key={index} 
                      className={`flex items-center gap-3 transform transition-all duration-500 ${contentVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                      style={{transitionDelay: `${600 + index * 100}ms`}}
                    >
                      <div className="w-1.5 h-1.5 bg-electric-violet rounded-full"></div>
                      <span className="text-soft-blue-gray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technologies */}
              <div className={`transform transition-all duration-700 delay-500 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <h3 className="text-xl font-semibold text-electric-violet mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-electric-violet rounded-full"></div>
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies?.map((tech, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-2 bg-electric-violet/20 text-electric-violet rounded-lg text-sm border border-electric-violet/30 transform transition-all duration-500 ${contentVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                      style={{transitionDelay: `${700 + index * 100}ms`}}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-700 delay-700 ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <button 
                onClick={() => {
                  // Scroll to contact section
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }
                }}
                className="flex-1 bg-gradient-to-r from-neon-blue to-electric-violet text-white px-6 py-4 rounded-lg font-semibold hover:from-electric-violet hover:to-neon-blue transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
              >
                Get Started with This Service
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button 
                onClick={onClose}
                className="px-6 py-4 border-2 border-electric-violet/50 text-electric-violet rounded-lg font-semibold hover:bg-electric-violet/10 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceModal;