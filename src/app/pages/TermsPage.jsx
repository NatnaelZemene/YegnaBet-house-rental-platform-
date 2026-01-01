import React from 'react';
import { Button } from '../components/ui/button';
import { ArrowLeft, Shield, FileText, Users, AlertCircle } from 'lucide-react';

function TermsPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Please read these terms carefully before using YegnaBet
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Last Updated: December 2024</h3>
                <p className="text-blue-800">
                  These terms of service govern your use of YegnaBet platform and services.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using YegnaBet, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do 
                not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </section>

            {/* Use of Service */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">2. Use of Service</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>You may use our service for lawful purposes only. You agree not to use the service:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>In any way that violates any applicable federal, state, local, or international law</li>
                  <li>To post false, inaccurate, misleading, or fraudulent property information</li>
                  <li>To harass, abuse, or harm other users of the platform</li>
                  <li>To interfere with or disrupt the service or servers connected to the service</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">3. User Accounts</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>When you create an account with us, you must provide accurate and complete information.</p>
                <p>You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Safeguarding your password and account information</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                </ul>
              </div>
            </section>

            {/* Property Listings */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Property Listings</h2>
              <div className="space-y-4 text-gray-700">
                <p>Property owners who list properties on YegnaBet agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and truthful information about their properties</li>
                  <li>Maintain their listings with current availability and pricing</li>
                  <li>Respond to booking requests in a timely manner</li>
                  <li>Honor confirmed bookings and provide the advertised accommodations</li>
                </ul>
              </div>
            </section>

            {/* Booking and Payments */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Booking and Payments</h2>
              <div className="space-y-4 text-gray-700">
                <p>When you make a booking through YegnaBet:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You agree to pay all charges associated with your booking</li>
                  <li>Payments are processed securely through our platform</li>
                  <li>A service fee of 0.5% applies to all bookings</li>
                  <li>Cancellation policies vary by property and are clearly stated</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                YegnaBet acts as a platform connecting property owners and renters. We are not 
                responsible for the actual rental transactions, property conditions, or disputes 
                between users. Our liability is limited to the service fees collected.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of 
                any material changes via email or through our platform. Continued use of the 
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>Email: <a href="mailto:natnaelzemene21@gmail.com" className="text-blue-600 hover:text-blue-700">natnaelzemene21@gmail.com</a></p>
                <p>Phone: <a href="tel:+215921507548" className="text-blue-600 hover:text-blue-700">+215 921 507 548</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;