import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { QuizGenerator } from './components/QuizGenerator';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { Scheduler } from './components/Scheduler';
import { VideoCutter } from './components/VideoCutter';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { CourseViewer } from './components/CourseViewer';
import { CourseGenerator } from './components/CourseGenerator'; 

// EduFlux Logo SVG
const EduFluxLogo: React.FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block mr-2 align-middle text-emerald-400"
  >
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.4L19.5 8.2V15.8L12 19.6L4.5 15.8V8.2L12 4.4ZM12 12L19.5 8.2M12 12V19.6M12 12L4.5 8.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


interface NavbarProps {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/');
    setIsOpen(false); // Close mobile menu on logout
  };

  const loggedInNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Resume', path: '/resume' },
    { name: 'Scheduler', path: '/scheduler' },
    { name: 'Video', path: '/video-cutter' },
    { name: 'Course', path: '/course' },
    { name: 'Course Gen', path: '/course-generator' }, // New link
  ];

  const loggedOutNavLinks = [
    { name: 'Home', path: '/' },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link to="/" className="text-2xl font-bold text-gray-100 hover:text-emerald-400 transition-colors duration-200 flex items-center">
          <EduFluxLogo />
          EduFlux
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:w-auto flex-grow justify-end">
          <ul className="text-lg flex items-center space-x-8">
            {isLoggedIn ? (
              <>
                {loggedInNavLinks.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="block text-gray-100 hover:text-emerald-400 font-medium py-2 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="block text-gray-100 hover:text-emerald-400 font-medium py-2 transition-colors duration-200 bg-transparent border-none cursor-pointer transform hover:-translate-y-0.5 shadow-md"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {loggedOutNavLinks.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="block text-gray-100 hover:text-emerald-400 font-medium py-2 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-950 bg-emerald-600 rounded-full hover:bg-emerald-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-emerald-400 border border-emerald-400 rounded-full hover:bg-emerald-400 hover:text-gray-950 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md p-2 ml-4"
          aria-expanded={isOpen}
          aria-controls="navbar-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
        {/* Mobile Navigation */}
        <div
          id="navbar-menu"
          className={`w-full lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-gray-900 ${
            isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="text-lg space-y-2">
            {(isLoggedIn ? loggedInNavLinks : loggedOutNavLinks).map(link => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-100 hover:text-emerald-400 font-medium transition-colors duration-200 rounded-md hover:bg-gray-800"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-3 text-gray-100 hover:text-emerald-400 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer w-full text-left rounded-md hover:bg-gray-800"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-950 bg-emerald-600 rounded-md hover:bg-emerald-500 transition-colors duration-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-emerald-400 border border-emerald-400 rounded-md hover:bg-emerald-400 hover:text-gray-950 transition-colors duration-200"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleExploreFeatures = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center p-8 min-h-[calc(100vh-80px)] text-center bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-800"
    >
      <div className="relative z-10 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
          Welcome to EduFlux
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mb-8 animate-fade-in-up delay-200">
          Your all-in-one AI platform for learning and productivity.
          Generate quizzes, analyze resumes, plan your schedule, and cut videos with smart AI assistance.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-400 justify-center">
          <button
            onClick={handleExploreFeatures}
            className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore Features
          </button>
          <Link
            to="/signup"
            className="px-8 py-4 bg-transparent text-emerald-400 border border-emerald-400 font-semibold rounded-full shadow-lg hover:bg-emerald-400 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false); // Simulate login state

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-950"> {/* Updated overall background */}
        <Navbar isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} />} />
            <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Dashboard /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute isLoggedIn={isLoggedIn}><QuizGenerator /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ResumeAnalyzer /></ProtectedRoute>} />
            <Route path="/scheduler" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Scheduler /></ProtectedRoute>} />
            <Route path="/video-cutter" element={<ProtectedRoute isLoggedIn={isLoggedIn}><VideoCutter /></ProtectedRoute>} />
            <Route path="/course" element={<ProtectedRoute isLoggedIn={isLoggedIn}><CourseViewer /></ProtectedRoute>} />
            <Route path="/course-generator" element={<ProtectedRoute isLoggedIn={isLoggedIn}><CourseGenerator /></ProtectedRoute>} /> {/* New Protected Route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;