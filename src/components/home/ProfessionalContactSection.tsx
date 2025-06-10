import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Form validation schema
const contactFormSchema = z.object({
  from_name: z.string().min(2, "Name must be at least 2 characters"),
  from_email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_interest: z.string().min(1, "Please select a service"),
  project_type: z.string().min(1, "Please select a project type"),
  timeline: z.string().min(1, "Please select a timeline"),
  budget_range: z.string().min(1, "Please select a budget range"),
  contact_method: z.string().min(1, "Please select preferred contact method"),
  best_time: z.string().min(1, "Please select best time to contact"),
  message: z.string().min(10, "Please provide at least 10 characters describing your project"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ProfessionalContactSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      from_name: "",
      from_email: "",
      phone: "",
      company: "",
      service_interest: "",
      project_type: "",
      timeline: "",
      budget_range: "",
      contact_method: "",
      best_time: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing');
      }

      // Send email via EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        {
          ...data,
          to_email: 'divgaze@gmail.com',
        },
        publicKey
      );

      setSubmitStatus('success');
      form.reset();
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 2 business hours.",
      });

    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitStatus('error');
      
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Minimal background elements */}
      <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-neon-blue/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 bg-neon-blue/3 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-2xl lg:max-w-4xl xl:max-w-5xl">
        {/* Centered Contact Form */}
        <Card className="bg-white/5 backdrop-blur-sm border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Us */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-8 text-center">Contact Us</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="from_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Full Name"
                              className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white placeholder:text-gray-300"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="from_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Email Address"
                              className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white placeholder:text-gray-300"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Phone Number (Optional)"
                              className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white placeholder:text-gray-300"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Company (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Company (Optional)"
                              className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white placeholder:text-gray-300"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="border-t border-neon-blue/20 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Project Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="service_interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Service Interest</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="web-development">Web Development</SelectItem>
                              <SelectItem value="mobile-app">Mobile App Development</SelectItem>
                              <SelectItem value="custom-software">Custom Software</SelectItem>
                              <SelectItem value="ai-services">AI Services</SelectItem>
                              <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                              <SelectItem value="graphic-design">Graphic Design</SelectItem>
                              <SelectItem value="consultation">Consultation</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="project_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Project Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white">
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new-project">New Project</SelectItem>
                              <SelectItem value="redesign">Redesign/Upgrade</SelectItem>
                              <SelectItem value="maintenance">Ongoing Maintenance</SelectItem>
                              <SelectItem value="consultation">Consultation Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Timeline</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="asap">ASAP (Rush)</SelectItem>
                              <SelectItem value="1-month">Within 1 month</SelectItem>
                              <SelectItem value="3-months">1-3 months</SelectItem>
                              <SelectItem value="6-months">3-6 months</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget_range"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Budget Range</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white">
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-5k">Under $5,000</SelectItem>
                              <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                              <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                              <SelectItem value="50k-plus">$50,000+</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Communication Preferences */}
                <div className="border-t border-neon-blue/20 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Communication Preferences</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="contact_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Preferred Contact Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white">
                                <SelectValue placeholder="How should we contact you?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone Call</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="best_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Best Time to Contact</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white">
                                <SelectValue placeholder="Select best time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="morning">Morning (9AM-12PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                              <SelectItem value="evening">Evening (5PM-8PM)</SelectItem>
                              <SelectItem value="anytime">Anytime</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Project Description */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your project in detail. Include any specific requirements, features, or goals you have in mind..."
                          className="bg-white/10 border-neon-blue/30 focus:border-neon-blue text-white placeholder:text-gray-300 min-h-[120px] resize-vertical"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-neon-blue/80 text-white py-4 px-6 rounded-lg text-lg font-medium transition-all duration-200 hover:bg-neon-blue/60 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </div>
                    )}
                  </button>

                  <p className="mt-4 text-center text-sm text-gray-300">
                    You will receive a response within 2 hours during business hours.
                  </p>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-500">Message sent successfully! We'll respond within 2 hours.</span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-500">Failed to send message. Please try again or contact us directly.</span>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProfessionalContactSection;