'use client';

import ShaderCanvas from "@/components/ShaderCanvas";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 text-white">
      
      {/* Background Layer */}
      <ShaderCanvas mode="background" />
      
      {/* Content Layer */}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-8 pointer-events-none">
        <h1 className="text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          SHADER FORGE
        </h1>
        <p className="text-xl opacity-80 max-w-2xl text-center">
          Next.js + Regl + WebGL2<br/>
          Multipass Fluid Simulation Scaffold
        </p>
        
        <div className="flex gap-4 mt-8 pointer-events-auto">
          <button className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
            Documentation
          </button>
        </div>
      </div>

    </main>
  );
}
