import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../lib/cubeUtils';

const CUBIE_SIZE = 0.95;
const GAP = 0.05;

function Cubie({ position, colors, onClick }) {
  const meshRef = useRef();
  
  const materials = useMemo(() => {
    const faces = ['R', 'L', 'U', 'D', 'F', 'B'];
    return faces.map(face => {
      const color = colors[face] ? COLORS[colors[face]] : '#111111';
      return new THREE.MeshStandardMaterial({ 
        color, 
        roughness: 0.3,
        metalness: 0.1
      });
    });
  }, [colors]);

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onClick={onClick}
    >
      <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
      {materials.map((mat, i) => (
        <meshStandardMaterial key={i} attach={`material-${i}`} {...mat} />
      ))}
    </mesh>
  );
}

function getCubieColors(cubeState, x, y, z) {
  const colors = {};
  if (y === 1) colors.U = cubeState.U[((1 - z) * 3) + (x + 1)];
  if (y === -1) colors.D = cubeState.D[((z + 1) * 3) + (x + 1)];
  if (z === 1) colors.F = cubeState.F[((1 - y) * 3) + (x + 1)];
  if (z === -1) colors.B = cubeState.B[((1 - y) * 3) + (1 - x)];
  if (x === 1) colors.R = cubeState.R[((1 - y) * 3) + (1 - z)];
  if (x === -1) colors.L = cubeState.L[((1 - y) * 3) + (z + 1)];
  return colors;
}

function generateCubies(cubeState) {
  const cubies = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        const colors = getCubieColors(cubeState, x, y, z);
        cubies.push({
          position: [x, y, z],
          colors,
          key: `${x},${y},${z}`
        });
      }
    }
  }
  return cubies;
}

function RubiksCube({ cubeState, currentMove, animatingMove, onFaceClick }) {
  const groupRef = useRef();
  const cubies = useMemo(() => generateCubies(cubeState), [cubeState]);

  return (
    <group ref={groupRef}>
      {cubies.map(cubie => (
        <Cubie
          key={cubie.key}
          position={cubie.position}
          colors={cubie.colors}
        />
      ))}
    </group>
  );
}

export default function CubeCanvas({ cubeState, onMove, isAnimating, currentMoveIndex, solution }) {
  const handleFaceClick = (face) => {
    if (!isAnimating && onMove) {
      onMove(face);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }}>
      <Canvas>
        <PerspectiveCamera position={[5, 5, 5]} fov={50} />
        <OrbitControls enablePan={false} minDistance={4} maxDistance={12} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <RubiksCube cubeState={cubeState} />
      </Canvas>
    </div>
  );
}