import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiTrendingUp, FiAward, FiArrowRight, FiStar, FiPlay, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Hero Section with Dark Animated Background */}
      <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated stars/meteors background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Static stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite`
              }}
            />
          ))}
          
          {/* Moving shooting stars */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full shooting-star"
              style={{
                top: Math.random() * 50 + '%',
                left: Math.random() * 100 + '%',
                animation: `shoot ${Math.random() * 8 + 5}s linear infinite`,
                animationDelay: Math.random() * 5 + 's',
                boxShadow: '0 0 10px 2px rgba(255,255,255,0.3)'
              }}
            >
              <div className="absolute top-0 right-0 w-20 h-0.5 bg-gradient-to-l from-white to-transparent transform -translate-y-1/2"></div>
            </div>
          ))}

          {/* Floating nebula clouds */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-40 right-40 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse delay-500"></div>
          
          {/* Constellation lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" opacity="0.3"/>
                <circle cx="50" cy="30" r="1" fill="white" opacity="0.3"/>
                <circle cx="80" cy="70" r="1" fill="white" opacity="0.3"/>
                <circle cx="30" cy="80" r="1" fill="white" opacity="0.3"/>
                <line x1="10" y1="10" x2="50" y2="30" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                <line x1="50" y1="30" x2="80" y2="70" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                <line x1="80" y1="70" x2="30" y2="80" stroke="white" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow delay-700"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 z-10">
          <div className="text-center">
            {/* Badge with glow effect */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 animate-fade-in-down border border-white/20 shadow-lg shadow-indigo-500/20">
              <FiStar className="w-4 h-4 mr-2 text-yellow-300" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                Welcome to the future of learning
              </span>
            </div>

            {/* Main heading with glowing effect */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Welcome to{' '}
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 blur-2xl opacity-50 animate-pulse"></span>
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 animate-gradient-x">
                  MentorSpace
                </span>
              </span>
            </h1>

            {/* Animated description with glow */}
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-300 leading-relaxed animate-fade-in-up">
              An interactive learning platform for teachers and students to create, 
              share, and track educational content in an engaging environment
            </p>

            {/* CTA Buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
              <Link
                to="/register"
                className="group relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/20"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                to="/login"
                className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Sign In
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Stats with glass morphism */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-white/10">
              {[
                ['Active Users', '50,000+'],
                ['Learning Hours', '1M+'],
                ['Teachers', '5,000+'],
                ['Courses', '10,000+']
              ].map(([label, value]) => (
                <div key={label} className="text-center group">
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {value}
                  </div>
                  <div className="text-sm text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* Features Section with Dark Theme */}
      <section className="py-28 bg-gray-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Everything you need in one platform
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover powerful features designed to enhance the learning experience for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FiBook,
                bgColor: 'from-indigo-500/20 to-indigo-600/5',
                borderColor: 'border-indigo-500/30',
                textColor: 'text-indigo-400',
                title: 'For Teachers',
                features: ['Create engaging articles', 'Track student progress', 'View detailed analytics', 'Upload multimedia content']
              },
              {
                icon: FiUsers,
                bgColor: 'from-green-500/20 to-green-600/5',
                borderColor: 'border-green-500/30',
                textColor: 'text-green-400',
                title: 'For Students',
                features: ['Access learning materials', 'Highlight and take notes', 'Track reading progress', 'Personalized dashboard']
              },
              {
                icon: FiAward,
                bgColor: 'from-purple-500/20 to-purple-600/5',
                borderColor: 'border-purple-500/30',
                textColor: 'text-purple-400',
                title: 'Rich Content',
                features: ['Text articles', 'Images and videos', '3D models', 'Interactive elements']
              },
              {
                icon: FiTrendingUp,
                bgColor: 'from-orange-500/20 to-orange-600/5',
                borderColor: 'border-orange-500/30',
                textColor: 'text-orange-400',
                title: 'Analytics',
                features: ['Engagement tracking', 'Category distribution', 'Reading time analysis', 'Progress monitoring']
              }
            ].map((item, index) => (
              <div
                key={item.title}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden border border-gray-700 hover:border-opacity-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Icon with gradient background */}
                <div className={`relative w-16 h-16 bg-gray-700/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${item.borderColor}`}>
                  <item.icon className={`${item.textColor} text-3xl`} />
                </div>
                
                <h3 className="text-2xl font-semibold mb-4 relative text-white">{item.title}</h3>
                
                <ul className="text-gray-300 space-y-3 relative">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-center group-hover:translate-x-1 transition-transform duration-200" style={{ transitionDelay: `${i * 50}ms` }}>
                      <FiCheckCircle className={`${item.textColor} mr-2 flex-shrink-0 text-sm`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn more link */}
                <div className="mt-6 relative">
                  <Link to="/features" className={`inline-flex items-center ${item.textColor} font-medium group-hover:underline`}>
                    Learn more
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with Dark Theme */}
      <section className="py-28 bg-gray-800 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Three simple steps to success
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and transform your learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30"></div>
            
            {[
              {
                number: '01',
                title: 'Register',
                description: 'Sign up as a teacher or student in seconds',
                icon: '👋',
                gradient: 'from-indigo-500 to-indigo-600',
                bgLight: 'bg-indigo-500/10',
                borderColor: 'border-indigo-500/30',
                textColor: 'text-indigo-400'
              },
              {
                number: '02',
                title: 'Create/Access Content',
                description: 'Teachers create articles, students access them instantly',
                icon: '📚',
                gradient: 'from-green-500 to-green-600',
                bgLight: 'bg-green-500/10',
                borderColor: 'border-green-500/30',
                textColor: 'text-green-400'
              },
              {
                number: '03',
                title: 'Track Progress',
                description: 'Monitor engagement and learning progress in real-time',
                icon: '📊',
                gradient: 'from-purple-500 to-purple-600',
                bgLight: 'bg-purple-500/10',
                borderColor: 'border-purple-500/30',
                textColor: 'text-purple-400'
              }
            ].map((step, index) => (
              <div key={step.number} className="relative group" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 hover:border-${step.borderColor}`}>
                  {/* Floating number */}
                  <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${step.gradient} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                    {step.number}
                  </div>
                  
                  {/* Icon circle */}
                  <div className={`w-20 h-20 ${step.bgLight} rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:rotate-3 transition-transform border ${step.borderColor}`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                  
                  {/* Progress indicator */}
                  {index < 2 && (
                    <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                      <FiArrowRight className={`${step.textColor} text-2xl`} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Video preview with dark theme */}
          <div className="mt-20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl p-1 shadow-2xl">
            <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-700">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">See how it works</h3>
                  <p className="text-gray-400 text-lg mb-6">Watch our 2-minute demo to see MentorSpace in action</p>
                  <button className="flex items-center text-indigo-400 font-semibold group">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-indigo-500/30 transition-colors border border-indigo-500/30">
                      <FiPlay className="text-indigo-400 ml-1" />
                    </div>
                    <span className="text-lg">Watch Demo Video</span>
                  </button>
                </div>
                <div className="flex-1 relative">
                  <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700">
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <FiPlay className="text-gray-500 text-5xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Dark Theme */}
      <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 py-28 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Stars in CTA */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <span className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white mb-8 border border-white/20">
            🚀 Limited Time Offer
          </span>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to start your{' '}
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 blur-2xl opacity-30 animate-pulse"></span>
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                learning journey?
              </span>
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of educators and students already using MentorSpace
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-white/20"
            >
              Get Started Now
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/pricing"
              className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-gray-900 transform hover:-translate-y-1 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-50">
            <span className="text-gray-400 text-sm">Trusted by:</span>
            {['Google', 'Microsoft', 'Amazon', 'Meta'].map((company) => (
              <span key={company} className="text-gray-500 font-semibold text-lg">
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>
    </div>
  );
};

export default Home;