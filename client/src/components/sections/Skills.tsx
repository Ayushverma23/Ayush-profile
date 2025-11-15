import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, Code, Zap, Target } from "lucide-react";
import * as THREE from "three";

interface Skill {
  id: number;
  name: string;
  level: number;
  yearsUsed: number;
  description: string;
  projects: string[];
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
}

const skillsData: Skill[] = [
  {
    id: 1,
    name: "React",
    level: 95,
    yearsUsed: 5,
    description: "Expert in building complex UIs with React, Hooks, Context, and modern frontend architectures",
    projects: ["Portfolio", "Smart Estimator", "Dashboards"],
    color: "#61DAFB",
    size: 0.5,
    orbitRadius: 3,
    orbitSpeed: 0.3,
    angle: 0,
  },
  {
    id: 2,
    name: "TypeScript",
    level: 92,
    yearsUsed: 4,
    description: "Type-safe development for scalable and maintainable applications",
    projects: ["Smart Estimator", "ML Integrations"],
    color: "#3178C6",
    size: 0.48,
    orbitRadius: 4,
    orbitSpeed: 0.25,
    angle: 45,
  },
  {
    id: 3,
    name: "Node.js",
    level: 88,
    yearsUsed: 5,
    description: "Backend APIs, authentication, microservices, real-time communication",
    projects: ["API Platforms", "Chat Systems"],
    color: "#68A063",
    size: 0.43,
    orbitRadius: 5,
    orbitSpeed: 0.2,
    angle: 90,
  },
  {
    id: 4,
    name: "Python",
    level: 87,
    yearsUsed: 4,
    description: "Data processing, ML models, automation scripts, AI pipelines",
    projects: ["AlertVision", "ML Models", "Automation"],
    color: "#FFD43B",
    size: 0.42,
    orbitRadius: 6,
    orbitSpeed: 0.18,
    angle: 135,
  },
  {
    id: 5,
    name: "Machine Learning",
    level: 90,
    yearsUsed: 3,
    description: "Model building, feature engineering, CatBoost, ML ops, training pipelines",
    projects: ["Construction Estimator ML", "DeFi Risk Scoring", "AlertVision"],
    color: "#FF6A00",
    size: 0.46,
    orbitRadius: 4.5,
    orbitSpeed: 0.22,
    angle: 180,
  },
  {
    id: 6,
    name: "PostgreSQL",
    level: 80,
    yearsUsed: 4,
    description: "Database design, indexing, optimization, relational modeling",
    projects: ["E-commerce", "Analytics", "Dashboards"],
    color: "#336791",
    size: 0.38,
    orbitRadius: 5.5,
    orbitSpeed: 0.15,
    angle: 225,
  },
  {
    id: 7,
    name: "Three.js",
    level: 85,
    yearsUsed: 2,
    description: "Interactive 3D scenes, animations, WebGL experience",
    projects: ["3D Portfolio", "Visual Simulations"],
    color: "#049EF4",
    size: 0.45,
    orbitRadius: 6.2,
    orbitSpeed: 0.17,
    angle: 270,
  },
  {
    id: 8,
    name: "Tailwind CSS",
    level: 95,
    yearsUsed: 3,
    description: "Responsive UI, utility-first design, custom animation & layouts",
    projects: ["Smart Estimator UI", "Landing Pages"],
    color: "#38BDF8",
    size: 0.44,
    orbitRadius: 3.8,
    orbitSpeed: 0.27,
    angle: 315,
  },
  {
    id: 9,
    name: "Vite + SWC",
    level: 90,
    yearsUsed: 2,
    description: "High-performance builds, optimized dev workflow, modern front-end tooling",
    projects: ["Smart Estimator", "Portfolio"],
    color: "#646CFF",
    size: 0.4,
    orbitRadius: 5.2,
    orbitSpeed: 0.19,
    angle: 350,
  },
  {
    id: 10,
    name: "Docker",
    level: 82,
    yearsUsed: 2,
    description: "Containerization, environment consistency, deployment pipelines",
    projects: ["ML Deployments", "Production Builds"],
    color: "#0db7ed",
    size: 0.39,
    orbitRadius: 6.8,
    orbitSpeed: 0.16,
    angle: 390,
  },
  {
    id: 11,
    name: "Azure",
    level: 82,
    yearsUsed: 2,
    description: "Deploying web apps, managing cloud services, storage, and ML model hosting",
    projects: ["Smart Estimator Deployment", "ML Pipelines"],
    color: "#0078D4",
    size: 0.40,
    orbitRadius: 7,
    orbitSpeed: 0.14,
    angle: 430,
  },
  {
    id: 12,
    name: "AWS",
    level: 80,
    yearsUsed: 2,
    description: "EC2, S3, Lambda, API Gateway, and scalable cloud architecture",
    projects: ["Cloud Deployments", "AlertVision Backend"],
    color: "#FF9900",
    size: 0.40,
    orbitRadius: 7.5,
    orbitSpeed: 0.13,
    angle: 460,
  },
  {
    id: 13,
    name: "CI/CD",
    level: 88,
    yearsUsed: 2,
    description: "Automated testing, deployment pipelines using GitHub Actions & Docker",
    projects: ["Smart Estimator", "AI Deployments"],
    color: "#00C7B7",
    size: 0.42,
    orbitRadius: 6.3,
    orbitSpeed: 0.2,
    angle: 490,
  },
  {
    id: 14,
    name: "Git",
    level: 95,
    yearsUsed: 5,
    description: "Version control, branching strategies, code reviews, collaborative development",
    projects: ["All Projects"],
    color: "#F14E32",
    size: 0.39,
    orbitRadius: 4.2,
    orbitSpeed: 0.28,
    angle: 520,
  },
  {
    id: 15,
    name: "Java",
    level: 85,
    yearsUsed: 3,
    description: "Object-oriented development, backend systems, API building",
    projects: ["Enterprise APIs", "Spring Boot Services"],
    color: "#E76F00",
    size: 0.41,
    orbitRadius: 5.8,
    orbitSpeed: 0.18,
    angle: 550,
  },
  {
    id: 16,
    name: "Spring Boot",
    level: 82,
    yearsUsed: 3,
    description: "REST APIs, microservices, security, and enterprise backend development",
    projects: ["Backend Services", "Microservices"],
    color: "#6DB33F",
    size: 0.40,
    orbitRadius: 6.4,
    orbitSpeed: 0.17,
    angle: 580,
  },
  {
    id: 17,
    name: "Power BI",
    level: 78,
    yearsUsed: 2,
    description: "Interactive dashboards, data modeling, DAX, business intelligence reports",
    projects: ["Business Dashboards", "Analytics Tools"],
    color: "#F2C811",
    size: 0.38,
    orbitRadius: 5,
    orbitSpeed: 0.23,
    angle: 610,
  },  
  
];

