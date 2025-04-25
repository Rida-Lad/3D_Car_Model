import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  
  useEffect(() => {
    if (modelRef.current) {
      // Set scale once when component mounts
      modelRef.current.scale.set(1.2, 1.2, 1.2);
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
    <div className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold my-6 text-center">3D CAR MODEL</h1>
      
      <div className="w-full h-96 md:h-screen max-h-[600px]">
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
          <spotLight position={[-10, 10, -10]} intensity={1} angle={0.3} penumbra={1} />
          <pointLight position={[0, 5, 0]} intensity={1} />
          
          <Suspense fallback={null}>
            <Model url="/ferrari_599_gto.glb" />
            <Environment preset="sunset" background={false} />
          </Suspense>
          
          {/* Disable zoom with enableZoom={false} */}
          <OrbitControls 
            target={[0, 0, 0]} 
            enableZoom={false}
            enablePan={false}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default CarModelViewer;