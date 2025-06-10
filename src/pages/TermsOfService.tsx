import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useLocation } from "react-router-dom";

const TermsOfService: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 mt-16 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-electric-violet bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-soft-blue-gray text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-soft-blue-gray space-y-8">
            
            {/* Introduction */}
            <section className="bg-grid-purple/20 p-6 rounded-lg border border-neon-blue/10">
              <h2 className="text-2xl font-bold text-neon-blue mb-4">Agreement to Terms</h2>
              <p className="leading-relaxed">
                These Terms of Service ("Terms") govern your use of Divgaze's services and website. By accessing 
                our services, you agree to be bound by these Terms. If you disagree with any part of these terms, 
                you may not access our services. Divgaze operates from Sri Lanka and Australia, providing digital 
                transformation solutions worldwide.
              </p>
            </section>

            {/* Services Description */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Our Services</h2>
              <p className="mb-4">Divgaze provides the following digital services:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="border-l-4 border-neon-blue pl-4">
                    <h4 className="font-semibold text-neon-blue">Development Services</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Web & Mobile App Development</li>
                      <li>• Custom Software Solutions</li>
                      <li>• SaaS & E-commerce Platforms</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-electric-violet pl-4">
                    <h4 className="font-semibold text-electric-violet">AI & Analytics</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• AI & Data Analytics Solutions</li>
                      <li>• AI-Generated Content & Influencers</li>
                      <li>• AI Optimization for Teams</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-cyber-pink pl-4">
                    <h4 className="font-semibold text-cyber-pink">Creative Services</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Digital Marketing</li>
                      <li>• Graphic Design & Video Editing</li>
                      <li>• Social Media Management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">User Responsibilities</h2>
              <h3 className="text-xl font-semibold text-neon-blue mb-3">You agree to:</h3>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Provide accurate and complete information for service delivery</li>
                <li>Respond promptly to requests for clarification or approval</li>
                <li>Make timely payments according to agreed terms</li>
                <li>Respect intellectual property rights of third parties</li>
                <li>Use our services in compliance with applicable laws</li>
                <li>Maintain confidentiality of login credentials and account information</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">You agree NOT to:</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Use our services for illegal or unauthorized purposes</li>
                <li>Violate any laws or regulations in your jurisdiction</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Resell or redistribute our AI-generated content without permission</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="bg-grid-purple/20 p-6 rounded-lg border border-electric-violet/10">
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-neon-blue mb-3">Our Intellectual Property</h3>
              <p className="mb-4">Divgaze retains ownership of:</p>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Our proprietary software, algorithms, and methodologies</li>
                <li>Our AI models and training data</li>
                <li>Our brand, trademarks, and marketing materials</li>
                <li>General knowledge and techniques developed during projects</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">Client-Owned Content</h3>
              <p className="mb-4">Upon full payment, clients receive:</p>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Full rights to custom-developed software and applications</li>
                <li>Usage rights to AI-generated content created specifically for their brand</li>
                <li>Rights to marketing materials and creative assets produced</li>
                <li>Source code and documentation for custom development projects</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">AI-Generated Content</h3>
              <p>AI-generated content, including virtual influencers, images, and videos, is licensed to clients for their specified use cases. Commercial rights are transferred upon completion and payment, subject to applicable AI platform terms.</p>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Payment Terms and Billing</h2>
              
              <h3 className="text-xl font-semibold text-neon-blue mb-3">Payment Schedule</h3>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Project payments: 50% upfront, 50% upon completion (unless otherwise agreed)</li>
                <li>Monthly retainers: Billed in advance on the same date each month</li>
                <li>Additional work: Billed upon completion or monthly</li>
                <li>Rush projects: May incur additional fees (25-50% surcharge)</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">Payment Methods</h3>
              <p className="mb-4">We accept payments via:</p>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Bank transfers (preferred for international clients)</li>
                <li>Online payment platforms (PayPal, Stripe)</li>
                <li>Local banking systems in Sri Lanka and Australia</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">Late Payments</h3>
              <p>Invoices are due within 30 days. Late payments may incur a 2% monthly service charge and may result in suspension of services until payment is received.</p>
            </section>

            {/* Project Delivery */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Project Delivery and Timelines</h2>
              
              <h3 className="text-xl font-semibold text-neon-blue mb-3">Delivery Timelines</h3>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Project timelines are estimates and may vary based on project complexity</li>
                <li>Client feedback and approval delays may extend project timelines</li>
                <li>We provide regular progress updates and milestone deliveries</li>
                <li>Final delivery requires client approval and full payment</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">Revisions and Changes</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Minor revisions are included in the original scope</li>
                <li>Major changes or scope additions will be quoted separately</li>
                <li>We provide up to 3 rounds of revisions for design work</li>
                <li>Additional revisions are billed at our current hourly rate</li>
              </ul>
            </section>

            {/* AI-Specific Terms */}
            <section className="bg-grid-purple/20 p-6 rounded-lg border border-neon-blue/10">
              <h2 className="text-2xl font-bold text-neon-blue mb-4">AI Services Specific Terms</h2>
              
              <h3 className="text-xl font-semibold text-electric-violet mb-3">AI Content Generation</h3>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>AI-generated content quality depends on input data and specifications provided</li>
                <li>We cannot guarantee specific outcomes from AI generation processes</li>
                <li>Multiple iterations may be required to achieve desired results</li>
                <li>AI content is subject to platform limitations and ethical guidelines</li>
              </ul>

              <h3 className="text-xl font-semibold text-electric-violet mb-3">Virtual Influencer Services</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Virtual influencers are created for specified brand use cases</li>
                <li>Personality traits and appearance are customizable within technical limitations</li>
                <li>Social media performance cannot be guaranteed</li>
                <li>Ongoing content creation services are available separately</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Limitation of Liability</h2>
              <p className="mb-4">To the fullest extent permitted by law:</p>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Our total liability shall not exceed the amount paid for the specific service</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>We disclaim warranties of merchantability and fitness for particular purposes</li>
                <li>Client assumes responsibility for backup and data security</li>
                <li>We are not liable for third-party service failures or AI platform limitations</li>
              </ul>
              
              <p className="text-sm bg-yellow-500/10 border border-yellow-500/20 p-4 rounded">
                <strong>Important:</strong> Some jurisdictions do not allow limitation of liability. These limitations may not apply to you.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Termination</h2>
              
              <h3 className="text-xl font-semibold text-neon-blue mb-3">Termination by Client</h3>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>30-day written notice required for ongoing services</li>
                <li>Payment due for all work completed to date</li>
                <li>Cancellation fees may apply for projects in progress</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">Termination by Divgaze</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>We may terminate for non-payment or breach of terms</li>
                <li>30-day notice for convenience termination</li>
                <li>Immediate termination for illegal use or security violations</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Governing Law and Jurisdiction</h2>
              <p className="mb-4">These Terms are governed by:</p>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Sri Lankan law for clients primarily served from our Sri Lankan operations</li>
                <li>Australian law for clients primarily served from our Australian operations</li>
                <li>Disputes will be resolved in the jurisdiction of the primary service location</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-neon-blue mb-3">Dispute Resolution</h3>
              <p>We encourage good faith negotiations to resolve disputes. If necessary, disputes will be resolved through binding arbitration in the appropriate jurisdiction.</p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be posted on our website 
                and take effect 30 days after posting. Continued use of our services after changes constitutes 
                acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-grid-purple/20 p-6 rounded-lg border border-neon-blue/10">
              <h2 className="text-2xl font-bold text-neon-blue mb-4">Contact Information</h2>
              <p className="mb-4">For questions about these Terms of Service, please contact us:</p>
              <div className="space-y-2">
                <p><strong>Email:</strong> divgaze@gmail.com</p>
                <p><strong>Sri Lanka Office:</strong> +94 707 616 554</p>
                <p><strong>Australia Office:</strong> +61 408 840 996</p>
              </div>
              <p className="mt-4 text-sm">
                For legal inquiries, please include "Terms of Service" in your subject line.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Severability</h2>
              <p className="leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, the remaining 
                provisions will continue in full force and effect. The unenforceable provision will be 
                replaced with an enforceable provision that most closely reflects the original intent.
              </p>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;