import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Scroll spy functionality
      const sections = ['home', 'services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActiveSection(sectionId);
    }
    // Auto-close mobile menu after navigation
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  const isActiveLink = (id: string) => {
    return activeSection === id;
  };

  return (
    <nav
      className={`fixed w-full transition-all duration-300 ${
        isScrolled ? "bg-deep-navy-blue/90 backdrop-blur-md shadow-md" : "bg-transparent"
      } ${mobileMenuOpen ? "z-[9998]" : "z-50"}`}
    >
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => scrollToSection('home')}
          className="flex items-center relative"
        >
          <span className="text-3xl font-bold text-neon-blue">
            DivGaze
          </span>
        </button>

        {/* Desktop Navigation - Centered */}
        {!isMobile && (
          <>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-sm font-medium transition-colors hover:text-neon-blue relative group ${
                      isActiveLink(link.id) ? "text-neon-blue" : ""
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-neon-blue rounded-full transition-transform duration-300 origin-left ${
                      isActiveLink(link.id) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="outline" 
                className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 group"
              >
                Get a Quote
              </Button>
            </div>
          </>
        )}

        {/* Mobile Navigation Toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative min-h-[48px] min-w-[48px]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="text-neon-blue h-6 w-6" />
            ) : (
              <Menu className="text-neon-blue h-6 w-6" />
            )}
          </Button>
        )}
      </div>

      {/* Mobile Menu Overlay - Completely independent of navbar */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
          
          {/* Mobile Menu Content */}
          <div className="absolute inset-0 flex justify-end" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {/* Menu Panel */}
            <div 
              className="flex h-full w-full max-w-sm flex-col overflow-y-auto bg-deep-navy-blue/95 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-out"
              style={{ 
                position: 'relative',
                transform: 'translateX(0)',
                maxWidth: '320px',
                width: '100%',
                height: '100vh',
                overflowY: 'auto'
              }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-grid-purple/30" style={{ flexShrink: 0 }}>
                <span className="text-xl font-bold text-neon-blue">
                  DivGaze
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="min-h-[48px] min-w-[48px] rounded-full hover:bg-neon-blue/10"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6 text-neon-blue" />
                </Button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 px-6 py-8" style={{ flex: '1 1 0%', overflowY: 'auto' }}>
                <nav className="space-y-2">
                  {navLinks.map((link, index) => (
                    <button
                      key={link.name}
                      onClick={() => scrollToSection(link.id)}
                      className={`
                        w-full text-left px-4 py-4 text-lg font-medium rounded-lg
                        transition-all duration-200 min-h-[48px] flex items-center
                        relative group touch-manipulation
                        ${isActiveLink(link.id) 
                          ? "text-neon-blue bg-neon-blue/10 border-l-4 border-neon-blue" 
                          : "text-white hover:text-neon-blue hover:bg-neon-blue/5"
                        }
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        position: 'relative'
                      }}
                    >
                      <span className="relative">
                        {link.name}
                        {isActiveLink(link.id) && (
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-neon-blue rounded-full" />
                        )}
                      </span>
                      
                      {/* Touch feedback */}
                      <div className="absolute inset-0 bg-neon-blue/10 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-150" />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Menu Footer */}
              <div className="border-t border-grid-purple/30 p-6" style={{ flexShrink: 0 }}>
                <Button 
                  onClick={() => scrollToSection('contact')}
                  variant="outline" 
                  className="w-full border-neon-blue text-neon-blue hover:bg-neon-blue/10 min-h-[48px] font-medium text-base touch-manipulation"
                >
                  Get a Quote
                </Button>
                
                {/* Safe area padding for devices with notches */}
                <div className="h-[env(safe-area-inset-bottom)]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;