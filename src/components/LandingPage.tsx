import React from 'react';
import { 
  Briefcase, 
  BarChart3, 
  Shield, 
  Download, 
  Upload, 
  Search,
  ArrowRight,
  CheckCircle,
  Globe,
  Brain,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { isDark, toggleTheme } = useTheme();

  const features = [
    {
      icon: Briefcase,
      title: 'Track Applications',
      description: 'Keep all your job applications organized in one place with detailed status tracking.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your job search progress with comprehensive analytics and statistics.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Quickly find applications with powerful search and filtering capabilities.'
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Export your applications to CSV format for backup or external analysis.'
    },
    {
      icon: Upload,
      title: 'Import Ready',
      description: 'Easily import existing application data from CSV files to get started quickly.'
    }
  ];

  const benefits = [
    'Never lose track of an application again',
    'Follow up at the right time with recontact dates',
    'Organize applications with custom tags',
    'Monitor your job search progress',
    'Keep detailed notes for each application'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header with Theme Toggle */}
      <header className="absolute top-0 right-0 p-6 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
                <Briefcase className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Job Application
              <span className="text-blue-600 dark:text-blue-400"> Tracker</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Take control of your job search with our comprehensive application tracking system. 
              Organize, monitor, and optimize your job applications like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and maximize your success rate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-4">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why choose our tracker?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Stop using spreadsheets and sticky notes. Our platform provides a professional, 
                organized approach to managing your job search journey.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Google Inc.</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Software Engineer</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-sm rounded-full">
                      Interview
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Microsoft</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Frontend Developer</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-sm rounded-full">
                      Applied
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Apple</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">iOS Developer</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-sm rounded-full">
                      Waiting
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to organize your job search?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who have streamlined their application process.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Tracking Applications
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">Job Tracker</span>
              </div>
              <p className="text-gray-400">
                The professional way to manage your job search and track applications.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Other Projects</h3>
              <div className="space-y-2">
                <a
                  href="https://personality-traits-tester.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Personality Traits Tester
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Developer</h3>
              <a
                href="https://spandanb.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4 mr-2" />
                Visit Portfolio
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Job Application Tracker. 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}