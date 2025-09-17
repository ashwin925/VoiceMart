import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Heart, Shield, Headphones } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VC</span>
              </div>
              <span className="text-xl font-bold">VoiceCart</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              The world's first voice-activated e-commerce platform designed for accessibility. 
              Shop hands-free with our innovative voice control system.
            </p>
            
            {/* Accessibility Features */}
            <div className="space-y-2">
              <h4 className="font-semibold text-primary-400 flex items-center">
                <Mic className="w-4 h-4 mr-2" />
                Accessibility Features
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Voice-controlled navigation</li>
                <li>• Screen reader compatible</li>
                <li>• Keyboard navigation support</li>
                <li>• High contrast mode available</li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-primary-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-primary-400 transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/help" className="hover:text-primary-400 transition-colors flex items-center">
                  <Headphones className="w-3 h-3 mr-1" />
                  Voice Commands Help
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-primary-400 transition-colors">
                  Accessibility Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-400 transition-colors flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Voice Commands Quick Reference */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h4 className="font-semibold mb-3 text-primary-400">Voice Commands Quick Reference</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="font-medium text-green-400">"Listen now"</div>
              <div className="text-gray-300">Activate voice commands</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="font-medium text-red-400">"Stop listening"</div>
              <div className="text-gray-300">Deactivate voice commands</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="font-medium text-blue-400">"Scroll down/up"</div>
              <div className="text-gray-300">Navigate the page</div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="font-medium text-purple-400">"Go to [category]"</div>
              <div className="text-gray-300">Jump to category section</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © 2024 VoiceCart. Made with{' '}
            <Heart className="w-3 h-3 inline text-red-500" />{' '}
            for accessibility.
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-xs text-gray-500">Powered by</span>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>React</span>
              <span>•</span>
              <span>Firebase</span>
              <span>•</span>
              <span>Web Speech API</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
