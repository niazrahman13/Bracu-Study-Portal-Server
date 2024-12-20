// src/components/SpaceBackground.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';


const SpaceBackground: React.FC = () => {
  return (
    <Canvas
      style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: -1 }}
      camera={{ position: [0, 0, 5], fov: 75 }}
    >
      <ambientLight intensity={0.1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <Stars
        radius={100} // Radius of the stars in the background
        depth={50} // Depth of the stars
        count={10000} // Number of stars
        factor={4} // Size of the stars
      />
    </Canvas>
  );
};

export default SpaceBackground;
