import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Code2, Rocket, Zap } from "lucide-react";

const techIcons = [
  { name: "React", color: "#61DAFB", angle: 0 },
  { name: "Three.js", color: "#049EF4", angle: 60 },
  { name: "TypeScript", color: "#3178C6", angle: 120 },
  { name: "Tailwind", color: "#06B6D4", angle: 180 },
  { name: "Node.js", color: "#68A063", angle: 240 },
  { name: "Python", color: "#FFD43B", angle: 300 },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full filter blur-[128px]" />
      </div>

      <motion.div
        className="max-w-7xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="space-y-6">
          <motion.div
            className="glass-card rounded-2xl p-8"
            whileHover={{ rotateY: 5, rotateX: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-lg text-gray-300 mb-4 leading-relaxed">
            A dedicated and results-driven Software Developer with strong proficiency in full-stack development and a growing expertise in Machine Learning.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Specializing in <span className="text-cyan-400 font-semibold">Machine Learning</span>,
              {" "}<span className="text-purple-400 font-semibold">real-time interactions</span>, and
              {" "}<span className="text-green-400 font-semibold">Automated Websites Development</span>, and
              {" "}<span className="text-pink-400 font-semibold">performance optimization</span>.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <motion.div
                className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20"
                whileHover={{ scale: 1.05, borderColor: "rgba(6, 182, 212, 0.5)" }}
              >
                <Code2 className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <div className="text-2xl font-bold text-cyan-400">1+</div>
                <div className="text-sm text-gray-400">Years Exp</div>
              </motion.div>

              <motion.div
                className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20"
                whileHover={{ scale: 1.05, borderColor: "rgba(168, 85, 247, 0.5)" }}
              >
                <Rocket className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-purple-400">15+</div>
                <div className="text-sm text-gray-400">Projects</div>
              </motion.div>

              <motion.div
                className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20"
                whileHover={{ scale: 1.05, borderColor: "rgba(219, 39, 119, 0.5)" }}
              >
                <Zap className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-pink-400">100%</div>
                <div className="text-sm text-gray-400">Passion</div>
              </motion.div>
            </div>

            <motion.a
              href="#contact"
              className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white font-semibold neon-glow-cyan"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative h-[500px] flex items-center justify-center">
          <div className="relative w-full h-full">
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 neon-glow-purple flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AV
                </span>
              </div>
            </motion.div>

            {techIcons.map((tech, index) => {
              const radius = 200;
              const angleRad = (tech.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <motion.div
                  key={tech.name}
                  className="absolute top-1/2 left-1/2 cursor-pointer"
                  style={{
                    x: x - 32,
                    y: y - 32,
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5,
                  }}
                  onHoverStart={() => setHoveredIcon(index)}
                  onHoverEnd={() => setHoveredIcon(null)}
                  whileHover={{ scale: 1.3 }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
                    style={{
                      backgroundColor: tech.color,
                      boxShadow: `0 0 20px ${tech.color}`,
                    }}
                  >
                    {tech.name.slice(0, 2)}
                  </div>
                  {hoveredIcon === index && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-900 px-3 py-1 rounded-lg border border-gray-700 text-xs"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {tech.name}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
