import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiUser, FiLogOut, FiHome, FiPieChart, FiList, FiBookmark, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className={`transition-all duration-300 ${scrolled ? 'h-20' : 'h-16'}`} />
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
       scrolled 
  ? 'bg-gray-900/95 backdrop-blur-md shadow-lg rounded-2xl mt-2 mx-4 w-[calc(100%-2rem)] border border-gray-700' 
  : 'bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group" onClick={handleNavClick}>
              <FiBook className="text-indigo-400 text-2xl transform group-hover:scale-110 transition-transform duration-200" />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">MentorSpace</span>
            </Link>
            
            <div className="hidden sm:flex space-x-2">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-800 inline-block"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 inline-block"
              >
                Register
              </Link>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="sm:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="sm:hidden py-4 border-t border-gray-700 mt-2">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="text-gray-300 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-lg text-base font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      </>
      
    );
  }

  return (
    <>
      <div className={`transition-all duration-300 ${scrolled ? 'h-20' : 'h-16'}`} />
      
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
  ? 'bg-gray-900/95 backdrop-blur-md shadow-lg rounded-2xl mt-2 mx-4 w-[calc(100%-2rem)] border border-gray-700' 
  : 'bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group" onClick={handleNavClick}>
              <FiBook className="text-indigo-400 text-2xl transform group-hover:scale-110 transition-transform duration-200" />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">MentorSpace</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1 ml-auto">
              {user?.role === 'teacher' ? (
                <>
                  <Link to="/teacher/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                    <FiHome className="text-lg" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                  <Link to="/teacher/articles" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                    <FiList className="text-lg" />
                    <span className="text-sm font-medium">Articles</span>
                  </Link>
                  <Link to="/teacher/analytics" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                    <FiPieChart className="text-lg" />
                    <span className="text-sm font-medium">Analytics</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/student/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                    <FiHome className="text-lg" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                  <Link to="/student/articles" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                    <FiList className="text-lg" />
                    <span className="text-sm font-medium">Browse</span>
                  </Link>
                  <Link to="/student/highlights" className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                    <FiBookmark className="text-lg" />
                    <span className="text-sm font-medium">Highlights</span>
                  </Link>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-2 ml-4 pl-4 border-l border-gray-700">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-full pl-1 pr-3 py-1 border border-gray-700">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <FiUser className="text-white text-sm" />
                </div>
                <span className="text-sm font-medium text-gray-300 hidden lg:inline">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <FiLogOut className="text-xl" />
              </button>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700 mt-2">
              <div className="flex flex-col space-y-2">
               
                {user?.role === 'teacher' ? (
                  <>
                    <Link
                      to="/teacher/dashboard"
                      onClick={handleNavClick}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800"
                    >
                      <FiHome className="text-lg" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/teacher/articles"
                      onClick={handleNavClick}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800"
                    >
                      <FiList className="text-lg" />
                      <span>Articles</span>
                    </Link>
                    <Link
                      to="/teacher/analytics"
                      onClick={handleNavClick}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800"
                    >
                      <FiPieChart className="text-lg" />
                      <span>Analytics</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/student/dashboard"
                      onClick={handleNavClick}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800"
                    >
                      <FiHome className="text-lg" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/student/articles"
                      onClick={handleNavClick}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800"
                    >
                      <FiList className="text-lg" />
                      <span>Browse</span>
                    </Link>
                    <Link
                      to="/student/highlights"
                      onClick={handleNavClick}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800"
                    >
                      <FiBookmark className="text-lg" />
                      <span>Highlights</span>
                    </Link>
                  </>
                )}

                {/* Mobile User Info */}
                <div className="border-t border-gray-700 pt-4 mt-2">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                        <FiUser className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-300">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      title="Logout"
                    >
                      <FiLogOut className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;