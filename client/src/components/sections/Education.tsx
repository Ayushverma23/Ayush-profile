import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, GraduationCap, Calendar, Award } from "lucide-react";
import * as THREE from "three";

interface Education {
  id: number;
  year: string;
  institution: string;
  degree: string;
  highlights: string[];
  color: string;
  angle: number;
}

const educationData: Education[] = [
  {
    id: 1,
    year: "2022 - 2026",
    institution: "Kalasalingam University",
    degree: "B.Tech in Computer Science and Engineering",
    highlights: ["Machine Learning", "Computer Graphics", "Distributed Systems", "Web Development", "Data Structures and Algorithms", "Artificial Intelligence", "Azure Cloud", "AWS Cloud"],
    color: "#06b6d4",
    angle: 0,
  },
  {
    id: 2,
    year: "2021 - 2022",
    institution: "Divya Bhaskar Public School",
    degree: "Intermediate",
    highlights: ["Science", "Fundamentals"],
    color: "#8b5cf6",
    angle: 120,
  },
  {
    id: 3,
    year: "2020",
    institution: "Divya Bhaskar Public School",
    degree: "10th Standard",
    highlights: ["Fundamentals"],
    color: "#db2777",
    angle: 240,
  },
];

interface OrbitingNodeProps {
  education: Education;
  radius: number;
  onClick: () => void;
  isSelected: boolean;
}

function OrbitingNode({ education, radius, onClick, isSelected }: OrbitingNodeProps) {
  const nodeRef = useRef<THREE.Mesh>(null);
  const [angle, setAngle] = useState((education.angle * Math.PI) / 180);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    setAngle(a => a + delta * 0.2);
    
    if (nodeRef.current) {
      nodeRef.current.position.x = Math.cos(angle) * radius;
      nodeRef.current.position.z = Math.sin(angle) * radius;
      
      const scale = hovered || isSelected ? 1.3 : 1;
      nodeRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <mesh
      ref={nodeRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color={education.color}
        emissive={education.color}
        emissiveIntensity={hovered || isSelected ? 1 : 0.5}
      />
      {(hovered || isSelected) && (
        <pointLight color={education.color} intensity={2} distance={5} />
      )}
    </mesh>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.01, 16, 100]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
    </mesh>
  );
}

function EducationScene({ onNodeClick, selectedId }: { onNodeClick: (id: number) => void; selectedId: number | null }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />
      
      <OrbitRing radius={4} />
      
      {educationData.map((edu) => (
        <OrbitingNode
          key={edu.id}
          education={edu}
          radius={4}
          onClick={() => onNodeClick(edu.id)}
          isSelected={selectedId === edu.id}
        />
      ))}
    </>
  );
}

export default function Education() {
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      id="education"
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center py-20 px-4"
    >
      <div className="max-w-7xl w-full mx-auto">
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Education Timeline
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="h-[500px] glass-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
              <color attach="background" args={["#0f0f23"]} />
              <EducationScene
                onNodeClick={(id) => {
                  const edu = educationData.find(e => e.id === id);
                  setSelectedEducation(edu || null);
                }}
                selectedId={selectedEducation?.id || null}
              />
            </Canvas>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-gray-400 text-center md:text-left mb-6">
              Click on the orbiting nodes to explore educational milestones
            </p>
            {educationData.map((edu, index) => (
              <motion.div
                key={edu.id}
                className="glass-card rounded-xl p-6 cursor-pointer border-2 transition-all"
                style={{
                  borderColor: selectedEducation?.id === edu.id ? edu.color : "transparent",
                }}
                onClick={() => setSelectedEducation(edu)}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: edu.color }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: edu.color, boxShadow: `0 0 20px ${edu.color}` }}
                  >
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold" style={{ color: edu.color }}>
                        {edu.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                    <p className="text-gray-400 text-sm">{edu.institution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedEducation && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEducation(null)}
          >
            <motion.div
              className="glass-card rounded-2xl p-8 max-w-2xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedEducation.degree}</h3>
                  <p className="text-xl" style={{ color: selectedEducation.color }}>
                    {selectedEducation.institution}
                  </p>
                  <p className="text-gray-400 mt-1">{selectedEducation.year}</p>
                </div>
                <button
                  onClick={() => setSelectedEducation(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <Award className="w-5 h-5" />
                  <span>Key Highlights</span>
                </div>
                {selectedEducation.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedEducation.color }}
                    />
                    {highlight}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
