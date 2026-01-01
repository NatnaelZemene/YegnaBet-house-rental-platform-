import React from 'react';
import { Button } from '../components/ui/button';
import { ArrowLeft, Building, Users, Award, Heart } from 'lucide-react';

function AboutPage({ onNavigate }) {
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About YegnaBet</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Your trusted partner for finding the perfect home in Ethiopia
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              YegnaBet is dedicated to revolutionizing the property rental experience in Ethiopia. 
              We connect property seekers with their ideal homes while providing property owners 
              with a reliable platform to showcase their properties.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our platform focuses on transparency, security, and user satisfaction, making the 
              process of finding and renting properties as smooth as possible for everyone involved.
            </p>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We prioritize building a strong community of property owners and renters 
                based on trust and mutual respect.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600">
                Every property on our platform is verified to ensure quality and 
                authenticity for our users.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ethiopian Heritage</h3>
              <p className="text-gray-600">
                Proudly Ethiopian, we understand the local market and cultural 
                nuances that matter to our community.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h3>
            <p className="text-gray-700 mb-6">
              Have questions or want to learn more about YegnaBet? We'd love to hear from you.
            </p>
            <Button 
              onClick={() => onNavigate('contact')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;