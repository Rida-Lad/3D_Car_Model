import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  
  useEffect(() => {
    if (modelRef.current) {
      // Set scale once when component mounts - responsive for different screens
      const scale = window.innerWidth < 640 ? 0.8 : 1.2;
      modelRef.current.scale.set(scale, scale, scale);
    }
  }, []);
  
  return (
    <Center>
      <primitive ref={modelRef} object={scene} />
    </Center>
  );
}

function CarModelViewer() {
  return (
    <div className="flex flex-col items-center justify-between w-full h-screen">
      <h1 className="text-2xl md:text-3xl font-bold pt-6 text-center">3D CAR MODEL</h1>
      
      <div className="w-full flex-grow flex items-center justify-center px-2">
        <div className="w-full h-full max-w-full overflow-hidden">
          <Canvas 
            camera={{ 
              position: [0, 2, window.innerWidth < 640 ? 12 : 8], 
              fov: window.innerWidth < 640 ? 40 : 50 
            }}
          >
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 10, 10]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
            <spotLight position={[-10, 10, -10]} intensity={1} angle={0.3} penumbra={1} />
            <pointLight position={[0, 5, 0]} intensity={1} />
            
            <Suspense fallback={null}>
              <Model url="/ferrari_599_gto.glb" />
              <Environment preset="sunset" background={false} />
            </Suspense>
            
            <OrbitControls 
              target={[0, 0, 0]} 
              enableZoom={false}
              enablePan={false}
            />
          </Canvas>
        </div>
      </div>
      
      <footer className="w-full py-4 text-center bg-gray-100">
        <p className="text-gray-700">Made by Rida Ladib</p>
      </footer>
    </div>
  );
}

export default CarModelViewer;