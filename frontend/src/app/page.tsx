"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WalletConnect } from "@/components/WalletConnect";

// Define firefly type
interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
  lifespan: number;
}

// We need to create a client wrapper since useAccount can only be used within a client component
const BazaarEntrance = ({ isWalletConnected }: { isWalletConnected: boolean }) => {
  const router = useRouter();
  
  const joinArena = () => {
    if (isWalletConnected) {
      router.push("/arena");
    }
  };

  return (
    <>
      <button
        onClick={joinArena}
        disabled={!isWalletConnected}
        className={`group relative overflow-hidden px-8 py-4 rounded-lg text-xl font-bold transition-all ${
          isWalletConnected
            ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-gray-900 shadow-lg shadow-amber-500/30"
            : "bg-gray-800/50 backdrop-blur-sm text-gray-400 cursor-not-allowed border border-gray-700"
        }`}
      >
        <span className="relative z-10">
          {isWalletConnected ? "Enter Taifei Bazaar" : "Connect Wallet to Enter"}
        </span>
        
        {isWalletConnected && (
          <>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-300 to-red-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 rounded-lg blur group-hover:bg-gradient-to-r from-yellow-500/30 to-red-500/30 opacity-0 group-hover:opacity-100 transition duration-300 -z-10"></div>
            <div className="absolute -right-2 -bottom-2 w-2/3 h-2/3 bg-red-500/10 blur-2xl rounded-full -z-10"></div>
          </>
        )}
      </button>
      
      {!isWalletConnected && (
        <p className="mt-4 text-yellow-300 text-sm animate-pulse">
          Please connect your wallet to access the Taifei Bazaar
        </p>
      )}
    </>
  );
};

