import React, { useEffect, useRef, useState } from "react";

const CustomerCounterSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [showPlus, setShowPlus] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimatedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile and motion preferences
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    checkMobile();
    checkMotion();
    
    window.addEventListener('resize', checkMobile);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', checkMotion);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      motionQuery.removeEventListener('change', checkMotion);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setIsVisible(true);
          console.log('Starting animation...');
          
          // Start animation immediately
          let currentCount = 0;
          const duration = prefersReducedMotion ? 40 : (isMobile ? 60 : 80); // Faster on mobile
          
          intervalRef.current = setInterval(() => {
            currentCount++;
            console.log('Counting:', currentCount);
            setCount(currentCount);
            
            if (currentCount >= 50) {
              console.log('Reached 50, stopping...');
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              
              // Show plus and particles
              setTimeout(() => {
                setShowPlus(true);
                if (!prefersReducedMotion) {
                  setShowParticles(true);
                }
                console.log('Showing plus and particles');
              }, 300);
            }
          }, duration);
        } else if (!entry.isIntersecting) {
          setIsVisible(false);
        }
      });
    }, { threshold: 0.2 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMobile, prefersReducedMotion]);

  // Determine particle count based on device capability
  const particleCount = prefersReducedMotion ? 0 : (isMobile ? 3 : 6);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden"
      style={{ backgroundColor: '#000b22' }}
    >
      {/* Simple Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(45deg, transparent 49%, rgba(0,255,255,0.03) 50%, transparent 51%)`
        }}
      />

      {/* Optimized Particles - Only render when visible and motion allowed */}
      {showParticles && isVisible && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="particle-container">
            {Array.from({ length: particleCount }, (_, i) => (
              <div 
                key={i}
                className={`particle particle-${i + 1}`}
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white px-4">
            Trusted by Clients Worldwide
          </h2>
          <p className="text-soft-blue-gray text-base md:text-lg px-4">
            Building digital success stories across the globe
          </p>
        </div>

        {/* Responsive Counter Box */}
        <div className="text-center mb-8 md:mb-16">
          <div 
            className="relative inline-block p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl backdrop-blur-sm transition-shadow duration-700"
            style={{
              background: 'linear-gradient(135deg, rgba(40, 43, 72, 0.4) 0%, rgba(10, 15, 44, 0.6) 100%)',
              border: '2px solid rgba(0, 255, 255, 0.3)',
              boxShadow: showPlus 
                ? '0 0 60px rgba(0, 255, 255, 0.4), 0 0 120px rgba(138, 43, 226, 0.2)' 
                : '0 0 30px rgba(0, 255, 255, 0.2)',
              maxWidth: isMobile ? '90vw' : '500px',
              width: '100%',
              minWidth: '280px'
            }}
          >
            <div className="relative z-10">
              {/* Responsive Number Display */}
              <div 
                className="flex items-center justify-center"
                style={{ 
                  fontSize: 'clamp(3rem, 15vw, 14rem)',
                  fontFamily: 'Courier New, monospace',
                  lineHeight: '1.1',
                  minHeight: '1.2em'
                }}
              >
                {/* Responsive Container */}
                <div 
                  className="flex items-center justify-center text-center"
                  style={{
                    maxWidth: '100%',
                    gap: 'clamp(0.5rem, 2vw, 1rem)'
                  }}
                >
                  {/* NUMBER - Responsive Width */}
                  <span 
                    className="bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))',
                      fontFamily: 'Courier New, monospace',
                      willChange: 'contents'
                    }}
                  >
                    {count}
                  </span>
                  
                  {/* PLUS SIGN - Responsive */}
                  <span 
                    className="bg-gradient-to-r from-electric-violet to-neon-blue bg-clip-text text-transparent"
                    style={{
                      opacity: showPlus ? 1 : 0,
                      transform: showPlus ? 'scale(1)' : 'scale(0.3)',
                      transition: prefersReducedMotion ? 'opacity 0.3s ease' : 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      filter: showPlus ? 'drop-shadow(0 0 20px rgba(138, 43, 226, 0.8))' : 'none',
                      fontFamily: 'Courier New, monospace'
                    }}
                  >
                    +
                  </span>
                </div>
              </div>
              
              <div className="mt-6 md:mt-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-3">
                  Satisfied Customers
                </h3>
                <p className="text-soft-blue-gray text-base sm:text-lg md:text-xl">
                  Around the World
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerCounterSection;