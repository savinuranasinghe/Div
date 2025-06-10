import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useLocation } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
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
              Privacy Policy
            </h1>
            <p className="text-soft-blue-gray text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-soft-blue-gray space-y-8">
            
            {/* Introduction */}
            <section className="bg-grid-purple/20 p-6 rounded-lg border border-neon-blue/10">
              <h2 className="text-2xl font-bold text-neon-blue mb-4">Introduction</h2>
              <p className="leading-relaxed">
                At Divgaze ("we," "our," or "us"), we are committed to protecting your privacy and personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
                our website or use our services, including our AI-generated content, custom software development, and 
                digital marketing solutions.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-neon-blue mb-3">Personal Information</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Contact information (name, email address, phone number)</li>
                <li>Business information (company name, industry, project requirements)</li>
                <li>Communication preferences and history</li>
                <li>Payment and billing information</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3 mt-6">Technical Information</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information and operating system</li>
                <li>Website usage analytics and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3 mt-6">Service-Specific Data</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Content uploaded for AI processing and generation</li>
                <li>Project files and creative assets</li>
                <li>Custom software requirements and specifications</li>
                <li>Social media and marketing campaign data</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">How We Use Your Information</h2>
              <ul className="space-y-3 ml-6 list-disc">
                <li><strong>Service Delivery:</strong> To provide our web development, AI services, digital marketing, and custom software solutions</li>
                <li><strong>AI Content Generation:</strong> To create personalized AI influencers, product photography, and marketing materials</li>
                <li><strong>Communication:</strong> To respond to inquiries, provide project updates, and send service-related notifications</li>
                <li><strong>Quality Improvement:</strong> To enhance our services, develop new features, and optimize user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations in Sri Lanka and Australia</li>
                <li><strong>Business Operations:</strong> For billing, account management, and administrative purposes</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Information Sharing and Disclosure</h2>
              <p className="mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-neon-blue mb-3">Service Providers</h3>
              <ul className="space-y-2 ml-6 list-disc mb-4">
                <li>Cloud hosting and storage providers</li>
                <li>Payment processing services</li>
                <li>AI and machine learning platforms</li>
                <li>Analytics and marketing tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-neon-blue mb-3">Legal Requirements</h3>
              <ul className="space-y-2 ml-6 list-disc">
                <li>When required by law or legal process</li>
                <li>To protect our rights and property</li>
                <li>To ensure user safety and prevent fraud</li>
                <li>In connection with business transfers or mergers</li>
              </ul>
            </section>

            {/* International Data Transfers */}
            <section className="bg-grid-purple/20 p-6 rounded-lg border border-electric-violet/10">
              <h2 className="text-2xl font-bold text-electric-violet mb-4">International Data Transfers</h2>
              <p className="leading-relaxed">
                As we operate in both Sri Lanka and Australia, your information may be transferred to and processed in 
                countries other than your own. We ensure appropriate safeguards are in place to protect your personal 
                information in accordance with applicable data protection laws.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Data Security</h2>
              <p className="mb-4">We implement industry-standard security measures to protect your information, including:</p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication systems</li>
                <li>Secure development practices for custom software</li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Your Rights and Choices</h2>
              <p className="mb-4">You have the following rights regarding your personal information:</p>
              <ul className="space-y-2 ml-6 list-disc">
                <li><strong>Access:</strong> Request a copy of your personal information we hold</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Cookies and Tracking Technologies</h2>
              <p className="mb-4">We use cookies and similar technologies to:</p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Improve our services and user experience</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p className="mt-4">You can control cookie settings through your browser preferences.</p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Children's Privacy</h2>
              <p className="leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information from 
                a child under 13, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-electric-violet mb-4">Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to 
                review this Privacy Policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-grid-purple/20 p-6 rounded-lg border border-neon-blue/10">
              <h2 className="text-2xl font-bold text-neon-blue mb-4">Contact Us</h2>
              <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="space-y-2">
                <p><strong>Email:</strong> divgaze@gmail.com</p>
                <p><strong>Sri Lanka:</strong> +94 707 616 554</p>
                <p><strong>Australia:</strong> +61 408 840 996</p>
              </div>
              <p className="mt-4 text-sm">
                For privacy-related inquiries, please include "Privacy Policy" in your subject line.
              </p>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;