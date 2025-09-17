import React from 'react';
import Container from '../components/Container';
import CategoryGrid from '../components/CategoryGrid';
import { Mic, ShoppingBag, Accessibility, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Shop with Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Voice
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The world's first voice-activated e-commerce platform designed for accessibility.
              Navigate, search, and shop completely hands-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg">
                <Mic className="w-5 h-5" />
                <span>Try Voice Shopping</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg">
                <ShoppingBag className="w-5 h-5" />
                <span>Browse Products</span>
              </button>
            </div>

            {/* Voice Command Demo */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Try saying:</span>
              </div>
              <div className="text-lg font-medium text-gray-900">
                "Listen now"
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Then: "Go to electronics" or "Search for headphones"
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              VoiceCart makes online shopping accessible to users with mobility impairments
              and anyone who wants a hands-free shopping experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Accessibility className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fully Accessible
              </h3>
              <p className="text-gray-600">
                Screen reader compatible, keyboard navigation, and voice control
                make shopping accessible for everyone.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Voice Controlled
              </h3>
              <p className="text-gray-600">
                Navigate categories, search products, and complete purchases
                using natural voice commands.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Instant voice recognition and real-time responses make
                shopping faster than ever before.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Grid with Animation */}
      <CategoryGrid />

      {/* How It Works */}
      <section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Voice Shopping Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Click the Microphone
              </h3>
              <p className="text-gray-600">
                Click the mic icon in the navigation bar to start listening
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Say "Listen Now"
              </h3>
              <p className="text-gray-600">
                Activate command mode by saying "listen now"
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Give Commands
              </h3>
              <p className="text-gray-600">
                Navigate, search, and shop using natural voice commands
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Container padding="lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience Voice Shopping?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are shopping smarter with voice control
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Now
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
