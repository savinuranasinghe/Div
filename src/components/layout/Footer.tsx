import React from "react";
import { useLocation } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the home page
    if (location.pathname === '/') {
      // We're on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // We're on another page, navigate to home page with hash
      window.location.href = `/#${sectionId}`;
    }
  };

  const handleSocialClick = (platform: string) => {
    // Add your actual social media URLs here
    const socialUrls = {
      facebook: 'https://facebook.com/divgaze',
      tiktok: 'https://www.tiktok.com/@__.raini.___',
      instagram: 'https://instagram.com/divgaze',
      youtube: 'https://youtube.com/divgaze'
    };
    
    // For now, console.log - replace with actual URLs when ready
    console.log(`${platform} clicked`);
    // window.open(socialUrls[platform], '_blank');
  };

  return (
    <footer className="bg-deep-navy-blue border-t border-grid-purple/20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-neon-blue/0 via-neon-blue/50 to-neon-blue/0"></div>
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-electric-violet/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          
          {/* Company Info Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="inline-block mb-4">
              <span className="text-2xl font-bold text-gradient">
                Divgaze
              </span>
            </div>
            <p className="text-soft-blue-gray max-w-md mb-4 text-sm md:text-base leading-relaxed">
              We Take Care of Your <p>Digital Presence.</p>
            </p>
            
            {/* Mobile-optimized country flags */}
            <div className="flex gap-3 md:gap-4">
              <img 
                src="/assets/sl.png" 
                alt="Sri Lanka Office" 
                className="w-12 h-10 md:w-16 md:h-14 object-cover rounded shadow-sm hover:scale-110 transition-transform duration-300"
              />
              <img 
                src="/assets/aus.png" 
                alt="Australia Office" 
                className="w-12 h-10 md:w-16 md:h-14 object-cover rounded shadow-sm hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="font-semibold mb-4 text-neon-blue text-base md:text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-soft-blue-gray hover:text-neon-blue transition-colors text-left text-sm md:text-base py-1 min-h-[44px] md:min-h-0 flex items-center w-full"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-soft-blue-gray hover:text-neon-blue transition-colors text-left text-sm md:text-base py-1 min-h-[44px] md:min-h-0 flex items-center w-full"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-soft-blue-gray hover:text-neon-blue transition-colors text-left text-sm md:text-base py-1 min-h-[44px] md:min-h-0 flex items-center w-full"
                >
                  Services
                </button>
              </li>
              <li>
                <a 
                  href="/why-ai" 
                  className="text-soft-blue-gray hover:text-neon-blue transition-colors text-sm md:text-base py-1 min-h-[44px] md:min-h-0 flex items-center"
                >
                  AI Services
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-soft-blue-gray hover:text-neon-blue transition-colors text-left text-sm md:text-base py-1 min-h-[44px] md:min-h-0 flex items-center w-full"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media Section - New */}
          <div>
            <h3 className="font-semibold mb-4 text-electric-violet text-base md:text-lg">Follow Us</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Facebook */}
              <button 
                onClick={() => handleSocialClick('facebook')}
                className="w-10 h-10 md:w-12 md:h-12 bg-blue-600/20 hover:bg-blue-600/40 rounded-full transition-all duration-300 hover:scale-110 group flex items-center justify-center"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 md:w-6 md:h-6 text-blue-400 group-hover:text-blue-300" />
              </button>
              
              {/* TikTok */}
              <button 
                onClick={() => handleSocialClick('tiktok')}
                className="w-10 h-10 md:w-12 md:h-12 bg-gray-800/20 hover:bg-gray-800/40 rounded-full transition-all duration-300 hover:scale-110 group flex items-center justify-center"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </button>
              
              {/* Instagram */}
              <button 
                onClick={() => handleSocialClick('instagram')}
                className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 rounded-full transition-all duration-300 hover:scale-110 group flex items-center justify-center"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 md:w-6 md:h-6 text-pink-400 group-hover:text-pink-300" />
              </button>
              
              {/* YouTube */}
              <button 
                onClick={() => handleSocialClick('youtube')}
                className="w-10 h-10 md:w-12 md:h-12 bg-red-600/20 hover:bg-red-600/40 rounded-full transition-all duration-300 hover:scale-110 group flex items-center justify-center"
                aria-label="Follow us on YouTube"
              >
                <Youtube className="w-5 h-5 md:w-6 md:h-6 text-red-400 group-hover:text-red-300" />
              </button>
            </div>
          </div>
          
          {/* Legal Section */}
          <div>
            <h3 className="font-semibold mb-4 text-cyber-pink text-base md:text-lg">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/privacy" 
                  className="text-soft-blue-gray hover:text-cyber-pink transition-colors text-sm md:text-base py-1 min-h-[44px] md:min-h-0 flex items-center"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  className="text-soft-blue-gray hover:text-cyber-pink transition-colors text-sm md:text-base py-1 min-h-[44px] md:min-h-0 flex items-center"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-grid-purple/20 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
          <p className="text-soft-blue-gray text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Divgaze. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;