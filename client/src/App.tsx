import { Suspense, useEffect, useState, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/inter";

// Lazy load sections for better performance
const Landing = lazy(() => import("./components/sections/Landing"));
const About = lazy(() => import("./components/sections/About"));
const Education = lazy(() => import("./components/sections/Education"));
const Projects = lazy(() => import("./components/sections/Projects"));
const Skills = lazy(() => import("./components/sections/Skills"));
const Contact = lazy(() => import("./components/sections/Contact"));

function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-2xl font-bold text-white text-glow-cyan">Loading Portfolio...</p>
      </motion.div>
    </motion.div>
  );
}

function NavigationDots() {
  const sections = ["landing", "about", "education", "projects", "skills", "contact"];
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + window.innerHeight / 2;
          
          sections.forEach((section, index) => {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(index);
              }
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(sections[index]);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
      {sections.map((section, index) => (
        <motion.button
          key={section}
          onClick={() => scrollToSection(index)}
          className="relative group"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Navigate to ${section}`}
        >
          <div
            className={`w-3 h-3 rounded-full border-2 transition-all ${
              activeSection === index
                ? "bg-cyan-400 border-cyan-400 shadow-[0_0_10px_#06b6d4]"
                : "bg-transparent border-gray-600 hover:border-cyan-400"
            }`}
          />
          <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-900 px-3 py-1 rounded-lg text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Throttle scroll events for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / totalHeight) * 100;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 z-50 origin-left"
      style={{ scaleX: scrollProgress / 100 }}
      initial={{ scaleX: 0 }}
    />
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Reduce loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "Ayush Verma";
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <ScrollIndicator />
          <NavigationDots />
          
          <Suspense fallback={<div className="h-screen bg-gray-900" />}>
            <Landing />
            <About />
            <Education />
            <Projects />
            <Skills />
            <Contact />
          </Suspense>

          <footer className="relative bg-gray-900/50 backdrop-blur-sm py-8 px-4 border-t border-gray-800">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} Ayush Verma. Crafted with{" "}
                <span className="text-pink-400">❤️</span> and{" "}
                <span className="text-cyan-400">Three.js</span>
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Designed for the future of web experiences
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
