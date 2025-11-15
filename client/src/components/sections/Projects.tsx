import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ExternalLink, Github, X, Sparkles } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  features: string[];
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  color: string;
  branch: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    controlX: number;
    controlY: number;
  };
}

const projectsData: Project[] = [
  {
    id: 1,
    name: "3D Portfolio",
    description: "Immersive galaxy-themed portfolio with WebGL visualizations",
    features: ["React Three Fiber", "Advanced animations", "Interactive 3D scenes"],
    techStack: ["React", "Three.js", "TypeScript", "Tailwind"],
    demoUrl: "#",
    githubUrl: "#",
    color: "#06b6d4",
    branch: { startX: 50, startY: 30, endX: 30, endY: 15, controlX: 40, controlY: 10 },
  },
  
  {
    id: 2,
    name: "Online Web Compiler",
    description: "Browser-based compiler supporting multiple programming languages",
    features: ["Real-time execution", "Multi-language support", "Sandboxed environment"],
    techStack: ["Node.js", "Docker", "Monaco Editor", "Express", "CI/CD", "GitHub Actions", "Java", "Spring Boot", "REST APIs", "Microservices", "API Gateway"],
    demoUrl: "https://github.com/Ayushverma23/Web-Compiler",
    githubUrl: "https://github.com/Ayushverma23/Web-Compiler",
    color: "#8b5cf6",
    branch: { startX: 50, startY: 30, endX: 70, endY: 15, controlX: 60, controlY: 10 },
  },
  
  {
    id: 3,
    name: "AI Disease Outbreak Prediction",
    description: "Machine learning system to forecast potential disease spread trends",
    features: ["Time-series prediction", "Heatmap visualization", "Automated data ingestion"],
    techStack: ["Python", "XGBoost", "FastAPI","LLM" , "MLflow" , "OpenAI" , "Automated Notification System" , "Power BI"],
    demoUrl: "https://github.com/Ayushverma23/ai-disease-outbreak",
    githubUrl: "https://github.com/Ayushverma23/ai-disease-outbreak",
    color: "#db2777",
    branch: { startX: 50, startY: 30, endX: 20, endY: 40, controlX: 30, controlY: 40 },
  },
  
  {
    id: 4,
    name: "SnapLit – AI Image Editor",
    description: "Full-stack AI-powered image editor for background removal and enhancements",
    features: ["AI background removal", "Image filters", "Drag-and-drop editing"],
    techStack: ["Next.js", "Python", "OpenCV", "Tailwind","AutoML", "Api Integration"],
    demoUrl: "https://snaplit-akash.vercel.app/",
    githubUrl: "https://github.com/akashverma92/Snaplit",
    color: "#f59e0b",
    branch: { startX: 50, startY: 30, endX: 80, endY: 40, controlX: 70, controlY: 40 },
  },
  
  
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const svgPath = (branch: Project["branch"]) => {
    return `M ${branch.startX} ${branch.startY} Q ${branch.controlX} ${branch.controlY} ${branch.endX} ${branch.endY}`;
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center py-20 px-4"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-600 rounded-full filter blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px]" />
      </div>

      <div className="max-w-7xl w-full mx-auto z-10">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Projects
        </motion.h2>

        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
          >
            <motion.circle
              cx="50"
              cy="30"
              r="2"
              fill="url(#gradient-trunk)"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            />

            <defs>
              <linearGradient id="gradient-trunk" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {projectsData.map((project, index) => (
              <g key={project.id}>
                <motion.path
                  d={svgPath(project.branch)}
                  stroke={project.color}
                  strokeWidth="0.3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onAnimationComplete={() => {
                    if (index === projectsData.length - 1) {
                      setAnimationComplete(true);
                    }
                  }}
                  style={{
                    filter: `drop-shadow(0 0 4px ${project.color})`,
                  }}
                />
                <motion.circle
                  cx={project.branch.endX}
                  cy={project.branch.endY}
                  r="1.5"
                  fill={project.color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView && animationComplete ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${project.color})`,
                  }}
                />
              </g>
            ))}
          </svg>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative" style={{ minHeight: "600px" }}>
            {projectsData.map((project, index) => (
              <motion.div
                key={project.id}
                className="glass-card rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
                style={{
                  position: "absolute",
                  left: `${project.branch.endX - 10}%`,
                  top: `${project.branch.endY * 10}px`,
                  width: "220px",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView && animationComplete ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.4 + index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                whileHover={{
                  boxShadow: `0 0 30px ${project.color}40`,
                  borderColor: project.color,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: `${project.color}20`,
                    boxShadow: `0 0 20px ${project.color}40`,
                  }}
                >
                  <Sparkles className="w-6 h-6" style={{ color: project.color }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {project.techStack.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${project.color}20`,
                        color: project.color,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="glass-card rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, x: "100%" }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0.8, x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h3>
                  <p className="text-lg text-gray-300">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-3 text-cyan-400">Key Features</h4>
                <ul className="space-y-2">
                  {selectedProject.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: selectedProject.color }}
                      />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-semibold mb-3 text-purple-400">Tech Stack</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 rounded-full font-semibold"
                      style={{
                        backgroundColor: `${selectedProject.color}20`,
                        color: selectedProject.color,
                        border: `1px solid ${selectedProject.color}40`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <motion.a
                  href={selectedProject.demoUrl}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold flex-1 justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                </motion.a>
                <motion.a
                  href={selectedProject.githubUrl}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-600 rounded-full text-white font-semibold flex-1 justify-center hover:border-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                  Source Code
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
