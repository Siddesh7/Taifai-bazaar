"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useSocket, PlayerData } from "../../contexts/SocketContext";
import axios from "axios";

// Import components
import Background from "./components/Background";
import Stall from "./components/Stall";
import Character from "./components/Character";
import ControlsUI from "./components/ControlsUI";
import EmoteMenu from "./components/EmoteMenu";
import UsernameInput from "./components/UsernameInput";
import TeamModals from "./components/TeamModals";
import SpeechRecognitionUi from "./components/SpeechRecognition";
import HeaderUI from "./components/HeaderUI";
import TeamButtons from "./components/TeamButtons";
import ArenaStyles from "./components/ArenaStyles";

// Import types
import SpeechRecognition from "./types/speechRecognition";

// Add agent response interface
interface AgentResponseData {
  roomCode: string;
  agentText: string;
  stallId: number | null;
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
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [joinTeamInput, setJoinTeamInput] = useState("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);

  const router = useRouter();
  const { user, authenticated } = usePrivy();
  const {
    socket,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    roomCode,
    players,
    error: socketError,
  } = useSocket();

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
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.warn("Speech recognition not supported. Use Chrome or Safari.");
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();
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

      if (event.key === "x") {
        setShowEmoteMenu((prev) => !prev);
        return;
      }

      if (event.key === "e" && activeTile !== null) {
        console.log(`Interacting with stall ${activeTile}`);
        return;
      }

      if (event.code === "Space" && activeTile !== null) {
        event.preventDefault();
        if (!isRecording && !isStartingRef.current && recognitionRef.current) {
          try {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.src = "";
            }
            setError(null);
            setAgentResponse(null);
            isStartingRef.current = true;
            recognitionRef.current.stop();
            recognitionRef.current.start();
          } catch (err) {
            setError(`Failed to start recognition: ${(err as Error).message}`);
            isStartingRef.current = false;
          }
        }
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
        if (currentEmote) setCurrentEmote(null);
        return { x: newX, y: newY };
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        isRecording &&
        recognitionRef.current &&
        activeTile !== null
      ) {
        recognitionRef.current.stop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    checkNearbyStalls(position);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    position,
    activeTile,
    showEmoteMenu,
    currentEmote,
    showNameInput,
    viewportSize,
    isRecording,
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

  const sendToAgent = async (prompt: string) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/agent/message",
        { prompt },
        { headers: { "Cache-Control": "no-cache" } }
      );
      const agentText = response.data.response;
      setAgentResponse(agentText);

      // Generate and play audio locally
      await generateElevenLabsTTS(agentText);

