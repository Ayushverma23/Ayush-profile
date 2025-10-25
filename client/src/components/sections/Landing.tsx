import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";

function Starfield({ count = 2000, layer = 1 }) {
  const points = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.5 + 0.1;
    }
    return s;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      const speed = layer === 1 ? 0.0005 : layer === 2 ? 0.0003 : 0.0001;
      points.current.rotation.y += speed;
      points.current.rotation.x += speed * 0.5;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        transparent
        opacity={layer === 1 ? 0.8 : layer === 2 ? 0.6 : 0.4}
        color={layer === 1 ? "#ffffff" : layer === 2 ? "#a8cff0" : "#6b7c93"}
      />
    </points>
  );
}

function Sun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(t => t + delta);
    if (sunRef.current) {
      const pulse = Math.sin(time * 2) * 0.05 + 1;
      sunRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshBasicMaterial color="#ffa500" />
      <pointLight intensity={2} distance={50} color="#ffa500" />
    </mesh>
  );
}

interface PlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  size: number;
  color: string;
  offset: number;
}

function Planet({ radius, orbitRadius, speed, size, color, offset }: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const [angle, setAngle] = useState(offset);

  useFrame((state, delta) => {
    setAngle(a => a + speed * delta);
    
    if (planetRef.current) {
      planetRef.current.position.x = Math.cos(angle) * orbitRadius;
      planetRef.current.position.z = Math.sin(angle) * orbitRadius;
      planetRef.current.rotation.y += delta * 0.5;
      
      const bobOffset = Math.sin(angle * 2) * 0.1;
      planetRef.current.position.y = bobOffset;
    }
  });

  return (
    <mesh ref={planetRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,
      radius, radius,
      0, 2 * Math.PI,
      false,
      0
    );
    const pts = curve.getPoints(100);
    return pts.map(p => new THREE.Vector3(p.x, 0, p.y));
  }, [radius]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
    </line>
  );
}

function SolarSystem() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <Sun />
      
      <OrbitRing radius={3} />
      <Planet radius={3} orbitRadius={3} speed={0.5} size={0.25} color="#3b82f6" offset={0} />
      
      <OrbitRing radius={5} />
      <Planet radius={5} orbitRadius={5} speed={0.3} size={0.35} color="#06b6d4" offset={1} />
      
      <OrbitRing radius={7} />
      <Planet radius={7} orbitRadius={7} speed={0.2} size={0.4} color="#8b5cf6" offset={2} />
      
      <OrbitRing radius={9} />
      <Planet radius={9} orbitRadius={9} speed={0.15} size={0.3} color="#db2777" offset={3} />
      
      <OrbitRing radius={11} />
      <Planet radius={11} orbitRadius={11} speed={0.1} size={0.5} color="#f59e0b" offset={4} />

      <Starfield count={800} layer={1} />
      <Starfield count={600} layer={2} />
      <Starfield count={400} layer={3} />

      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
        <Vignette offset={0.5} darkness={0.5} />
      </EffectComposer>
    </>
  );
}

export default function Landing() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="landing" className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 8, 15], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={["#0a0a1a"]} />
          <SolarSystem />
        </Canvas>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="glass-card rounded-2xl px-12 py-8 text-center pointer-events-auto cursor-pointer"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-glow-cyan"
            animate={{
              textShadow: isHovered
                ? [
                    "0 0 10px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.5)",
                    "0 0 20px rgba(6, 182, 212, 1), 0 0 40px rgba(6, 182, 212, 0.8)",
                    "0 0 10px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.5)",
                  ]
                : "0 0 10px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.5)",
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Explore the Portfolio of
          </motion.h1>
          <motion.h2
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Ayush Verma
          </motion.h2>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 pointer-events-none"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
