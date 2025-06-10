import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";

const ContactSection: React.FC = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hello Divgaze! I'm interested in your services.`);
    window.open(`https://wa.me/94707616554?text=${message}`, '_blank');
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Service Inquiry - Divgaze');
    const body = encodeURIComponent('Hello Divgaze,\n\nI am interested in your digital services. Please get in touch with me.\n\nBest regards,');
    window.open(`mailto:divgaze@gmail.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:+61408840996', '_self');
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-grid-purple/20 py-20 pt-32 relative overflow-hidden">
      {/* Background elements - mobile optimized */}
      <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-neon-blue/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-electric-violet/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Contact Us</h2>
        <p className="text-soft-blue-gray max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-base px-2">
          Ready to transform your vision into reality? Let's collaborate to create innovative digital solutions that elevate your business.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* WhatsApp Card */}
          <div className="bg-grid-purple/30 p-4 md:p-6 rounded-lg border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 group">
            <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 text-green-500">WhatsApp</h3>
            <div className="space-y-2 md:space-y-3">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600/20 hover:bg-green-600/40 text-green-400 hover:text-green-300 transition-all duration-300 py-2.5 md:py-2 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base min-h-[44px]"
              >
                Chat
              </button>
            </div>
            <p className="text-soft-blue-gray text-xs mt-2 md:mt-3">Click to chat directly</p>
          </div>

          {/* Phone Card */}
          <div className="bg-grid-purple/30 p-4 md:p-6 rounded-lg border border-electric-violet/20 hover:border-electric-violet/50 transition-all duration-300 hover:transform hover:scale-105 group">
            <Phone className="h-6 w-6 md:h-8 md:w-8 text-electric-violet mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-base md:text-lg font-semibold mb-2 text-electric-violet">Phone Support</h3>
            <p className="text-soft-blue-gray text-xs md:text-sm mb-2 md:mb-3">Direct line for Australian clients</p>
            <button
              onClick={handlePhoneClick}
              className="text-electric-violet hover:text-white transition-colors font-medium text-sm md:text-base break-all md:break-normal bg-electric-violet/20 hover:bg-electric-violet/40 py-2 px-3 rounded-lg w-full min-h-[44px]"
            >
              +61 408 840 996
            </button>
            <p className="text-soft-blue-gray text-xs mt-2">Melbourne, Australia</p>
          </div>
          
          {/* Email Card */}
          <div className="bg-grid-purple/30 p-4 md:p-6 rounded-lg border border-neon-blue/10 hover:border-neon-blue/30 transition-all duration-300 hover:transform hover:scale-105 group">
            <Mail className="h-6 w-6 md:h-8 md:w-8 text-neon-blue mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-base md:text-lg font-semibold mb-2 text-neon-blue">Email</h3>
            <p className="text-soft-blue-gray text-xs md:text-sm mb-2 md:mb-3">Get in touch directly</p>
            <button
              onClick={handleEmailClick}
              className="text-neon-blue hover:text-electric-violet transition-colors font-medium text-sm md:text-base break-all md:break-normal"
            >
              divgaze@gmail.com
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;