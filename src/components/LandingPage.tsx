import React, { useCallback, useMemo } from 'react';
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
  Sun,
  Sparkles,
  Zap,
  Target,
  Star,
  Rocket
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { isDark, toggleTheme } = useTheme();
  const [particlesInit, setParticlesInit] = React.useState(false);

  // Initialize particles engine
  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setParticlesInit(true);
    });
  }, []);

  // Particle configuration - creates a beautiful rain/stars effect
  const particlesOptions: ISourceOptions = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: isDark ? ["#60a5fa", "#818cf8", "#a78bfa", "#38bdf8"] : ["#3b82f6", "#6366f1", "#8b5cf6", "#0ea5e9"],
      },
      links: {
        color: isDark ? "#4f46e5" : "#6366f1",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce" as const,
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
        value: 80,
      },
      opacity: {
        value: { min: 0.3, max: 0.7 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }), [isDark]);

  const features = [
    {
      icon: Briefcase,
      title: 'Track Applications',
      description: 'Keep all your job applications organized in one place with detailed status tracking.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your job search progress with comprehensive analytics and statistics.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Quickly find applications with powerful search and filtering capabilities.',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Export your applications to CSV format for backup or external analysis.',
      gradient: 'from-rose-500 to-red-500'
    },
    {
      icon: Upload,
      title: 'Import Ready',
      description: 'Easily import existing application data from CSV files to get started quickly.',
      gradient: 'from-indigo-500 to-violet-500'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 overflow-hidden relative">
      {/* Particles Background */}
      {particlesInit && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/25 to-pink-400/25 dark:from-purple-500/15 dark:to-pink-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">JobTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl glass hover:scale-105 transition-all duration-300 shadow-lg"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up group hover:scale-105 transition-transform cursor-default">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your job search, simplified</span>
              <Star className="h-3 w-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="inline-block hover:scale-105 transition-transform cursor-default">Land Your Dream Job</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                With Confidence
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Take control of your job search with our comprehensive application tracking system. 
              <span className="text-blue-600 dark:text-blue-400 font-medium"> Organize, monitor, and succeed</span> like never before.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-semibold rounded-2xl transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center text-white">
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Floating Stats Cards */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { value: '100%', label: 'Free Forever', icon: Star },
                { value: '∞', label: 'Applications', icon: Briefcase },
                { value: '24/7', label: 'Access', icon: Zap }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="group glass-card rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 cursor-default"
                >
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-blue-500 group-hover:text-indigo-500 transition-colors" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 hover:scale-105 transition-transform">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to <span className="text-blue-600 dark:text-blue-400">succeed</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and maximize your success rate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 md:p-8 rounded-2xl glass-card hover:shadow-2xl transition-all duration-500 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
              >
                {/* Hover gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="relative text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 hover:scale-105 transition-transform">
                <Target className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Stop using spreadsheets.
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Start tracking smarter.</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Our platform provides a professional, organized approach to managing your job search journey.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center gap-3 animate-fade-in-up p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all cursor-default"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative group">
                {/* Animated glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
                
                <div className="relative glass-card rounded-2xl p-6 md:p-8 space-y-4 animate-fade-in">
                  {/* Mock Application Cards */}
                  {[
                    { company: 'Google Inc.', position: 'Software Engineer', status: 'Interview', statusColor: 'bg-emerald-500', delay: '0s' },
                    { company: 'Microsoft', position: 'Frontend Developer', status: 'Applied', statusColor: 'bg-blue-500', delay: '0.1s' },
                    { company: 'Apple', position: 'iOS Developer', status: 'Waiting', statusColor: 'bg-amber-500', delay: '0.2s' }
                  ].map((app, index) => (
                    <div 
                      key={index}
                      className="group/card flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 animate-slide-in-right hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                      style={{ animationDelay: app.delay, animationFillMode: 'backwards' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 ${app.statusColor} rounded-full group-hover/card:h-14 transition-all duration-300`} />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{app.company}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{app.position}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        app.status === 'Interview' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        app.status === 'Applied' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient" />
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-float" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            
            <div className="relative z-10 p-8 md:p-16 text-center">
              <Rocket className="h-12 w-12 text-white/80 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to organize your job search?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto">
                Join job seekers who have streamlined their application process.
              </p>
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
              >
                Start Tracking Applications
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 dark:border-gray-800 py-12 z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">JobTracker</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                The professional way to manage your job search and track applications.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Other Projects</h3>
              <a
                href="https://personality-traits-tester.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm group"
              >
                <Brain className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Personality Traits Tester
              </a>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Developer</h3>
              <a
                href="https://spandanb.com.np"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm group"
              >
                <Globe className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Visit Portfolio
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © 2025 Job Application Tracker. Made with ❤️ All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}