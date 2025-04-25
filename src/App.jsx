import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  
  // Center the model at its first render
  useFrame(() => {
    if (modelRef.current) {
      // You can adjust scale if needed
      modelRef.current.scale.set(1.2, 1.2, 1.2);
    }
  });
  
  return (
    <Center>
      <primitive ref={modelRef} object={scene} />
    </Center>
  );
}

function App() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        {/* Increased ambient light intensity for overall brightness */}
        <ambientLight intensity={1.5} />
        
        {/* Added multiple lights for better illumination */}
        <spotLight position={[10, 10, 10]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
        <spotLight position={[-10, 10, -10]} intensity={1} angle={0.3} penumbra={1} />
        <pointLight position={[0, 5, 0]} intensity={1} />
        
        <Suspense fallback={null}>
          <Model url="/ferrari_599_gto.glb" />
          {/* Add environment lighting for realistic reflections */}
          <Environment preset="sunset" background={false} />
        </Suspense>
        <OrbitControls target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;