      // Broadcast agent response to all users in the room
      if (socket && isConnected && roomCode) {
        socket.emit("agent_response", {
          roomCode,
          agentText,
          stallId: activeTile,
        });
      }
    } catch (err) {
      setError(`Agent error: ${(err as Error).message || "Unknown error"}`);
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
        audioRef.current.play().catch((e) => {
          setError("Audio playback error: " + e.message);
        });
      }
    } catch (err) {
      setError(`TTS error: ${(err as Error).message || "Unknown error"}`);
    }
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
    {
      id: 1,
      name: "Rootstock Swap Station",
      x: viewportSize.width * 0.25 - 90,
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
      description:
        "Exchange tokens on Rootstock with the best rates in the night market",
      decorations: ["lantern", "strings", "steam"],
    },
    {
      id: 2,
      name: "Rootstock Staking House",
      x: viewportSize.width * 0.2 - 90,
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
      decorations: ["coins", "abacus", "incense"],
    },
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
      decorations: ["maps", "scrolls", "brush"],
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
      decorations: ["fortune", "teacup", "coins"],
    },
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
      decorations: ["baskets", "steam", "glow"],
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
      decorations: ["bubbles", "tea", "straws"],
    },
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
      isExpansion: true,
    },
  ];

  const lanterns = [
    { x: viewportSize.width * 0.15, y: 140, color: "red", size: 0.9 },
    { x: viewportSize.width * 0.38, y: 160, color: "yellow", size: 0.8 },
    { x: viewportSize.width * 0.73, y: 150, color: "yellow", size: 1 },
    { x: viewportSize.width * 0.92, y: 135, color: "red", size: 0.7 },
    {
      x: viewportSize.width * 0.05,
      y: viewportSize.height * 0.35,
      color: "yellow",
      size: 0.7,
    },
    {
      x: viewportSize.width * 0.12,
      y: viewportSize.height * 0.5,
      color: "red",
      size: 0.85,
    },
    {
      x: viewportSize.width * 0.85,
      y: viewportSize.height * 0.42,
      color: "red",
      size: 0.8,
    },
    {
      x: viewportSize.width * 0.95,
      y: viewportSize.height * 0.55,
      color: "yellow",
      size: 0.75,
    },
    {
      x: viewportSize.width * 0.25,
      y: viewportSize.height * 0.82,
      color: "yellow",
      size: 0.9,
    },
    {
      x: viewportSize.width * 0.6,
      y: viewportSize.height * 0.88,
      color: "red",
      size: 0.8,
    },
    {
      x: viewportSize.width * 0.78,
      y: viewportSize.height * 0.8,
      color: "yellow",
      size: 0.85,
    },
  ];

  const streetFoodItems = [
    {
      x: viewportSize.width * 0.25,
      y: viewportSize.height * 0.45,
      emoji: "🧋",
    },
    { x: viewportSize.width * 0.4, y: viewportSize.height * 0.25, emoji: "🥟" },
    { x: viewportSize.width * 0.6, y: viewportSize.height * 0.45, emoji: "🍜" },
    {
      x: viewportSize.width * 0.75,
      y: viewportSize.height * 0.25,
      emoji: "🥘",
    },
    { x: viewportSize.width * 0.8, y: viewportSize.height * 0.7, emoji: "🍤" },
    { x: viewportSize.width * 0.2, y: viewportSize.height * 0.7, emoji: "🦪" },
  ];

  const emotes = ["👋", "👍", "❤️", "😂", "🎉", "🤔", "👀", "🙏"];

  const generateTeamCode = () => {
    createRoom();
  };

  const handleCreateTeam = () => {
    setIsCreatingTeam(true);
    setIsJoiningTeam(false);
    generateTeamCode();
  };

  const handleJoinTeam = () => {
    setIsJoiningTeam(true);
    setIsCreatingTeam(false);
  };

  const handleJoinTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinRoom(joinTeamInput);
    setIsJoiningTeam(false);
  };

  const closeTeamModals = () => {
    setIsCreatingTeam(false);
    setIsJoiningTeam(false);
  };

  const handleLeaveRoom = () => {
    if (roomCode) {
      leaveRoom(roomCode);
    }
    setJoinTeamInput("");
  };

  useEffect(() => {
    if (socket && isConnected && roomCode) {
      socket.emit("player_move", { roomCode, position });
    }
  }, [position, socket, isConnected, roomCode]);

  useEffect(() => {
    if (socket && isConnected && roomCode && currentEmote) {
      socket.emit("player_emote", { roomCode, emote: currentEmote });
    }
  }, [currentEmote, socket, isConnected, roomCode]);

  useEffect(() => {
    if (socket && isConnected && roomCode && username) {
      socket.emit("player_name", { roomCode, username });
    }
  }, [username, socket, isConnected, roomCode]);

  // Add socket listener for agent responses from other users
  useEffect(() => {
    if (socket && isConnected) {
      // Listen for agent responses from other users
      socket.on("agent_response", async (data: AgentResponseData) => {
        if (data.agentText) {
          setAgentResponse(data.agentText);
          await generateElevenLabsTTS(data.agentText);
        }
      });

      return () => {
        socket.off("agent_response");
      };
    }
  }, [socket, isConnected]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-blue-950">
      <HeaderUI
        formattedAddress={formattedAddress}
        returnToHome={returnToHome}
        roomCode={roomCode}
        handleLeaveRoom={handleLeaveRoom}
      />

      <TeamButtons
        roomCode={roomCode}
        isConnected={isConnected}
        socketError={socketError}
        handleCreateTeam={handleCreateTeam}
        handleJoinTeam={handleJoinTeam}
      />

      <TeamModals
        isCreatingTeam={isCreatingTeam}
        isJoiningTeam={isJoiningTeam}
        roomCode={roomCode}
        joinTeamInput={joinTeamInput}
        setJoinTeamInput={setJoinTeamInput}
        closeTeamModals={closeTeamModals}
        handleJoinTeamSubmit={handleJoinTeamSubmit}
        socketError={socketError}
      />

      <Background
        viewportSize={viewportSize}
        tileSize={tileSize}
        lanterns={lanterns}
        streetFoodItems={streetFoodItems}
      />

      {stalls.map((stall) => (
        <Stall key={stall.id} stall={stall} activeTile={activeTile} />
      ))}

      <Character
        position={position}
        username={username}
        currentEmote={currentEmote}
        characterSize={characterSize}
      />

      {roomCode &&
        Object.values(players).map((player: PlayerData) => {
          if (socket && player.id === socket.id) return null;
          return (
            <Character
              key={player.id}
              position={player.position}
              username={player.username}
              currentEmote={player.emote}
              characterSize={characterSize}
              isOtherPlayer={true}
            />
          );
        })}

      {showEmoteMenu && (
        <EmoteMenu
          position={position}
          emotes={emotes}
          handleEmoteSelect={handleEmoteSelect}
        />
      )}

      {showNameInput && (
        <UsernameInput
          username={username}
          setUsername={setUsername}
          handleUsernameSubmit={handleUsernameSubmit}
        />
      )}

      <SpeechRecognitionUi
        position={position}
        activeTile={activeTile}
        isRecording={isRecording}
        isProcessing={isProcessing}
        error={error}
        agentResponse={agentResponse}
      />

      <ControlsUI
        showControls={showControls}
        toggleControlsVisibility={toggleControlsVisibility}
        setShowNameInput={setShowNameInput}
      />

      <ArenaStyles />
    </main>
  );
}
