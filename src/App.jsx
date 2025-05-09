import  { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, useDetectGPU } from '@react-three/drei';

function Model({ url, onLoaded }) {
  const { scene } = useGLTF(url, true);
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
    onLoaded();
  }, [gpuTier, onLoaded]);

  return <primitive ref={modelRef} object={scene} />;
}

function CarModelViewer() {
  const gpuTier = useDetectGPU();
  const controlsRef = useRef();
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const interval = setInterval(() => {
      setFakeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fakeProgress === 100) {
      const timeout = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [fakeProgress]);

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loading Model... {fakeProgress}%
            </h2>
            <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${fakeProgress}%` }}
              />
            </div>
          </div>
          
          {isMobile && (
            <div className="max-w-xs text-sm text-gray-600 mt-4 px-4 py-2 bg-yellow-100 rounded-lg">
              ⚠️ Mobile devices might experience slight lag due to GPU limitations.
              For optimal experience, view on a desktop.
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
                onLoaded={() => setIsLoading(false)}
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