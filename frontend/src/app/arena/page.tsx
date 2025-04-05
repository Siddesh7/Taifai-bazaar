"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";

interface Stall {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: string;
  borderColor: string;
  roofColor: string;
  icon: string;
  description: string;
  foodIcon?: string;
  isExpansion?: boolean;
}

export default function Arena() {
  const [position, setPosition] = useState({ x: 600, y: 300 });
  const [showControls, setShowControls] = useState(true);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [showEmoteMenu, setShowEmoteMenu] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<string | null>(null);
  const [username, setUsername] = useState("Guest");
  const [showNameInput, setShowNameInput] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    width: 1200,
    height: 600,
  });
  const router = useRouter();
  const { user, authenticated } = usePrivy();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const walletAddress = user?.wallet?.address || "";
  const formattedAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
        walletAddress.length - 4
      )}`
    : "";

  useEffect(() => {
    if (!authenticated) router.push("/");
  }, [authenticated, router]);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  const step = 10;
  const characterSize = { width: 32, height: 48 };

  const toggleControlsVisibility = () => setShowControls(!showControls);

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Speech recognition not supported. Use Chrome or Safari.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      isStartingRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    recognition.onend = () => {
      setIsRecording(false);
      isStartingRef.current = false;
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      isStartingRef.current = false;
      setIsRecording(false);
      setIsProcessing(false);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setIsProcessing(true);
      sendToAgent(text);
    };

    audioRef.current = new Audio();

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startSpeechRecognition = () => {
    if (
      !recognitionRef.current ||
      isRecording ||
      isStartingRef.current ||
      isProcessing
    )
      return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setError(null);
      isStartingRef.current = true;
      recognitionRef.current.stop();
      recognitionRef.current.start();
    } catch (err) {
      setError("Failed to start recognition: " + err.message);
      isStartingRef.current = false;
      setIsProcessing(false);
    }
  };

  const sendToAgent = async (prompt: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/agent/message",
        { prompt },
        { timeout: 5000, headers: { "Cache-Control": "no-cache" } }
      );
      await generateElevenLabsTTS(response.data.response);
    } catch (err) {
      setError("Agent error: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateElevenLabsTTS = async (text: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      if (!apiKey) throw new Error("ElevenLabs API key not configured");

      const voiceId = "21m00Tcm4TlvDq8ikWAM";
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 },
          }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to generate TTS from ElevenLabs");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = audioUrl;
        audioRef.current
          .play()
          .catch((e) => setError("Audio playback error: " + e.message));
      }
    } catch (err) {
      setError("TTS error: " + err.message);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showEmoteMenu) {
        setShowEmoteMenu(false);
        return;
      }
      if (showNameInput) return;
      if (event.key === "x") {
        setShowEmoteMenu((prev) => !prev);
        return;
      }
      if (event.key === "e" && activeTile !== null) {
        console.log(`Interacting with stall ${activeTile}`);
        return;
      }
      if (event.key === " " && activeTile === 3) {
        event.preventDefault();
        startSpeechRecognition();
        return;
      }

      setPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        switch (event.key) {
          case "ArrowUp":
            newY = Math.max(0, prev.y - step);
            break;
          case "ArrowDown":
            newY = Math.min(
              viewportSize.height - characterSize.height,
              prev.y + step
            );
            break;
          case "ArrowLeft":
            newX = Math.max(0, prev.x - step);
            break;
          case "ArrowRight":
            newX = Math.min(
              viewportSize.width - characterSize.width,
              prev.x + step
            );
            break;
          default:
            return prev;
        }
        checkNearbyStalls({ x: newX, y: newY });
        if (currentEmote) setCurrentEmote(null);
        return { x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    checkNearbyStalls(position);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    position,
    activeTile,
    showEmoteMenu,
    currentEmote,
    showNameInput,
    viewportSize,
    isRecording,
    isProcessing,
  ]);

  const checkNearbyStalls = (pos: { x: number; y: number }) => {
    const nearbyStall = stalls.find(
      (stall) =>
        Math.abs(
          pos.x + characterSize.width / 2 - (stall.x + stall.width / 2)
        ) < 80 &&
        Math.abs(
          pos.y + characterSize.height / 2 - (stall.y + stall.height / 2)
        ) < 80
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

  const returnToHome = () => router.push("/");

  const stalls: Stall[] = [
    {
      id: 1,
      name: "Swap Noodles",
      x: viewportSize.width * 0.25 - 90,
      y: viewportSize.height * 0.35,
      width: 180,
      height: 120,
      bgColor: "bg-red-700",
      borderColor: "border-red-900",
      roofColor: "bg-red-800",
      icon: "🔄",
      description: "Trade tokens for noodles",
      foodIcon: "🍜",
    },
    {
      id: 2,
      name: "Stake Tea",
      x: viewportSize.width * 0.2 - 90,
      y: viewportSize.height * 0.7,
      width: 180,
      height: 120,
      bgColor: "bg-yellow-700",
      borderColor: "border-yellow-900",
      roofColor: "bg-yellow-800",
      icon: "📈",
      description: "Stake and sip",
      foodIcon: "🧋",
    },
    {
      id: 3,
      name: "Crypto Info",
      x: viewportSize.width * 0.5 - 90,
      y: viewportSize.height * 0.25,
      width: 180,
      height: 120,
      bgColor: "bg-blue-700",
      borderColor: "border-blue-900",
      roofColor: "bg-blue-800",
      icon: "ℹ️",
      description: "Ask about crypto",
    },
    {
      id: 4,
      name: "Price Dumplings",
      x: viewportSize.width * 0.45 - 90,
      y: viewportSize.height * 0.6,
      width: 180,
      height: 120,
      bgColor: "bg-green-700",
      borderColor: "border-green-900",
      roofColor: "bg-green-800",
      icon: "💰",
      description: "Price predictions",
      foodIcon: "🥟",
    },
    {
      id: 5,
      name: "Celo Skewers",
      x: viewportSize.width * 0.8 - 90,
      y: viewportSize.height * 0.28,
      width: 180,
      height: 120,
      bgColor: "bg-indigo-700",
      borderColor: "border-indigo-900",
      roofColor: "bg-indigo-800",
      icon: "🔄",
      description: "Trade on Celo",
      foodIcon: "🍢",
    },
    {
      id: 6,
      name: "Stake Buns",
      x: viewportSize.width * 0.7 - 90,
      y: viewportSize.height * 0.55,
      width: 180,
      height: 120,
      bgColor: "bg-purple-700",
      borderColor: "border-purple-900",
      roofColor: "bg-purple-800",
      icon: "📈",
      description: "Stake with buns",
      foodIcon: "🥠",
    },
    {
      id: 7,
      name: "Your Stall",
      x: viewportSize.width * 0.85 - 90,
      y: viewportSize.height * 0.75,
      width: 180,
      height: 120,
      bgColor: "bg-gray-700",
      borderColor: "border-gray-600",
      roofColor: "bg-gray-600",
      icon: "➕",
      description: "Join the market",
      isExpansion: true,
    },
  ];

  const lanterns = [
    { x: viewportSize.width * 0.15, y: 140, color: "red" },
    { x: viewportSize.width * 0.38, y: 160, color: "yellow" },
    { x: viewportSize.width * 0.73, y: 150, color: "yellow" },
    { x: viewportSize.width * 0.92, y: 135, color: "red" },
  ];

  const emotes = ["👋", "👍", "❤️", "😂", "🎉", "🤔", "👀", "🙏"];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-blue-950">
      <div className="absolute top-0 left-0 w-full bg-gray-900 bg-opacity-80 px-4 py-4 flex justify-between items-center z-50">
        <button
          onClick={returnToHome}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center text-sm"
        >
          ← Home
        </button>
        <h1 className="text-2xl font-bold text-yellow-300 font-['Press_Start_2P',_monospace] tracking-tight">
          臺北夜市
        </h1>
        <div className="px-3 py-1 bg-green-600 text-white rounded-md text-sm flex items-center">
          <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
          {formattedAddress || "Wallet Connected"}
        </div>
      </div>

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "radial-gradient(circle, #1a365d 0%, #0f2447 100%)",
        }}
      >
        {Array.from({ length: 50 }).map((_, idx) => (
          <div
            key={`star-${idx}`}
            className="absolute bg-white rounded-full"
            style={{
              width: "2px",
              height: "2px",
              top: `${Math.random() * viewportSize.height}px`,
              left: `${Math.random() * viewportSize.width}px`,
              opacity: Math.random() * 0.5 + 0.5,
              zIndex: 3,
            }}
          />
        ))}

        <div className="absolute top-16 left-0 w-full h-12 bg-indigo-900 flex items-center justify-center text-yellow-300 font-bold text-lg font-pixel z-10 animate-pulse">
          NIGHT MARKET
        </div>

        {lanterns.map((lantern, idx) => (
          <div
            key={`lantern-${idx}`}
            className={`absolute w-10 h-12 ${
              lantern.color === "red" ? "bg-red-600" : "bg-yellow-500"
            } rounded-full animate-swing`}
            style={{
              left: `${lantern.x}px`,
              top: `${lantern.y}px`,
              zIndex: 6,
              boxShadow: `0 0 10px ${
                lantern.color === "red"
                  ? "rgba(255,0,0,0.5)"
                  : "rgba(255,215,0,0.5)"
              }`,
            }}
          >
            <div className="w-2 h-4 bg-gray-800 mx-auto mt-[-4px]"></div>
          </div>
        ))}

        {stalls.map((stall) => (
          <div
            key={stall.id}
            className={`absolute ${stall.bgColor} ${stall.borderColor} border ${
              stall.isExpansion ? "border-dashed" : "border-opacity-60"
            } rounded-sm shadow-lg overflow-hidden`}
            style={{
              left: `${stall.x}px`,
              top: `${stall.y}px`,
              width: `${stall.width}px`,
              height: `${stall.height}px`,
              zIndex: 20,
            }}
          >
            {/* Roof with Overhang and Lights */}
            <div className={`relative ${stall.roofColor} h-20`}>
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  clipPath:
                    "polygon(0 60%, 20% 0, 80% 0, 100% 60%, 100% 100%, 0 100%)",
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
                }}
              />
              <div className="absolute top-2 left-0 w-full flex justify-around">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`light-${i}`}
                    className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <div
                className="absolute top-8 left-4 w-8 h-10 bg-red-500 rounded-full animate-swing"
                style={{ boxShadow: "0 0 12px rgba(255,0,0,0.6)" }}
              >
                <div className="w-2 h-4 bg-gray-800 mx-auto mt-[-4px]"></div>
                <div className="w-6 h-8 bg-red-400 rounded-full mx-auto mt-1 flex items-center justify-center text-white text-xs">
                  福
                </div>
              </div>
              <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold z-10 bg-black/50 px-2 py-1 rounded">
                {stall.name}
              </span>
            </div>

            {/* Stall Body */}
            <div className="relative flex flex-col items-center justify-center h-[calc(100%-80px)] p-2 bg-opacity-90">
              <div className="absolute top-2 right-2 text-2xl animate-bounce">
                {stall.foodIcon || "🍴"}
              </div>
              <div
                className={`text-4xl ${
                  activeTile === stall.id ? "animate-pulse" : ""
                }`}
              >
                {stall.icon}
              </div>
              {activeTile === stall.id && (
                <div className="mt-1 text-[10px] text-white/90 bg-black/40 rounded-sm px-2 py-0.5">
                  {stall.description}
                </div>
              )}
              {/* Steam Effect */}
              {stall.foodIcon && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-steam"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-steam"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-steam"
                    style={{ animationDelay: "0.6s" }}
                  />
                </div>
              )}
            </div>

            {/* Interaction Prompt */}
            {activeTile === stall.id && (
              <div className="absolute bottom-4 left-0 w-full flex justify-center">
                <div className="text-white/90 px-2 py-1 rounded-full text-xs bg-black/70 animate-pulse">
                  {stall.id === 3
                    ? "Press Space to Talk"
                    : "Press E to Interact"}
                </div>
              </div>
            )}
          </div>
        ))}

        <div
          className="absolute z-30"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${characterSize.width}px`,
            height: `${characterSize.height}px`,
          }}
        >
          <div className="w-full h-full relative">
            <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-[#F5D7B5] rounded-t-sm"></div>
            <div className="absolute top-1/3 left-1/6 w-2/3 h-1/3 bg-red-600"></div>
            <div className="absolute bottom-0 left-1/4 w-1/5 h-1/3 bg-blue-700"></div>
            <div className="absolute bottom-0 right-1/4 w-1/5 h-1/3 bg-blue-700"></div>
            <div className="absolute top-1/3 left-0 w-1/6 h-1/4 bg-red-600"></div>
            <div className="absolute top-1/3 right-0 w-1/6 h-1/4 bg-red-600"></div>
            <div className="absolute top-[15%] left-[35%] w-[10%] h-[5%] bg-black"></div>
            <div className="absolute top-[15%] right-[35%] w-[10%] h-[5%] bg-black"></div>
            <div className="absolute top-[22%] left-[40%] w-[20%] h-[5%] bg-black"></div>
          </div>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-70 text-white px-2 py-0.5 text-xs rounded-full font-pixel">
            {username}
          </div>
          {currentEmote && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg">
                {currentEmote}
              </div>
            </div>
          )}
        </div>

        {showEmoteMenu && (
          <div
            className="absolute z-50 bg-gray-800 bg-opacity-90 p-2 rounded-lg border border-gray-700 flex flex-wrap gap-2 w-40"
            style={{ left: `${position.x}px`, top: `${position.y - 60}px` }}
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

        {(isRecording || isProcessing) && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-80 p-4 rounded-lg z-50">
            <p className="text-white font-pixel">
              {isRecording ? "Recording..." : "Agent Thinking..."}
            </p>
            <div className="mt-2 w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>

      {showControls && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 rounded-t-lg border border-gray-700 border-b-0 p-2 flex items-center space-x-3 text-white z-50">
          <div className="flex space-x-1">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
              ⬆️
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
              ⬅️
            </div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
              ⬇️
            </div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
              ➡️
            </div>
          </div>
          <div className="h-6 border-l border-gray-600"></div>
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-400 font-pixel">E:</div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700 text-xs">
              Interact
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-400 font-pixel">Space:</div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700 text-xs">
              Talk
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-400 font-pixel">X:</div>
            <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center border border-gray-700 text-xs">
              Emote
            </div>
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

      {!showControls && (
        <button
          className="fixed bottom-4 right-4 px-3 py-2 bg-gray-800 bg-opacity-90 text-white rounded-md text-sm font-pixel z-50"
          onClick={toggleControlsVisibility}
        >
          Show UI
        </button>
      )}

      <style jsx global>{`
        .font-pixel {
          font-family: "PixelFont", monospace;
          letter-spacing: 0.5px;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes swing {
          0%,
          100% {
            transform: rotate(5deg);
          }
          50% {
            transform: rotate(-5deg);
          }
        }
        @keyframes steam {
          0% {
            transform: translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-10px);
            opacity: 0;
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        html,
        body {
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </main>
  );
}
