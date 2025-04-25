import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, useDetectGPU, Html } from '@react-three/drei';

function Model({ url, onProgress }) {
  const { scene, progress } = useGLTF(url, true, undefined, (xhr) => {
    onProgress((xhr.loaded / xhr.total) * 100);
  });
  const modelRef = useRef();
  const gpuTier = useDetectGPU();

  useEffect(() => {
    if (modelRef.current) {
      const scale = gpuTier.tier < 2 ? 0.6 : window.innerWidth < 640 ? 0.8 : 1.2;
      modelRef.current.scale.set(scale, scale, scale);
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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isMobile = window.innerWidth < 768;

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen">
      {/* Loading Overlay */}
      {loadingProgress < 100 && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loading Model... {Math.round(loadingProgress)}%
            </h2>
            <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
          
          {isMobile && (
            <div className="max-w-xs text-sm text-gray-600 mt-4 px-4 py-2 bg-yellow-100 rounded-lg">
              ⚠️ Please note: Mobile devices might experience some lag due to 
              GPU limitations. For best experience, view on a desktop device.
            </div>
          )}
        </div>
      )}

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
              <Model 
                url="/ferrari_599_gto.glb" 
                onProgress={setLoadingProgress} 
              />
              <Environment 
                preset={gpuTier.tier < 2 ? "dawn" : "sunset"}
                background={false} 
                blur={gpuTier.tier < 2 ? 0.5 : 0} 
              />
            </Suspense>
            
            <OrbitControls 
              ref={controlsRef}
              target={[0, 0.5, 0]}
              enableZoom={false}
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.2}
              minDistance={window.innerWidth < 640 ? 8 : 6}
              maxDistance={window.innerWidth < 640 ? 12 : 10}
              maxPolarAngle={Math.PI/2}
              autoRotate={false}
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