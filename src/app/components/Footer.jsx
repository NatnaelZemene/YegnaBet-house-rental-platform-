import { 
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart
} from 'lucide-react';

function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'About Us', page: 'about' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contact Us', page: 'contact' },
    { label: 'Terms of Service', page: 'terms' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/assets/logo.png" 
                alt="YegnaBet Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold">YegnaBet</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md">
              Find your perfect home in Addis Ababa and across Ethiopia. Discover unique properties, 
              book with confidence, and experience the best of Ethiopian hospitality.
            </p>
          </div>

          {/* Contact Info */}
          <div className="order-3 sm:order-2">
            <h3 className="font-semibold text-white mb-4 text-base sm:text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a 
                  href="mailto:natnaelzemene21@gmail.com" 
                  className="text-sm sm:text-base hover:text-white transition-colors break-all"
                >
                  natnaelzemene21@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a 
                  href="tel:+215921507548" 
                  className="text-sm sm:text-base hover:text-white transition-colors"
                >
                  +215 921 507 548
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="order-2 sm:order-3">
            <h3 className="font-semibold text-white mb-4 text-base sm:text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavigate && onNavigate(link.page)}
                    className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              <span>© {currentYear} YegnaBet. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" /> for Ethiopian property seekers
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;