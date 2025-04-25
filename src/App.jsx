import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, useDetectGPU } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url, true);
  const modelRef = useRef();
  const gpuTier = useDetectGPU();

  useEffect(() => {
    if (modelRef.current) {
      // Set fixed scale based on device capabilities
      const scale = gpuTier.tier < 2 ? 0.6 : window.innerWidth < 640 ? 0.8 : 1.2;
      modelRef.current.scale.set(scale, scale, scale);
      
      // Position model at scene center
      modelRef.current.position.set(0, 0, 0);

      if (gpuTier.tier < 2) {
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.material.roughness = 1;
            child.material.metalness = 0;
          }
        });
      }
    }
  }, [gpuTier]);

  return <primitive ref={modelRef} object={scene} />;
}

function CarModelViewer() {
  const gpuTier = useDetectGPU();
  const controlsRef = useRef();

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen">
      <h1 className="text-2xl md:text-3xl font-bold pt-6 text-center">3D CAR MODEL</h1>
      
      <div className="w-full flex-grow flex items-center justify-center px-2">
        <div className="w-full h-full max-w-full overflow-hidden">
          <Canvas 
            frameloop="demand"
            gl={{ 
              antialias: false,
              powerPreference: gpuTier.tier < 2 ? "low-power" : "high-performance"
            }}
            camera={{ 
              position: [0, 1.5, window.innerWidth < 640 ? 10 : 7], 
              fov: window.innerWidth < 640 ? 45 : 50,
              near: 0.1,
              far: 1000
            }}
          >
            <ambientLight intensity={1} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={gpuTier.tier < 2 ? 0.8 : 1.5} 
            />

            <Suspense fallback={null}>
              <Model url="/ferrari_599_gto.glb" />
              <Environment 
                preset={gpuTier.tier < 2 ? "dawn" : "sunset"}
                background={false} 
                blur={gpuTier.tier < 2 ? 0.5 : 0} 
              />
            </Suspense>
            
            <OrbitControls 
              ref={controlsRef}
              target={[0, 0.5, 0]} // Adjusted target point for consistent view
              enableZoom={false}
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.2}
              minDistance={window.innerWidth < 640 ? 8 : 6} // Fixed min/max distance
              maxDistance={window.innerWidth < 640 ? 12 : 10}
              maxPolarAngle={Math.PI/2}
              autoRotate={false} // Disabled auto-rotate for consistent control
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