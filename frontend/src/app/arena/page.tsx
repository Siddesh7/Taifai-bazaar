"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function Arena() {
  const [position, setPosition] = useState({ x: 600, y: 300 });
  const [showControls, setShowControls] = useState(true);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [showEmoteMenu, setShowEmoteMenu] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<string | null>(null);
  const [username, setUsername] = useState("Guest");
  const [showNameInput, setShowNameInput] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 600 });
  const router = useRouter();
  const { user, authenticated } = usePrivy();
  
  // Get wallet address
  const walletAddress = user?.wallet?.address || "";
  
  const formattedAddress = walletAddress 
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "";
    
  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Track viewport size
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateViewportSize();
    
    window.addEventListener('resize', updateViewportSize);
    
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  const step = 10; 
  const characterSize = { width: 32, height: 48 }; 
  const tileSize = 32; 

  const toggleControlsVisibility = () => {
    setShowControls(!showControls);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      
      if (showEmoteMenu) {
        setShowEmoteMenu(false);
        return;
      }

      if (showNameInput) {
        return;
      }

      if (event.key === 'x') {
        setShowEmoteMenu(prev => !prev);
        return;
      }

      if (event.key === 'e' && activeTile !== null) {
    
        console.log(`Interacting with stall ${activeTile}`);
        return;
      }

      setPosition((prevPosition) => {
        let newX = prevPosition.x;
        let newY = prevPosition.y;

        switch (event.key) {
          case "ArrowUp":
            newY = Math.max(0, prevPosition.y - step);
            break;
          case "ArrowDown":
            newY = Math.min(
              viewportSize.height - characterSize.height,
              prevPosition.y + step
            );
            break;
          case "ArrowLeft":
            newX = Math.max(0, prevPosition.x - step);
            break;
          case "ArrowRight":
            newX = Math.min(
              viewportSize.width - characterSize.width,
              prevPosition.x + step
            );
            break;
          default:
            return prevPosition;
        }

        checkNearbyStalls({ x: newX, y: newY });
        
        if (currentEmote) {
          setCurrentEmote(null);
        }

        return { x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    checkNearbyStalls(position);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [position, activeTile, showEmoteMenu, currentEmote, showNameInput, viewportSize]);

  const checkNearbyStalls = (pos: { x: number, y: number }) => {
    const nearbyStall = stalls.find(stall => 
      Math.abs((pos.x + characterSize.width/2) - (stall.x + stall.width/2)) < 80 && 
      Math.abs((pos.y + characterSize.height/2) - (stall.y + stall.height/2)) < 80
    );
    
    setActiveTile(nearbyStall ? nearbyStall.id : null);
  };

  const handleEmoteSelect = (emote: string) => {
    setCurrentEmote(emote);
    setShowEmoteMenu(false);
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNameInput(false);
  };

  const returnToHome = () => {
    router.push("/");
  };

  const stalls = [
    // Left side - Rootstock
    {
      id: 1,
      name: "Rootstock Swap Station",
      x: viewportSize.width * 0.25 - 90, // Position relative to viewport width
      y: viewportSize.height * 0.35,
      width: 180,
      height: 120,
      bgColor: "bg-rose-800",
      borderColor: "border-rose-900",
      roofColor: "bg-rose-700",
      roofAltColor: "bg-rose-800",
      accentColor: "bg-rose-500",
      darkColor: "bg-rose-950",
      counterColor: "bg-rose-400",
      area: "left",
      icon: "🔄",
      description: "Exchange tokens on Rootstock with the best rates in the night market",
      decorations: ["lantern", "strings", "steam"]
    },
    {
      id: 2,
      name: "Rootstock Staking House",
      x: viewportSize.width * 0.20 - 90,
      y: viewportSize.height * 0.7,
      width: 180,
      height: 120,
      bgColor: "bg-amber-800",
      borderColor: "border-amber-900",
      roofColor: "bg-amber-700",
      roofAltColor: "bg-amber-800",
      accentColor: "bg-amber-500",
      darkColor: "bg-amber-950",
      counterColor: "bg-amber-400",
      area: "left",
      icon: "📈",
      description: "Stake your assets and earn while enjoying the market",
      decorations: ["coins", "abacus", "incense"]
    },
    // Center - Information
    {
      id: 3,
      name: "Market Info Pavilion",
      x: viewportSize.width * 0.5 - 90,
      y: viewportSize.height * 0.25,
      width: 180,
      height: 120,
      bgColor: "bg-blue-800",
      borderColor: "border-blue-900",
      roofColor: "bg-blue-700",
      roofAltColor: "bg-blue-800",
      accentColor: "bg-blue-500",
      darkColor: "bg-blue-950",
      counterColor: "bg-blue-400",
      area: "center",
      icon: "ℹ️",
      description: "Discover everything about crypto and blockchain technology",
      decorations: ["maps", "scrolls", "brush"]
    },
    {
      id: 4,
      name: "Fortune Price Oracle",
      x: viewportSize.width * 0.45 - 90, 
      y: viewportSize.height * 0.6,
      width: 180,
      height: 120,
      bgColor: "bg-teal-800",
      borderColor: "border-teal-900",
      roofColor: "bg-teal-700",
      roofAltColor: "bg-teal-800",
      accentColor: "bg-teal-500",
      darkColor: "bg-teal-950",
      counterColor: "bg-teal-400",
      area: "center",
      icon: "💰",
      description: "Get the latest token price predictions and market trends",
      decorations: ["fortune", "teacup", "coins"]
    },
    // Right side - Celo
    {
      id: 5,
      name: "Celo Trading Post",
      x: viewportSize.width * 0.8 - 90,
      y: viewportSize.height * 0.28,
      width: 180,
      height: 120,
      bgColor: "bg-indigo-800",
      borderColor: "border-indigo-900",
      roofColor: "bg-indigo-700",
      roofAltColor: "bg-indigo-800",
      accentColor: "bg-indigo-500",
      darkColor: "bg-indigo-950",
      counterColor: "bg-indigo-400",
      area: "right",
      icon: "🔄",
      description: "Trade tokens on Celo with special night market rates",
      decorations: ["baskets", "steam", "glow"]
    },
    {
      id: 6,
      name: "Celo Staking Bar",
      x: viewportSize.width * 0.7 - 90,
      y: viewportSize.height * 0.55,
      width: 180,
      height: 120,
      bgColor: "bg-violet-800",
      borderColor: "border-violet-900",
      roofColor: "bg-violet-700",
      roofAltColor: "bg-violet-800",
      accentColor: "bg-violet-500",
      darkColor: "bg-violet-950",
      counterColor: "bg-violet-400",
      area: "right",
      icon: "📈",
      description: "Stake your Celo assets while enjoying bubble tea",
      decorations: ["bubbles", "tea", "straws"]
    },
    // Add your own stall - special stall for expansion
    {
      id: 7,
      name: "Add Your Stall",
      x: viewportSize.width * 0.85 - 90,
      y: viewportSize.height * 0.75,
      width: 180,
      height: 120,
      bgColor: "bg-gray-700",
      borderColor: "border-gray-600",
      roofColor: "bg-gray-600",
      roofAltColor: "bg-gray-700",
      accentColor: "bg-emerald-500",
      darkColor: "bg-gray-900",
      counterColor: "bg-emerald-400",
      area: "expansion",
      icon: "➕",
      description: "Join the night market with your own blockchain project",
      decorations: ["blueprint", "dashed", "glow"],
      isExpansion: true
    },
  ];

  // Define Taiwanese-style lantern positions scattered across the entire arena
  const lanterns = [
    // Top area
    { x: viewportSize.width * 0.15, y: 140, color: "red", size: 0.9 },
    { x: viewportSize.width * 0.38, y: 160, color: "yellow", size: 0.8 },
    { x: viewportSize.width * 0.73, y: 150, color: "yellow", size: 1 },
    { x: viewportSize.width * 0.92, y: 135, color: "red", size: 0.7 },
    
    // Mid-left area
    { x: viewportSize.width * 0.05, y: viewportSize.height * 0.35, color: "yellow", size: 0.7 },
    { x: viewportSize.width * 0.12, y: viewportSize.height * 0.5, color: "red", size: 0.85 },
    
    // Mid-right area
    { x: viewportSize.width * 0.85, y: viewportSize.height * 0.42, color: "red", size: 0.8 },
    { x: viewportSize.width * 0.95, y: viewportSize.height * 0.55, color: "yellow", size: 0.75 },
    
    // Bottom area
    { x: viewportSize.width * 0.25, y: viewportSize.height * 0.82, color: "yellow", size: 0.9 },
    { x: viewportSize.width * 0.6, y: viewportSize.height * 0.88, color: "red", size: 0.8 },
    { x: viewportSize.width * 0.78, y: viewportSize.height * 0.8, color: "yellow", size: 0.85 },
  ];

  const streetFoodItems = [
    { x: viewportSize.width * 0.25, y: viewportSize.height * 0.45, emoji: "🧋" },
    { x: viewportSize.width * 0.4, y: viewportSize.height * 0.25, emoji: "🥟" },
    { x: viewportSize.width * 0.6, y: viewportSize.height * 0.45, emoji: "🍜" },
    { x: viewportSize.width * 0.75, y: viewportSize.height * 0.25, emoji: "🥘" },
    { x: viewportSize.width * 0.8, y: viewportSize.height * 0.7, emoji: "🍤" },
    { x: viewportSize.width * 0.2, y: viewportSize.height * 0.7, emoji: "🦪" },
  ];

  const emotes = ["👋", "👍", "❤️", "😂", "🎉", "🤔", "👀", "🙏"];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-blue-950">
      {/* Top nav bar with back button */}
      <div className="absolute top-0 left-0 w-full bg-gray-900 bg-opacity-80 px-4 py-4 flex justify-between items-center z-50">
        <button 
          onClick={returnToHome}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center text-sm"
        >
          ← Home
        </button>
        <h1 className="text-2xl font-bold text-yellow-300 font-['Press_Start_2P',_monospace] tracking-tight">臺北夜市 - Taifei Bazaar</h1>
        <div className="px-3 py-1 bg-green-600 text-white rounded-md text-sm flex items-center">
          <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
          {formattedAddress ? (
            <div className="flex items-center">
              <span>{formattedAddress}</span>
            </div>
          ) : "Wallet Connected"}
        </div>
      </div>
      
      {/* Full-screen game area */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundImage: "radial-gradient(circle, #1a365d 0%, #0f2447 100%)",
          backgroundRepeat: "repeat",
          imageRendering: "pixelated"
        }}
      >
        {/* Pixel grid overlay */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAFElEQVRYhe3BAQEAAACAkP6v7ggKAAAuZTBhFAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wMS0wOFQxOTozNzoxMCswMDMNRxa5QAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDEtMDhUMTk6Mzc6MTArMDA6MDClLNMoAAAAAElFTkSuQmCC')",
            backgroundSize: `${tileSize}px ${tileSize}px`
          }}
        />

        {/* Night sky stars */}
        {Array.from({ length: 250 }).map((_, idx) => (
          <div 
            key={`star-${idx}`} 
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() < 0.3 ? '3px' : (Math.random() < 0.6 ? '2px' : '1px'),
              height: Math.random() < 0.3 ? '3px' : (Math.random() < 0.6 ? '2px' : '1px'),
              top: `${Math.random() * viewportSize.height}px`,
              left: `${Math.random() * viewportSize.width}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 4 + 1.5}s`,
              zIndex: 3
            }}
          />
        ))}

        {/* Shooting stars - occasional animated diagonal lines */}
        {Array.from({ length: 5 }).map((_, idx) => {
          const startX = Math.random() * viewportSize.width;
          const startY = Math.random() * viewportSize.height * 0.5;
          const length = 50 + Math.random() * 100;
          const angle = 30 + Math.random() * 30;
          
          return (
            <div 
              key={`shooting-star-${idx}`}
              className="absolute opacity-0"
              style={{
                top: `${startY}px`,
                left: `${startX}px`,
                width: `${length}px`,
                height: '1px',
                background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                transform: `rotate(${angle}deg)`,
                animation: `shooting-star ${Math.random() * 10 + 15}s linear ${Math.random() * 10}s infinite`,
                zIndex: 2
              }}
            />
          );
        })}

        {/* Night market neon sign effect at the top */}
        <div className="absolute top-16 left-0 w-full h-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 overflow-hidden z-10">
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div 
                key={`light-${idx}`} 
                className="absolute bg-white rounded-full animate-pulse" 
                style={{
                  width: '4px',
                  height: '4px',
                  top: `${Math.random() * 16}px`,
                  left: `${Math.random() * viewportSize.width}px`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          <div className="h-full flex items-center justify-center space-x-4 text-white font-bold overflow-hidden">
            <span className="text-red-500 text-lg animate-pulse font-pixel" style={{ textShadow: "0 0 5px #ff0000, 0 0 10px #ff0000" }}>臺北</span>
            <span className="text-yellow-300 text-lg font-pixel" style={{ textShadow: "0 0 5px #FFD700, 0 0 10px #FFD700" }}>夜市</span>
            <span className="text-blue-300 text-lg animate-pulse font-pixel" style={{ textShadow: "0 0 5px #87CEEB, 0 0 10px #87CEEB" }}>NIGHT</span>
            <span className="text-green-300 text-lg font-pixel" style={{ textShadow: "0 0 5px #00FF00, 0 0 10px #00FF00" }}>MARKET</span>
          </div>
        </div>

        {/* Taiwanese lanterns - with enhanced pixel-art styling */}
        {lanterns.map((lantern, idx) => (
          <div 
            key={`lantern-${idx}`} 
            className="absolute" 
            style={{ 
              left: `${lantern.x}px`, 
              top: `${lantern.y}px`, 
              zIndex: 6,
              imageRendering: "pixelated",
              opacity: 0.25,
              transform: `scale(${lantern.size})`,
              pointerEvents: "none"
            }}
          >
            <div 
              className={`w-14 h-20 flex items-center justify-center ${lantern.color === 'red' ? 'bg-red-600' : 'bg-yellow-500'}`}
              style={{ 
                boxShadow: `0 0 5px ${lantern.color === 'red' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(234, 179, 8, 0.15)'}`,
                clipPath: "polygon(20% 0%, 80% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
                animation: "pulse 3s infinite"
              }}
            >
              <div className={`w-10 h-16 ${lantern.color === 'red' ? 'bg-red-500' : 'bg-yellow-400'} flex items-center justify-center`}>
                <span className="text-white text-lg font-bold opacity-30">福</span>
              </div>
            </div>
            <div className="w-px h-6 bg-amber-900 mx-auto opacity-30"></div>
          </div>
        ))}

        {/* Taiwanese street food icons floating in the background */}
        {streetFoodItems.map((item, idx) => (
          <div 
            key={`food-${idx}`} 
            className="absolute flex flex-col items-center"
            style={{ 
              left: `${item.x}px`, 
              top: `${item.y}px`,
              zIndex: 5,
              opacity: 0.7
            }}
          >
            <span className="text-2xl">{item.emoji}</span>
          </div>
        ))}

        {/* Taipei 101 silhouette in the background */}
        <div 
          className="absolute" 
          style={{ 
            bottom: '20px',
            right: '40px',
            width: '80px',
            height: '300px',
            background: 'linear-gradient(180deg, transparent, #134e4a)',
            opacity: 0.2,
            zIndex: 1
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-40 bg-teal-900"></div>
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-16 h-16 bg-teal-900"></div>
          <div className="absolute bottom-56 left-1/2 -translate-x-1/2 w-12 h-40 bg-teal-900"></div>
          <div className="absolute bottom-96 left-1/2 -translate-x-1/2 w-8 h-16 bg-teal-900"></div>
          <div className="absolute bottom-[112px] left-1/2 -translate-x-1/2 w-4 h-8 bg-teal-900"></div>
        </div>

        {/* Render stalls - with enhanced Taiwanese night market styling */}
        {stalls.map((stall) => (
          <div
            key={stall.id}
            className={`absolute ${stall.bgColor} ${stall.borderColor} border ${stall.isExpansion ? 'border-dashed border-2' : 'border-opacity-60'} rounded-sm shadow-xl overflow-hidden ${activeTile === stall.id ? 'ring-2 ring-yellow-300 ring-opacity-50' : ''}`}
            style={{
              left: `${stall.x}px`,
              top: `${stall.y}px`,
              width: `${stall.width}px`,
              height: `${stall.height}px`,
              zIndex: 20,
              backgroundImage: stall.isExpansion ? 
                'repeating-linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' : 
                'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
              boxShadow: stall.isExpansion ? 
                '0 0 15px rgba(72, 187, 120, 0.5)' : 
                '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Enhanced Taiwanese style roof */}
            <div className={`relative h-14 ${stall.roofColor} flex items-center justify-center overflow-hidden border-b border-opacity-20 border-black`}>
              {/* Roof curve effect */}
              <div 
                className="absolute inset-x-0 top-0 h-4"
                style={{
                  background: `linear-gradient(to bottom, ${stall.roofColor.replace('bg-', '#')}, transparent)`,
                  boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.2)',
                  borderRadius: '50% 50% 0 0 / 100% 100% 0 0'
                }}
              ></div>
              
              {/* String lights on roof */}
              <div className="absolute inset-x-0 top-1 flex justify-around">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div 
                    key={`light-${stall.id}-${idx}`} 
                    className="relative"
                  >
                    <div className={`w-1.5 h-1.5 ${idx % 2 === 0 ? 'bg-yellow-300' : 'bg-red-400'} rounded-full animate-pulse`} 
                         style={{ animationDuration: `${1 + Math.random()}s` }}></div>
                  </div>
                ))}
              </div>

              {/* Red tassels hanging from roof */}
              <div className="absolute inset-x-0 top-0 flex justify-around">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div 
                    key={`tassel-${stall.id}-${idx}`} 
                    className="relative"
                  >
                    <div className="w-px h-5 bg-red-600 mx-auto"></div>
                    <div className="w-3 h-3 bg-red-600 rounded-full -mt-1"></div>
                  </div>
                ))}
              </div>

              {/* Custom stall sign with neon effect */}
              <div className="relative z-10 flex flex-col items-center">
                <span className={`text-white text-xs font-medium tracking-wide px-3 ${stall.isExpansion ? 'animate-pulse' : ''}`}
                      style={{ textShadow: stall.isExpansion ? "0 0 5px rgba(72, 187, 120, 0.8)" : "0 0 5px rgba(255,255,255,0.5)" }}>
                  {stall.name}
                </span>
                {/* Decoration based on stall type */}
                {stall.decorations?.includes("steam") && (
                  <div className="absolute -top-2 -right-16 w-8 h-8 opacity-70">
                    <div className="w-2 h-2 bg-white rounded-full absolute animate-float" 
                         style={{ left: '40%', top: '40%', animationDuration: '3s' }}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full absolute animate-float" 
                         style={{ left: '60%', top: '30%', animationDuration: '2.5s' }}></div>
                    <div className="w-1 h-1 bg-white rounded-full absolute animate-float" 
                         style={{ left: '30%', top: '50%', animationDuration: '4s' }}></div>
                  </div>
                )}
              </div>

              {/* Traditional decoration element */}
              {stall.area === "left" && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
                </div>
              )}
              {stall.area === "center" && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-3 bg-red-600"></div>
                  <div className="w-3 h-5 bg-red-600 -mt-1 ml-1"></div>
                </div>
              )}
              {stall.area === "right" && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-amber-300 rotate-45"></div>
                </div>
              )}
              {stall.area === "expansion" && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-emerald-300 border-dashed rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Stall content - with enhanced Taiwanese night market elements */}
            <div className="flex flex-col items-center justify-center h-[calc(100%-56px)] relative p-2">
              {/* Background texture based on stall type */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                {(stall.area === "left" || (stall.isExpansion && 
                  <div className="w-full h-full">
                    <div className="absolute w-full h-px bg-white/20 top-1/4"></div>
                    <div className="absolute w-full h-px bg-white/20 top-2/4"></div>
                    <div className="absolute w-full h-px bg-white/20 top-3/4"></div>
                    <div className="absolute h-full w-px bg-white/20 left-1/4"></div>
                    <div className="absolute h-full w-px bg-white/20 left-2/4"></div>
                    <div className="absolute h-full w-px bg-white/20 left-3/4"></div>
                  </div>
                )) && (
                  <div className="w-full h-full bg-repeat" style={{
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"><path d=\"M20 0 L40 20 L20 40 L0 20 Z\" fill=\"none\" stroke=\"%23000\" stroke-width=\"1\"/></svg>')",
                    backgroundSize: "20px 20px"
                  }}></div>
                )}
                {stall.area === "center" && (
                  <div className="w-full h-full bg-repeat" style={{
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><circle cx=\"10\" cy=\"10\" r=\"5\" fill=\"none\" stroke=\"%23000\" stroke-width=\"1\"/></svg>')",
                    backgroundSize: "20px 20px"
                  }}></div>
                )}
                {stall.area === "right" && (
                  <div className="w-full h-full bg-repeat" style={{
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" viewBox=\"0 0 30 30\"><path d=\"M0 0 L30 0 L30 30 L0 30 Z M0 15 L30 15 M15 0 L15 30\" fill=\"none\" stroke=\"%23000\" stroke-width=\"1\"/></svg>')",
                    backgroundSize: "30px 30px"
                  }}></div>
                )}
              </div>

              {/* Special blueprint decoration for expansion stall */}
              {stall.decorations?.includes("blueprint") && (
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#0de" strokeWidth="0.5" opacity="0.5"/>
                      </pattern>
                      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#0de" strokeWidth="1" opacity="0.8"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <circle cx="50%" cy="50%" r="25" stroke="#0de" fill="none" strokeDasharray="5,5"/>
                    <circle cx="50%" cy="50%" r="40" stroke="#0de" fill="none" strokeDasharray="3,3"/>
                    <line x1="10%" y1="10%" x2="90%" y2="90%" stroke="#0de" strokeDasharray="5,5"/>
                    <line x1="90%" y1="10%" x2="10%" y2="90%" stroke="#0de" strokeDasharray="5,5"/>
                  </svg>
                </div>
              )}

              {/* Unique decoration elements */}
              {stall.decorations?.includes("lantern") && (
                <div className="absolute -top-1 left-2">
                  <div className="w-5 h-7 rounded-full bg-red-600 flex items-center justify-center">
                    <div className="w-3 h-5 rounded-full bg-red-500 flex items-center justify-center text-[6px] text-yellow-300 font-bold">
                      福
                    </div>
                  </div>
                  <div className="w-px h-1.5 bg-amber-900 mx-auto"></div>
                </div>
              )}

              {stall.decorations?.includes("coins") && (
                <div className="absolute top-1 left-2 flex">
                  <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center -mr-1">
                    <div className="w-1.5 h-1.5 bg-amber-700 rounded-full"></div>
                  </div>
                  <div className="w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-amber-700 rounded-full"></div>
                  </div>
                </div>
              )}

              {stall.decorations?.includes("maps") && (
                <div className="absolute top-2 left-2 w-10 h-14 bg-amber-100 rotate-3">
                  <div className="w-full h-full border border-amber-800 p-0.5">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-4 gap-0.5">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={`map-${i}`} className={`bg-${['red', 'blue', 'green', 'amber', 'teal'][i % 5]}-${300 + (i % 3) * 100} h-full w-full`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {stall.decorations?.includes("fortune") && (
                <div className="absolute top-2 left-3 w-7 h-9 bg-orange-100 rotate-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={`fortune-${i}`} className="w-full h-px bg-orange-800 my-1.5"></div>
                  ))}
                </div>
              )}

              {stall.decorations?.includes("baskets") && (
                <div className="absolute top-3 left-3 w-10 h-6 rounded-b-full border-b-2 border-l-2 border-r-2 border-amber-700">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={`basket-${i}`} className="absolute top-0 h-6 w-0.5 bg-amber-700" style={{ left: `${i * 1.5 + 1}px` }}></div>
                  ))}
                </div>
              )}

              {stall.decorations?.includes("bubbles") && (
                <div className="absolute top-1 left-3 w-10 h-10">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`bubble-${i}`} 
                         className="absolute w-2 h-2 rounded-full bg-opacity-60 bg-purple-300 animate-float-slow"
                         style={{ 
                           left: `${Math.random() * 8}px`, 
                           top: `${Math.random() * 8}px`,
                           animationDelay: `${i * 0.5}s`,
                           animationDuration: `${2 + Math.random() * 3}s`
                         }}></div>
                  ))}
                </div>
              )}

              {/* Main stall content - with enhanced visual appeal */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                {/* Icon on decorative platform */}
                <div className={`text-4xl ${activeTile === stall.id || stall.isExpansion ? 'animate-pulse' : ''}`} 
                     style={{ 
                       filter: stall.isExpansion ? 'drop-shadow(0 0 8px rgba(72, 187, 120, 0.8))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))',
                       color: stall.isExpansion ? '#48bb78' : 'inherit'
                     }}>
                  {stall.icon}
                </div>
                
                {/* Description on hover/activate */}
                {(activeTile === stall.id || stall.isExpansion) && (
                  <div className="mt-1 max-w-full text-center">
                    <span className={`text-[10px] text-white/90 font-light px-2 py-0.5 ${stall.isExpansion ? 'bg-emerald-900/60' : 'bg-black/40'} rounded-sm backdrop-blur-sm`}>
                      {stall.description}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stall base - enhanced with Taiwanese night market style */}
            <div className="absolute bottom-0 left-0 w-full h-4 overflow-hidden">
              <div className="absolute inset-0" style={{
                background: stall.isExpansion ? 
                  'repeating-linear-gradient(90deg, #1f4538, #1f4538 10px, #2a5747 10px, #2a5747 20px)' :
                  'repeating-linear-gradient(90deg, #2a1506, #2a1506 10px, #46230c 10px, #46230c 20px)'
              }}></div>
              
              {/* Light reflection effect */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Enhanced interaction prompt (only when active) */}
            {activeTile === stall.id && (
              <div className="absolute bottom-6 left-0 w-full flex justify-center items-center z-30">
                <div className={`backdrop-blur-sm text-white/90 px-3 py-1 rounded-full text-xs animate-pulse shadow-lg border border-white/10 ${stall.isExpansion ? 'bg-emerald-800/70' : 'bg-black/70'}`}>
                  Press E to interact
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Character - pixel art style */}
        <div
          className="absolute z-30"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${characterSize.width}px`,
            height: `${characterSize.height}px`,
            imageRendering: "pixelated"
          }}
        >
          {/* Character sprite (simple pixel art style) */}
          <div className="w-full h-full relative">
            {/* Head */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-[#F5D7B5] rounded-t-sm"></div>
            
            {/* Body */}
            <div className="absolute top-1/3 left-1/6 w-2/3 h-1/3 bg-red-600"></div>
            
            {/* Legs */}
            <div className="absolute bottom-0 left-1/4 w-1/5 h-1/3 bg-blue-700"></div>
            <div className="absolute bottom-0 right-1/4 w-1/5 h-1/3 bg-blue-700"></div>
            
            {/* Arms */}
            <div className="absolute top-1/3 left-0 w-1/6 h-1/4 bg-red-600"></div>
            <div className="absolute top-1/3 right-0 w-1/6 h-1/4 bg-red-600"></div>
            
            {/* Face details */}
            <div className="absolute top-[15%] left-[35%] w-[10%] h-[5%] bg-black"></div>
            <div className="absolute top-[15%] right-[35%] w-[10%] h-[5%] bg-black"></div>
            <div className="absolute top-[22%] left-[40%] w-[20%] h-[5%] bg-black"></div>
          </div>

          {/* Username above character */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-gray-900 bg-opacity-70 text-white px-2 py-0.5 text-xs rounded-full font-pixel">
              {username}
            </div>
          </div>
          
          {/* Emote bubble (if active) */}
          {currentEmote && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg">
                {currentEmote}
              </div>
            </div>
          )}
        </div>

        {/* Emote selection menu */}
        {showEmoteMenu && (
          <div 
            className="absolute z-50 bg-gray-800 bg-opacity-90 p-2 rounded-lg border border-gray-700 flex flex-wrap gap-2 w-40"
            style={{
              left: `${position.x}px`,
              top: `${position.y - 60}px`,
            }}
          >
            {emotes.map((emote, idx) => (
              <button
                key={`emote-${idx}`}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center cursor-pointer"
                onClick={() => handleEmoteSelect(emote)}
              >
                {emote}
              </button>
            ))}
          </div>
        )}
        
        {/* Username setup dialog */}
        {showNameInput && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg w-80">
              <h3 className="text-white font-pixel mb-4">Enter your name</h3>
              <form onSubmit={handleUsernameSubmit}>
                <input
                  type="text"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-4 font-pixel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={15}
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-pixel"
                >
                  Enter the Bazaar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Controls overlay (bottom of screen, Gather.town style) */}
      {showControls && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 rounded-t-lg border border-gray-700 border-b-0 p-2 flex items-center space-x-3 text-white z-50">
          <div className="flex space-x-1">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">⬆️</div>
          </div>
          <div className="flex space-x-1">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">⬅️</div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">⬇️</div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">➡️</div>
          </div>
          <div className="h-6 border-l border-gray-600"></div>
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-400 font-pixel">E:</div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700 text-xs">Interact</div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-400 font-pixel">X:</div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700 text-xs">Emote</div>
          </div>
          <button
            className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs font-pixel"
            onClick={() => setShowNameInput(true)}
          >
            Change Name
          </button>
          <button
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-pixel"
            onClick={toggleControlsVisibility}
          >
            Hide UI
          </button>
        </div>
      )}

      {/* Show controls button (when controls are hidden) */}
      {!showControls && (
        <button
          className="fixed bottom-4 right-4 px-3 py-2 bg-gray-800 bg-opacity-90 text-white rounded-md text-sm font-pixel z-50"
          onClick={toggleControlsVisibility}
        >
          Show UI
        </button>
      )}

      {/* Add pixel font and animations stylesheet */}
      <style jsx global>{`
        @font-face {
          font-family: 'PixelFont';
          src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAQwAA0AAAAAClwAAAPVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0ZGVE0cGh4GYACCXhEICotIigILFAABNgIkAxoEIAWDcwc9G9EHyI7jOJ0sBhHpPdmZfzOZ3f1/EELS2sooopJgoyOqoKG6WhhLu1pq57/esr9d7CGRREt9E814aISqRPgn8CDcJbzw5b/XmptfyMIm3RMaVReJTBLtkThCIqRIvEOIRCVevKzZ+bX7AAAAAIQAdAh1A+gDOANoA+gCiAPoBIgAjAPoBRgACABcxY54AIADABaAfOzZAmABwAQAiKl4kIBJAfJwMSkD8rC9B2SyQ1KnJRfjF5vLYgB40r4hAE+0//+PugCcSgO4cwJAF0A3PGiAQdMAVvwXBmPxWp6Wq5Vq5VqpVqj5ap6WrWVqwZZkSbQkWqLRUx0ttRytlrm1LK2Wuc1TXvWgK13oQAOUoRRlKUdZ8qMPfehD7/pAD3pA93pAN/pA+jTYMD3pAY3KYMEYo6YY8ZOqGjp16tR00qFJgw4dTfrpYNQsXdr00sFPk3bdWlRo0KJKl2Yd2vToYNZNu+K/3Ww0+v+HZ2hAZE4OEZOLLzSnLJRN+z30yPyEZ10ycYu0YpLpFxKPFqnZK2ITXr40qUZV8qJEzC5qRtUaVGhUJZ9MJfG6i1qFZkX+S2L1iXbNCuTdWSZJJU7dqnRpF4tFLfpJqdZPl1bVokFVPEOVbfHYM1Sb8vgL9y5LT69eaT1qTVRpWmK+hKomk2ZCZaNOeXeKJpXyFGxJYaQg5GpH45aXKsyy6YDJbJsydDDHpgyLbMrA+SkDo0/gk2OOQY33Zud1f9hwdZ3lzftGZ/CtO6VvHJVPXu5xkfA2uGtqWBsPzHi0UW+QL/jLYjBZ7fM+Z3QOEqWHV3qyOtDg/F0NdPx29SX5r1YWnZBGGwxaBIEhqFk1WrVpEysBAAAAQAeAEQBeANwAogAuAfwBUgBEAFoAngBxAF4AZwAYALEEYADmApwEYAagAUCR6VsPAC4AQgCACNfRbkxZbwBuAEoAQgBqANoAGgB6AGRSIQUkAEAAIAhAmPdDAIAgOE8A4BwAEQB4AFgEA8AHQAaAPABKAHIA0gBcALQAGAGQASAEoAlACIASgBCASgB6AOoAlAE0A7ACsAXgAiAPwA1AAYAbgDAABQB5ANwAZADwB+AGQARAFwA7ADUA7ABkAJACMARgBKAGIAsgGEAEgAEAOQAaACwAWgAUABgA0AcgDCANwB+AN4Ai') format('woff2');
          font-weight: normal;
          font-style: normal;
        }
        
        .font-pixel {
          font-family: 'PixelFont', monospace;
          letter-spacing: 0.5px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-8px); opacity: 0.9; }
        }

        @keyframes shooting-star {
          0% { 
            opacity: 0;
            transform: translateX(0) translateY(0) rotate(30deg); 
          }
          1% { opacity: 1; }
          5% { opacity: 1; }
          6% { opacity: 0; }
          100% { 
            opacity: 0;
            transform: translateX(${Math.floor(Math.random() * 200) + 300}px) translateY(${Math.floor(Math.random() * 200) + 300}px) rotate(30deg); 
          }
        }

        html, body {
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </main>
  );
} 