export default function Home() {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Mouse position tracking for fireflies
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Occasionally spawn a new firefly at mouse position
      if (Math.random() < 0.05) {
        const newFirefly: Firefly = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 3,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 2 + 1,
          direction: Math.random() * 2 * Math.PI,
          lifespan: Math.random() * 5000 + 2000
        };
        
        setFireflies(prev => [...prev.slice(-15), newFirefly]); // Keep max 15 fireflies
        
        // Remove firefly after its lifespan
        setTimeout(() => {
          setFireflies(prev => prev.filter(fly => fly.id !== newFirefly.id));
        }, newFirefly.lifespan);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Animate fireflies
  useEffect(() => {
    if (fireflies.length === 0) return;
    
    const animateFireflies = () => {
      setFireflies(prev => 
        prev.map(fly => {
          // Calculate new position with some random movement
          const newX = fly.x + Math.cos(fly.direction) * fly.speed + (Math.random() - 0.5) * 2;
          const newY = fly.y + Math.sin(fly.direction) * fly.speed + (Math.random() - 0.5) * 2;
          
          // Occasionally change direction
          const newDirection = Math.random() < 0.05 
            ? fly.direction + (Math.random() - 0.5) * Math.PI / 2 
            : fly.direction;
            
          return {
            ...fly,
            x: newX,
            y: newY,
            direction: newDirection,
            opacity: fly.opacity * (Math.random() < 0.5 ? 0.98 : 1.02) // Subtle fading in/out
          };
        })
      );
    };
    
    const animationFrame = requestAnimationFrame(animateFireflies);
    return () => cancelAnimationFrame(animationFrame);
  }, [fireflies]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-950 via-indigo-950 to-black text-white relative overflow-hidden">
      {/* Taiwanese night market background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Dark texture overlay */}
        <div className="absolute inset-0 bg-blue-950/60 mix-blend-multiply z-0"></div>
        
        {/* City skyline silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-black/30 z-0">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full opacity-40">
            <path d="M0,200 L0,140 L40,140 L40,120 L60,120 L60,100 L80,100 L80,120 L100,120 L100,80 L120,80 L120,100 L140,100 L140,60 L160,60 L160,100 L180,100 L180,120 L200,120 L200,140 L220,140 L220,100 L240,100 L240,80 L260,80 L260,120 L280,120 L280,140 L300,140 L300,80 L320,80 L320,40 L340,40 L340,60 L360,60 L360,100 L380,100 L380,60 L400,60 L400,80 L420,80 L420,100 L440,100 L440,60 L460,60 L460,40 L480,40 L480,20 L500,20 L500,0 L520,0 L520,20 L540,20 L540,40 L560,40 L560,60 L580,60 L580,40 L600,40 L600,60 L620,60 L620,100 L640,100 L640,120 L660,120 L660,80 L680,80 L680,100 L700,100 L700,120 L720,120 L720,100 L740,100 L740,120 L760,120 L760,140 L780,140 L780,120 L800,120 L800,100 L820,100 L820,60 L840,60 L840,40 L860,40 L860,20 L880,20 L880,60 L900,60 L900,80 L920,80 L920,100 L940,100 L940,120 L960,120 L960,140 L980,140 L980,120 L1000,120 L1000,100 L1020,100 L1020,80 L1040,80 L1040,60 L1060,60 L1060,80 L1080,80 L1080,100 L1100,100 L1100,120 L1120,120 L1120,140 L1140,140 L1140,120 L1160,120 L1160,140 L1180,140 L1180,160 L1200,160 L1200,200 Z" fill="#000"/>
          </svg>
          
          {/* Taipei 101 silhouette */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-80 opacity-30">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-80 bg-gradient-to-t from-emerald-900 to-transparent"></div>
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-20 h-10 bg-emerald-900"></div>
            <div className="absolute bottom-50 left-1/2 -translate-x-1/2 w-14 h-30 bg-emerald-900"></div>
            <div className="absolute bottom-80 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-900"></div>
          </div>
        </div>
        
        {/* Night market stall outlines */}
        <div className="absolute bottom-5 left-10 w-40 h-32 border-2 border-amber-500/20 rounded-md transform skew-x-12 bg-amber-800/5"></div>
        <div className="absolute bottom-8 left-40 w-36 h-28 border-2 border-rose-500/20 rounded-md transform -skew-x-12 bg-rose-800/5"></div>
        <div className="absolute bottom-12 right-20 w-44 h-36 border-2 border-blue-500/20 rounded-md transform skew-x-12 bg-blue-800/5"></div>
        <div className="absolute bottom-6 right-60 w-40 h-30 border-2 border-purple-500/20 rounded-md transform -skew-x-12 bg-purple-800/5"></div>
        
        {/* Decorative Chinese characters */}
        <div className="absolute top-40 left-20 text-6xl text-red-600/10 font-bold">福</div>
        <div className="absolute top-60 right-40 text-7xl text-amber-500/10 font-bold">財</div>
        <div className="absolute bottom-80 left-1/4 text-8xl text-blue-500/10 font-bold">夜</div>
        <div className="absolute top-1/4 right-1/3 text-7xl text-emerald-500/10 font-bold">市</div>
        
        {/* Light particles - static */}
        {Array.from({ length: 50 }).map((_, idx) => (
          <div 
            key={`particle-${idx}`} 
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          ></div>
        ))}
        
        {/* String lights at top - static */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/30 via-amber-500/0 to-amber-400/30"></div>
        {Array.from({ length: 20 }).map((_, idx) => (
          <div 
            key={`light-${idx}`} 
            className={`absolute top-0 rounded-full ${idx % 3 === 0 ? 'bg-red-400' : idx % 3 === 1 ? 'bg-amber-300' : 'bg-green-300'}`}
            style={{
              width: '4px',
              height: '4px',
              left: `${(idx / 20) * 100}%`,
              boxShadow: `0 0 8px 2px ${idx % 3 === 0 ? 'rgba(248, 113, 113, 0.6)' : idx % 3 === 1 ? 'rgba(252, 211, 77, 0.6)' : 'rgba(110, 231, 183, 0.6)'}`
            }}
          ></div>
        ))}
        
        {/* Animated background with fireflies */}
        {fireflies.map(fly => (
          <div
            key={fly.id}
            className="fixed rounded-full pointer-events-none z-40"
            style={{
              left: `${fly.x}px`,
              top: `${fly.y}px`,
              width: `${fly.size}px`,
              height: `${fly.size}px`,
              backgroundColor: '#fffbeb',
              opacity: fly.opacity,
              boxShadow: `0 0 ${fly.size * 2}px ${fly.size}px rgba(253, 224, 71, 0.7), 0 0 ${fly.size}px ${fly.size/2}px rgba(253, 224, 71, 0.5)`,
              transition: 'box-shadow 0.2s ease-out'
            }}
          />
        ))}
      </div>
      
      {/* Navbar with animated glow */}
      <div className="w-full bg-gray-900 bg-opacity-70 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-amber-800/30 shadow-lg z-10 relative">
        <div className="text-2xl font-bold text-yellow-300 font-[&apos;Press_Start_2P&apos;,_monospace] tracking-tight group relative">
          <span className="text-red-500 animate-pulse" style={{ textShadow: "0 0 5px #ff0000, 0 0 10px #ff0000" }}>臺</span>
          <span className="text-yellow-300" style={{ textShadow: "0 0 5px #FFD700, 0 0 10px #FFD700" }}>北</span>
          <span className="text-red-500 animate-pulse" style={{ textShadow: "0 0 5px #ff0000, 0 0 10px #ff0000", animationDelay: "0.5s" }}>夜</span>
          <span className="text-yellow-300" style={{ textShadow: "0 0 5px #FFD700, 0 0 10px #FFD700" }}>市</span>
          <span className="ml-2 text-white text-opacity-90 text-xl">Taifei Bazaar</span>
          
          {/* Hover reveal neon effect */}
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 via-yellow-300 to-red-500 group-hover:w-full transition-all duration-500 shadow-glow"></div>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <a 
            href="#features" 
            onClick={(e) => { e.preventDefault(); scrollToFeatures(); }} 
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800/50 hover:bg-amber-900/30 text-amber-200/70 hover:text-amber-200 transition-all duration-300 border border-transparent hover:border-amber-500/30 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Features
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-amber-600/0 via-amber-600/10 to-amber-600/0 transition-opacity duration-300"></div>
          </a>
          
          <a 
            href="#protocols" 
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800/50 hover:bg-purple-900/30 text-purple-200/70 hover:text-purple-200 transition-all duration-300 border border-transparent hover:border-purple-500/30 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Protocols
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 transition-opacity duration-300"></div>
          </a>
          
          <a 
            href="#about" 
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800/50 hover:bg-blue-900/30 text-blue-200/70 hover:text-blue-200 transition-all duration-300 border border-transparent hover:border-blue-500/30 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transition-opacity duration-300"></div>
          </a>
          
          <a 
            href="#team" 
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800/50 hover:bg-pink-900/30 text-pink-200/70 hover:text-pink-200 transition-all duration-300 border border-transparent hover:border-pink-500/30 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Team
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-pink-600/0 via-pink-600/10 to-pink-600/0 transition-opacity duration-300"></div>
          </a>
          
          <a 
            href="https://github.com/yourusername/taifei-bazaar" 
          target="_blank"
          rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800/50 hover:bg-emerald-900/30 text-emerald-200/70 hover:text-emerald-200 transition-all duration-300 border border-transparent hover:border-emerald-500/30 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 opacity-70 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-emerald-600/0 via-emerald-600/10 to-emerald-600/0 transition-opacity duration-300"></div>
          </a>
        </div>
        
        <WalletConnect onConnectionChange={setIsWalletConnected} />
      </div>

      {/* Hero Section with parallax effect */}
      <div className="relative flex flex-col items-center justify-center max-w-5xl mx-auto px-4 py-20 text-center z-10">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 -z-10"></div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-10 relative group perspective-1000">
          {/* Decorative lanterns */}
          <div className="absolute -left-8 -top-8 w-10 h-14 bg-red-600 rounded-full opacity-90 shadow-lg shadow-red-500/50 animate-float-lantern-slow"></div>
          <div className="absolute -right-8 -top-10 w-8 h-12 bg-amber-500 rounded-full opacity-90 shadow-lg shadow-amber-500/50 animate-float-lantern-slow" style={{animationDelay: '1s'}}></div>
          
          {/* Main Chinese title with neon effect */}
          <div className="relative inline-block transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1">
            <span className="text-yellow-300 font-[&apos;Press_Start_2P&apos;,_monospace] tracking-tight inline-block animate-float-subtle relative">
              <span className="relative z-10 inline-block">臺</span>
              <span className="relative z-10 inline-block">北</span>
              <span className="relative z-10 inline-block">夜</span>
              <span className="relative z-10 inline-block">市</span>
              
              {/* Character-specific neon glows */}
              <span className="absolute inset-0 filter blur-md text-red-500 z-0 animate-pulse-glow" style={{animationDelay: '0s'}}>臺</span>
              <span className="absolute inset-0 filter blur-md text-yellow-400 z-0 animate-pulse-glow" style={{animationDelay: '0.5s'}}>北</span>
              <span className="absolute inset-0 filter blur-md text-red-500 z-0 animate-pulse-glow" style={{animationDelay: '1s'}}>夜</span>
              <span className="absolute inset-0 filter blur-md text-yellow-400 z-0 animate-pulse-glow" style={{animationDelay: '1.5s'}}>市</span>
            </span>
            
            {/* Light beam effect */}
            <div className="absolute -inset-3 rounded-lg bg-gradient-to-r from-red-500/0 via-yellow-300/10 to-red-500/0 -z-10 blur-xl animate-pulse-slow"></div>
          </div>
        </h1>
        
        <h2 className="text-4xl md:text-6xl font-bold mb-12 relative perspective transform transition-all">
          {/* 3D layered text effect */}
          <div className="relative inline-block transform hover:rotate-y-12 transition-transform duration-700">
            <span className="absolute -left-1 -top-1 bg-clip-text text-transparent bg-gradient-to-br from-red-700/50 to-amber-900/50 select-none">Taifei Bazaar</span>
            <span className="absolute -left-0.5 -top-0.5 bg-clip-text text-transparent bg-gradient-to-br from-red-600/70 to-amber-800/70 select-none">Taifei Bazaar</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 animate-text-shimmer relative z-10">Taifei Bazaar</span>
            
            {/* Electric spark effect */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={`spark-${i}`}
                  className="absolute bg-white w-[1px] h-[10px] opacity-0 animate-electric-spark" 
                  style={{ 
                    left: `${20 + i * 20}%`, 
                    top: '50%',
                    animationDelay: `${i * 1.5}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Bottom glow */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-2 bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0 blur-md"></div>
        </h2>
        
        <p className="text-xl mb-8 max-w-3xl text-amber-50 leading-relaxed relative">
          <span className="bg-gradient-to-r from-transparent via-black/10 to-transparent p-4 rounded-lg block backdrop-blur-sm border border-white/10">
            Experience a gamified DeFi journey through a vibrant Taiwanese night market. Interact with AI agents representing various DeFi protocols, stake assets, swap tokens, and earn rewards - all in an immersive pixel-art world.
          </span>
        </p>

        {/* Stats section */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="bg-gray-900/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">10+</div>
            <div className="text-xs text-yellow-200/70">DeFi Protocols</div>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">6</div>
            <div className="text-xs text-blue-200/70">Market Stalls</div>
          </div>
          <div className="bg-gray-900/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-xs text-green-200/70">Availability</div>
          </div>
        </div>

        {/* Replace the button with the BazaarEntrance component */}
        <BazaarEntrance isWalletConnected={isWalletConnected} />
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce mt-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      {/* Market preview section */}
      <div className="w-full py-24 bg-gradient-to-b from-blue-950/50 to-indigo-950/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-yellow-300">Experience the Night Market</h2>
              <p className="text-lg mb-6 text-gray-300">Navigate through our immersive pixel-art representation of a Taiwanese night market. Visit different stalls, each representing a DeFi protocol with unique functionalities.</p>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-amber-500/20">
                <h3 className="text-xl font-bold mb-3 text-amber-400">🌟 Interactive Exploration</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    Walk around using arrow keys
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    Interact with stalls using E key
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    Express yourself with emotes (X key)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    Customize your character name
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 overflow-hidden rounded-lg border-4 border-gray-800 shadow-2xl">
              <div className="w-full h-72 bg-blue-950 relative">
                {/* Simplified market preview */}
                <div className="absolute inset-0 bg-blue-950 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900">
                    <div className="h-full flex items-center justify-center text-white font-bold">
                      <span className="text-red-500 animate-pulse px-2">臺北</span>
                      <span className="text-yellow-300 px-2">夜市</span>
                    </div>
                  </div>
                  
                  {/* Sample stalls */}
                  <div className="absolute left-1/4 top-1/3 w-32 h-24 bg-rose-800 rounded-sm border border-rose-900"></div>
                  <div className="absolute right-1/4 top-1/3 w-32 h-24 bg-indigo-800 rounded-sm border border-indigo-900"></div>
                  <div className="absolute left-1/2 bottom-1/4 w-32 h-24 bg-amber-800 rounded-sm border border-amber-900"></div>
                  
                  {/* Character representation */}
                  <div className="absolute left-1/2 top-1/2 w-6 h-8 bg-red-600 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-full h-1/3 bg-[#F5D7B5]"></div>
                  </div>
                </div>
                
                <div className="absolute inset-0 backdrop-blur-[1px] flex items-center justify-center">
                  <button className="px-5 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-lg">
                    Enter to Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div id="features" ref={featuresRef} className="w-full py-24 relative z-10 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 right-20 w-72 h-72 bg-red-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-40 left-1/4 text-9xl text-yellow-500/10 font-bold rotate-12">功</div>
          <div className="absolute top-20 right-1/4 text-9xl text-red-500/10 font-bold -rotate-6">能</div>
        </div>
      
        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-16 text-yellow-300">
            <span className="relative inline-block">
              Key Features
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70 hidden md:block"></div>
              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70 hidden md:block"></div>
            </span>
          </h2>
          
          {/* Chinese lanterns top decoration */}
          <div className="absolute -top-10 left-1/4 w-16 h-20 opacity-40 pointer-events-none">
            <div className="w-full h-3/4 bg-red-600 rounded-t-full"></div>
            <div className="w-px h-5 bg-yellow-900 mx-auto"></div>
          </div>
          
          <div className="absolute -top-8 right-1/3 w-12 h-16 opacity-40 pointer-events-none">
            <div className="w-full h-3/4 bg-yellow-500 rounded-t-full"></div>
            <div className="w-px h-4 bg-yellow-900 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Feature Cards */}
            <div className="bg-gradient-to-br from-gray-900/70 to-yellow-950/30 backdrop-blur-md rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-yellow-600/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-4xl mb-6 bg-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                <span className="relative z-10">🎮</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-600/20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-yellow-300 group-hover:text-yellow-200 transition-colors">Gamified DeFi</h3>
              <p className="text-gray-300">Explore DeFi in a fun, interactive way through a pixel-art world inspired by Taiwanese night markets. Transform complex financial interactions into engaging experiences.</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-blue-950/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-600/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-4xl mb-6 bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                <span className="relative z-10">🤖</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-600/20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-300 group-hover:text-blue-200 transition-colors">AI Agents</h3>
              <p className="text-gray-300">Interact with AI-powered agents that help you understand and use various DeFi protocols. Get guidance and insights as you navigate the digital financial marketplace.</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-purple-950/30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-600/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-4xl mb-6 bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                <span className="relative z-10">💱</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-600/20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-300 group-hover:text-purple-200 transition-colors">Multi-Chain Support</h3>
              <p className="text-gray-300">Interact with protocols on multiple chains including Ethereum, Rootstock, and Celo. Experience seamless cross-chain operations within a unified interface.</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-green-950/30 backdrop-blur-md rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-green-600/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-4xl mb-6 bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                <span className="relative z-10">🔐</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-300 group-hover:text-green-200 transition-colors">Self-Custody</h3>
              <p className="text-gray-300">Always maintain control of your assets with non-custodial wallet integration. Your funds remain in your control while you enjoy the full marketplace experience.</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-rose-950/30 backdrop-blur-md rounded-xl p-6 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-rose-600/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-4xl mb-6 bg-rose-500/20 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                <span className="relative z-10">🏪</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-600/20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-rose-300 group-hover:text-rose-200 transition-colors">Protocol Marketplace</h3>
              <p className="text-gray-300">Each stall represents a different protocol with unique offerings and rewards. Discover new opportunities as you wander through our vibrant digital marketplace.</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-amber-950/30 backdrop-blur-md rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 group hover:shadow-lg hover:shadow-amber-600/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-4xl mb-6 bg-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                <span className="relative z-10">🧠</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 blur-sm"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-amber-300 group-hover:text-amber-200 transition-colors">Educational</h3>
              <p className="text-gray-300">Learn about DeFi through interactive experiences and visual feedback. Gain practical knowledge while exploring the ecosystem in a risk-free environment.</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          
          {/* Dragon/paper cut style decorative element */}
          <div className="flex justify-center mt-16">
            <div className="relative w-40 h-10 opacity-30">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-yellow-500 to-transparent"></div>
              <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-yellow-500 to-transparent"></div>
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Protocols section */}
      <div id="protocols" className="w-full py-24 bg-gradient-to-b from-indigo-950/50 to-blue-950/50 backdrop-blur-sm relative z-10 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute bottom-40 right-1/4 text-9xl text-violet-500/10 font-bold rotate-12">協</div>
          <div className="absolute top-20 left-1/4 text-9xl text-blue-500/10 font-bold -rotate-6">議</div>
          
          {/* Flowing banners */}
          <div className="absolute top-10 left-0 right-0 h-20">
            <div className="w-full h-px bg-indigo-500/20"></div>
            <div className="absolute top-5 left-1/5 w-px h-10 bg-indigo-500/20"></div>
            <div className="absolute top-5 left-2/5 w-px h-10 bg-indigo-500/20"></div>
            <div className="absolute top-5 left-3/5 w-px h-10 bg-indigo-500/20"></div>
            <div className="absolute top-5 left-4/5 w-px h-10 bg-indigo-500/20"></div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-4 text-yellow-300">
            <span className="relative inline-block">
              Supported Protocols
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
              <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-70 hidden md:block"></div>
              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-70 hidden md:block"></div>
            </span>
          </h2>
          <p className="text-center mb-16 text-gray-300 max-w-3xl mx-auto">Interact with these protocols through our night market stalls. Each protocol offers different opportunities for earning, staking, and swapping assets.</p>
          
          {/* Neon sign effect */}
          <div className="relative w-full h-8 mb-12">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center">
              <div className="px-10 py-1 bg-indigo-900/30 rounded-full border border-indigo-500/30 text-indigo-300 text-sm font-semibold animate-pulse-light inline-block">
                <span className="text-purple-300">●</span> LIVE PROTOCOLS <span className="text-blue-300">●</span>
              </div>
            </div>
          </div>
          
          {/* Protocol Stalls - Enhanced Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Protocol Stall 1 */}
            <div className="bg-gradient-to-br from-gray-900/80 to-amber-950/20 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-500/30 group hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/20 relative">
              {/* Stall Roof */}
              <div className="w-full h-3 bg-amber-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-roof opacity-20"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3 relative">
                      <span className="relative z-10">🔒</span>
                      <div className="absolute inset-0 rounded-full bg-amber-500/20 filter blur-sm transform scale-125"></div>
                    </div>
                    <h3 className="text-lg font-bold text-amber-300 group-hover:text-amber-200 transition-colors">Rootstock Staking</h3>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-amber-900/30 border border-amber-500/20 text-amber-400 text-xs">
                    Earn
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">Stake your RBTC for stability and rewards. Earn passive income while supporting network security.</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-amber-200/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Active
                  </div>
                  <div className="text-amber-400/80 text-sm">APY: ~5.2%</div>
                </div>
                
                {/* Hover highlight */}
                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Protocol Stall 2 */}
            <div className="bg-gradient-to-br from-gray-900/80 to-rose-950/20 backdrop-blur-sm rounded-xl overflow-hidden border border-rose-500/30 group hover:border-rose-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-600/20 relative">
              {/* Stall Roof */}
              <div className="w-full h-3 bg-rose-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-roof opacity-20"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3 relative">
                      <span className="relative z-10">🔄</span>
                      <div className="absolute inset-0 rounded-full bg-rose-500/20 filter blur-sm transform scale-125"></div>
                    </div>
                    <h3 className="text-lg font-bold text-rose-300 group-hover:text-rose-200 transition-colors">Rootstock Swapping</h3>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-rose-900/30 border border-rose-500/20 text-rose-400 text-xs">
                    Swap
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">Swap assets on the Rootstock blockchain with low fees and Bitcoin security. Fast and reliable transactions.</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-rose-200/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Active
                  </div>
                  <div className="text-rose-400/80 text-sm">Fee: 0.3%</div>
                </div>
                
                {/* Hover highlight */}
                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Protocol Stall 3 */}
            <div className="bg-gradient-to-br from-gray-900/80 to-emerald-950/20 backdrop-blur-sm rounded-xl overflow-hidden border border-emerald-500/30 group hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/20 relative">
              {/* Stall Roof */}
              <div className="w-full h-3 bg-emerald-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-roof opacity-20"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3 relative">
                      <span className="relative z-10">💰</span>
                      <div className="absolute inset-0 rounded-full bg-emerald-500/20 filter blur-sm transform scale-125"></div>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors">Token Prices</h3>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 text-xs">
                    Data
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">Real-time price monitoring for tokens across multiple chains. Stay updated with market trends and opportunities.</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-emerald-200/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Active
                  </div>
                  <div className="text-emerald-400/80 text-sm">Updated: Live</div>
                </div>
                
                {/* Hover highlight */}
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Protocol Stall 4 */}
            <div className="bg-gradient-to-br from-gray-900/80 to-indigo-950/20 backdrop-blur-sm rounded-xl overflow-hidden border border-indigo-500/30 group hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/20 relative">
              {/* Stall Roof */}
              <div className="w-full h-3 bg-indigo-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-roof opacity-20"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3 relative">
                      <span className="relative z-10">🔄</span>
                      <div className="absolute inset-0 rounded-full bg-indigo-500/20 filter blur-sm transform scale-125"></div>
                    </div>
                    <h3 className="text-lg font-bold text-indigo-300 group-hover:text-indigo-200 transition-colors">Celo Swapping</h3>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/20 text-indigo-400 text-xs">
                    Swap
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">Swap assets on the Celo network with carbon-negative blockchain technology. Mobile-first and eco-friendly.</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-indigo-200/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Active
                  </div>
                  <div className="text-indigo-400/80 text-sm">Fee: 0.25%</div>
                </div>
                
                {/* Hover highlight */}
                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Protocol Stall 5 */}
            <div className="bg-gradient-to-br from-gray-900/80 to-violet-950/20 backdrop-blur-sm rounded-xl overflow-hidden border border-violet-500/30 group hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-600/20 relative">
              {/* Stall Roof */}
              <div className="w-full h-3 bg-violet-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-roof opacity-20"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3 relative">
                      <span className="relative z-10">📈</span>
                      <div className="absolute inset-0 rounded-full bg-violet-500/20 filter blur-sm transform scale-125"></div>
                    </div>
                    <h3 className="text-lg font-bold text-violet-300 group-hover:text-violet-200 transition-colors">Celo Staking</h3>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-violet-900/30 border border-violet-500/20 text-violet-400 text-xs">
                    Earn
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">Stake Celo assets for rewards. Support mobile-first financial infrastructure while earning passive income.</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-violet-200/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    Active
                  </div>
                  <div className="text-violet-400/80 text-sm">APY: ~6.5%</div>
                </div>
                
                {/* Hover highlight */}
                <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
            
            {/* Protocol Stall 6 - Coming soon */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/20 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-500/30 group hover:border-gray-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-600/20 relative">
              {/* Stall Roof */}
              <div className="w-full h-3 bg-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-roof opacity-20"></div>
              </div>
              
              {/* Content */}
              <div className="p-6 pt-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3 relative">
                      <span className="relative z-10">⚙️</span>
                      <div className="absolute inset-0 rounded-full bg-gray-500/20 filter blur-sm transform scale-125"></div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-300 group-hover:text-gray-200 transition-colors">More Coming</h3>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-gray-900/30 border border-gray-500/20 text-gray-400 text-xs">
                    Soon
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">New protocols added regularly. Check back soon for more DeFi opportunities and exciting new features.</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-400/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-1"></span>
                    In Development
                  </div>
                  <div className="text-gray-400/80 text-sm">Coming Soon</div>
                </div>
                
                {/* Hover highlight */}
                <div className="absolute inset-0 bg-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </div>
          </div>
          
          {/* Market decoration at bottom */}
          <div className="mt-16 flex justify-center">
            <div className="flex space-x-10 opacity-30">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-indigo-500 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* About section */}
      <div id="about" className="w-full py-24 relative z-10 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-500 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-yellow-500 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 text-9xl text-amber-500/10 font-bold">市</div>
          <div className="absolute bottom-1/3 left-1/4 text-9xl text-red-500/10 font-bold">夜</div>
        </div>
      
        <div className="max-w-5xl mx-auto px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-16 text-yellow-300">
            <span className="relative inline-block">
              About Taifei Bazaar
              <div className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </span>
          </h2>
          
          <div className="bg-gradient-to-br from-gray-900/70 to-indigo-950/50 backdrop-blur-md rounded-xl p-8 border border-yellow-500/20 shadow-lg shadow-amber-900/10 mb-12 relative overflow-hidden">
            {/* Subtle corner lantern decoration */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-red-600/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl"></div>
            
            <h3 className="text-2xl font-bold mb-6 text-yellow-300 text-center relative">
              <span className="relative inline-block px-8">
                The Night Market Experience
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70"></div>
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70"></div>
              </span>
            </h3>
            
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 mb-8 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-600/20 to-yellow-500/20 flex items-center justify-center border border-yellow-500/20">
                    <span className="text-5xl">🏮</span>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <p className="text-gray-300">Taifei Bazaar draws inspiration from the vibrant night markets of Taiwan, known for their diverse offerings, lively atmosphere, and unique cultural experiences. Just as visitors explore traditional markets to discover treasures and delicacies, users navigate our digital market to explore the world of decentralized finance.</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-6 text-yellow-300 text-center relative">
              <span className="relative inline-block px-8">
                Our Mission
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70"></div>
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70"></div>
              </span>
            </h3>
            
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/4 flex justify-center order-1 md:order-2">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                    <span className="text-5xl">🌉</span>
                  </div>
                </div>
                <div className="md:w-3/4 order-2 md:order-1">
                  <p className="text-gray-300">We are building a bridge between the complex world of DeFi and everyday users by creating an intuitive, engaging interface that makes blockchain interactions fun and accessible. By gamifying the experience, we remove the intimidation factor while maintaining all the powerful functionality of the underlying protocols.</p>
                </div>
              </div>
            </div>
            
            {/* Add new vision section */}
            <h3 className="text-2xl font-bold mt-10 mb-6 text-yellow-300 text-center relative">
              <span className="relative inline-block px-8">
                Our Vision
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70"></div>
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-70"></div>
              </span>
            </h3>
            
            <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="md:w-1/4 flex justify-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-600/20 to-cyan-500/20 flex items-center justify-center border border-green-500/20">
                    <span className="text-5xl">🚀</span>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <p className="text-gray-300">We envision a future where decentralized finance is as intuitive and accessible as traditional markets. Taifei Bazaar represents our first step toward creating experiences that combine the rich cultural heritage of traditional marketplaces with the innovative potential of blockchain technology.</p>
                </div>
              </div>
            </div>
            
            {/* Chinese paper cut-style dividers */}
            <div className="flex justify-center my-10">
              <div className="flex space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full opacity-70"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-70"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full opacity-70"></div>
              </div>
            </div>
            
            {/* Quote section */}
            <div className="text-center px-4 py-6 italic text-gray-300 relative">
              <div className="absolute left-0 top-0 text-4xl text-yellow-500/30">&ldquo;</div>
              <p className="text-lg">Connecting tradition with innovation, Taifei Bazaar bridges the gap between cultural experiences and technological advancement.</p>
              <div className="absolute right-0 bottom-0 text-4xl text-yellow-500/30">&rdquo;</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div id="team" className="w-full py-24 bg-gradient-to-b from-blue-950/30 via-indigo-950/50 to-purple-950/30 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-yellow-300">
            <span className="relative">
              Our Team
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </span>
          </h2>
          <p className="text-center mb-16 text-gray-300 max-w-3xl mx-auto">Meet the talented developers behind Taifei Bazaar who brought this vision to life.</p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Team Member 1 */}
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl p-6 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 max-w-md group">
              <div className="flex items-start gap-4">
                {/* Random generated avatar */}
                <div className="w-24 h-24 rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-900/70"></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-pink-300 mb-1 group-hover:text-pink-200 transition-colors">Yash Jagtap</h3>
                  <p className="text-gray-400 text-sm mb-3">Builder</p>
                  <p className="text-gray-300 mb-4 text-sm">Engineer @ The Graph</p>
                  
                  <div className="flex gap-3">
                    <a href="https://github.com/yash251" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-300 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/0x_yasshhh_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-300 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/yash-jagtap-46384610a/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-300 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 max-w-md group">
              <div className="flex items-start gap-4">
                {/* Random generated avatar */}
                <div className="w-24 h-24 rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/70"></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-300 mb-1 group-hover:text-blue-200 transition-colors">Siddesh Sankhya</h3>
                  <p className="text-gray-400 text-sm mb-3">Builder</p>
                  <p className="text-gray-300 mb-4 text-sm">Engineer @ Push</p>
                  
                  <div className="flex gap-3">
                    <a href="https://github.com/Siddesh7" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/0xSiddesh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/siddesh-eth/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-300 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to action */}
      <div className="w-full py-20 bg-gradient-to-r from-yellow-900/20 via-amber-800/20 to-yellow-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-yellow-300">Ready to Explore the Bazaar?</h2>
          <p className="text-xl mb-10 text-gray-300">Connect your wallet and start your DeFi journey through our interactive night market experience.</p>
          
          <BazaarEntrance isWalletConnected={isWalletConnected} />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-12 bg-gray-900 border-t border-amber-900/30 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <h3 className="text-2xl font-bold text-yellow-300 font-[&apos;Press_Start_2P&apos;,_monospace] tracking-tight">
                  <span className="text-red-500">臺</span>
                  <span className="text-yellow-300">北</span>
                  <span className="text-red-500">夜</span>
                  <span className="text-yellow-300">市</span>
                </h3>
              </div>
              <p className="text-gray-400 max-w-md">A gamified DeFi experience set in a vibrant Taiwanese night market environment.</p>
            </div>
            
            <div className="flex gap-12">
              <div>
                <h4 className="font-bold text-white mb-4">Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-yellow-300 transition-colors">Features</a></li>
                  <li><a href="#protocols" className="hover:text-yellow-300 transition-colors">Protocols</a></li>
                  <li><a href="#about" className="hover:text-yellow-300 transition-colors">About</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">GitHub</a></li>
                  <li><a href="#" className="hover:text-yellow-300 transition-colors">Support</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2025 Taifei Bazaar. All rights reserved.</p>
            <p className="mt-2">Built with ❤️ at ETHGlobal Taipei 2025</p>
          </div>
        </div>
      </footer>
      
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-subtle {
          0% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(-1deg); }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { opacity: 0.3; }
        }
        
        @keyframes pulse-light {
          0% { opacity: 0.4; box-shadow: 0 0 4px 1px currentColor; }
          50% { opacity: 0.8; box-shadow: 0 0 8px 2px currentColor; }
          100% { opacity: 0.4; box-shadow: 0 0 4px 1px currentColor; }
        }
        
        @keyframes twinkle {
          0% { opacity: 0.1; }
          50% { opacity: 0.7; }
          100% { opacity: 0.1; }
        }
        
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-float-subtle {
          animation: float-subtle 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-light {
          animation: pulse-light 5s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 8s ease-in-out infinite;
        }
        
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 6s linear infinite;
        }
        
        .shadow-glow {
          box-shadow: 0 0 10px 0 rgba(253, 224, 71, 0.5);
        }
        
        @keyframes electric-spark {
          0% { opacity: 0; transform: translateY(10px) translateX(-5px); }
          5% { opacity: 0.9; transform: translateY(-15px) translateX(5px); height: 15px; }
          10% { opacity: 0; transform: translateY(-25px) translateX(-5px); height: 5px; }
          100% { opacity: 0; }
        }
        
        @keyframes float-lantern-slow {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes pulse-glow {
          0% { opacity: 0.4; filter: blur(4px); }
          50% { opacity: 0.8; filter: blur(6px); }
          100% { opacity: 0.4; filter: blur(4px); }
        }
        
        @keyframes rotate-y-12 {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(12deg); }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .animate-float-lantern-slow {
          animation: float-lantern-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-electric-spark {
          animation: electric-spark 10s ease-out infinite;
        }
        
        .rotate-y-12 {
          transform: rotateY(12deg);
        }
        
        .bg-pattern-roof {
          background-image: repeating-linear-gradient(
            to right,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 2px,
            transparent 6px
          );
        }
      `}</style>
    </main>
  );
}