import React, { useEffect, useRef } from "react";
import LocationRipple from "./LocationRipple";

const GlobalPresenceSection: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // 📍 LOCATION COORDINATES - Easy to adjust!
  // Change these X/Y values to move the markers
  const locationMarkers = {
    colombo: {
      x: 65.5, // 65% from left (adjust this to move Colombo marker left/right)
      y: 52.3, // 62% from top (adjust this to move Colombo marker up/down)
      name: "Colombo",
      labelText: "Colombo, Sri Lanka",
      labelX: -90, // Label position X offset in pixels from ripple center
      labelY: 15   // Label position Y offset in pixels from ripple center
    },
    sydney: {
      x: 80.4, // 87% from left (adjust this to move Sydney marker left/right)  
      y: 73, // 78% from top (adjust this to move Sydney marker up/down)
      name: "Sydney",
      labelText: "Keysborough, Australia",
      labelX: -80, // Label position X offset in pixels from ripple center
      labelY: 20   // Label position Y offset in pixels from ripple center
    }
  };

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
    if (mapRef.current) observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden" style={{ backgroundColor: '#000b22' }}>
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Section Heading */}
        <div className="text-center mb-16" style={{ marginTop: '-1cm' }}>
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 opacity-0"
            style={{ 
              color: '#FFFFFF',
              textShadow: '0 0 40px rgba(0, 255, 255, 0.3)' 
            }}
          >
            Global Presence
          </h2>
        </div>

        {/* World Map Container - Large and Centered */}
        <div 
          ref={mapRef}
          className="relative opacity-0"
        >
          <div className="world-map-container relative group">
            {/* Map Container - No Border, Bigger Size */}
            <div className="relative">
              
              {/* Map Image - Much Larger */}
              <div className="relative overflow-hidden rounded-xl">
                {/* Image and Ripples Container - Scale together */}
                <div className="relative transform transition-transform duration-700 group-hover:scale-105">
                  <img 
                    src="/assets/map.png" 
                    alt="Digital World Map" 
                    className="w-full h-auto max-w-none"
                    style={{ 
                      minHeight: '500px',
                      maxHeight: '80vh',
                      objectFit: 'contain'
                    }}
                  />

                  {/* 🌊 RIPPLE EFFECTS - Now scale WITH image during hover */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Colombo Ripples */}
                    <LocationRipple 
                      x={locationMarkers.colombo.x} 
                      y={locationMarkers.colombo.y}
                      city={locationMarkers.colombo.name}
                      delay={0}
                      labelText={locationMarkers.colombo.labelText}
                      labelX={locationMarkers.colombo.labelX}
                      labelY={locationMarkers.colombo.labelY}
                    />
                    
                    {/* Sydney Ripples */}
                    <LocationRipple 
                      x={locationMarkers.sydney.x} 
                      y={locationMarkers.sydney.y}
                      city={locationMarkers.sydney.name}
                      delay={1500} // 1.5 second delay after Colombo
                      labelText={locationMarkers.sydney.labelText}
                      labelX={locationMarkers.sydney.labelX}
                      labelY={locationMarkers.sydney.labelY}
                    />
                  </div>
                </div>
              </div>

              {/* Placeholder for future markers */}
              {/* Colombo marker will be positioned here */}
              {/* Sydney marker will be positioned here */}
            </div>
          </div>
        </div>


      </div>


    </section>
  );
};

export default GlobalPresenceSection;