interface SkillPlanetProps {
  skill: Skill;
  onClick: () => void;
  isDocked: boolean;
}

function SkillPlanet({ skill, onClick, isDocked }: SkillPlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const [angle, setAngle] = useState((skill.angle * Math.PI) / 180);
  const [hovered, setHovered] = useState(false);
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!planetRef.current) return;

    if (isDocked) {
      targetPosition.current.set(2, 0, 0);
    } else {
      setAngle(a => a + skill.orbitSpeed * delta);
      targetPosition.current.set(
        Math.cos(angle) * skill.orbitRadius,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * skill.orbitRadius
      );
    }

    currentPosition.current.lerp(targetPosition.current, 0.05);
    planetRef.current.position.copy(currentPosition.current);

    const targetScale = hovered || isDocked ? skill.size * 1.5 : skill.size;
    planetRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    planetRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh
      ref={planetRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={skill.color}
        emissive={skill.color}
        emissiveIntensity={hovered || isDocked ? 0.8 : 0.3}
        roughness={0.5}
        metalness={0.5}
      />
      {(hovered || isDocked) && (
        <pointLight color={skill.color} intensity={3} distance={10} />
      )}
    </mesh>
  );
}

function BlackHole() {
  const blackHoleRef = useRef<THREE.Mesh>(null);
  const accretionRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (accretionRef.current) {
      accretionRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={blackHoleRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <mesh ref={accretionRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.3, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={1} color="#8b5cf6" />
    </group>
  );
}

function SkillsScene({ onPlanetClick, dockedSkillId }: { onPlanetClick: (id: number) => void; dockedSkillId: number | null }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <BlackHole />

      {skillsData.map((skill) => (
        <SkillPlanet
          key={skill.id}
          skill={skill}
          onClick={() => onPlanetClick(skill.id)}
          isDocked={dockedSkillId === skill.id}
        />
      ))}
    </>
  );
}

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="skills"
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center py-20 px-4"
    >
      <div className="max-w-7xl w-full mx-auto">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Skills Universe
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            className="h-[600px] glass-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
              <color attach="background" args={["#0a0a1a"]} />
              <SkillsScene
                onPlanetClick={(id) => {
                  const skill = skillsData.find(s => s.id === id);
                  setSelectedSkill(skill || null);
                }}
                dockedSkillId={selectedSkill?.id || null}
              />
            </Canvas>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-gray-400 mb-6">
              Click on planets to explore skills in detail. Size represents proficiency level.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {skillsData.map((skill, index) => (
                <motion.button
                  key={skill.id}
                  className="glass-card rounded-xl p-4 text-left transition-all border-2"
                  style={{
                    borderColor: selectedSkill?.id === skill.id ? skill.color : "transparent",
                  }}
                  onClick={() => setSelectedSkill(skill)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: skill.color,
                    boxShadow: `0 0 20px ${skill.color}40`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: skill.color, boxShadow: `0 0 10px ${skill.color}` }}
                    />
                    <span className="font-bold text-white">{skill.name}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: skill.color }}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ delay: 0.8 + index * 0.05, duration: 1 }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{skill.level}% Proficiency</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              className="glass-card rounded-2xl p-8 max-w-2xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{
                      backgroundColor: selectedSkill.color,
                      boxShadow: `0 0 30px ${selectedSkill.color}`,
                    }}
                  >
                    {selectedSkill.name.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{selectedSkill.name}</h3>
                    <p className="text-gray-400">{selectedSkill.yearsUsed} years of experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-cyan-400">Proficiency Level</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ backgroundColor: selectedSkill.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSkill.level}%` }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="text-xs font-bold text-white">{selectedSkill.level}%</span>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-purple-400">Description</span>
                  </div>
                  <p className="text-gray-300">{selectedSkill.description}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-pink-400" />
                    <span className="font-semibold text-pink-400">Used In Projects</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {selectedSkill.projects.map((project) => (
                      <span
                        key={project}
                        className="px-4 py-2 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: `${selectedSkill.color}20`,
                          color: selectedSkill.color,
                          border: `1px solid ${selectedSkill.color}40`,
                        }}
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
