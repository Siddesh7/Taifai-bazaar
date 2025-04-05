import React from "react";

interface TeamButtonsProps {
  roomCode: string | null;
  isConnected: boolean;
  socketError: string | null;
  handleCreateTeam: () => void;
  handleJoinTeam: () => void;
}

const TeamButtons: React.FC<TeamButtonsProps> = ({
  roomCode,
  isConnected,
  socketError,
  handleCreateTeam,
  handleJoinTeam,
}) => {
  if (roomCode) return null;

  return (
    <div className="absolute top-20 left-0 w-full flex flex-col items-center z-40">
      {!isConnected && (
        <div className="bg-red-900 bg-opacity-90 px-4 py-2 rounded-md mb-4 flex items-center">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-white text-sm">
            Socket connection unavailable. Please check the server.
          </span>
        </div>
      )}

      {socketError && (
        <div className="bg-red-900 bg-opacity-90 px-4 py-2 rounded-md mb-4">
          <span className="text-white text-sm">{socketError}</span>
        </div>
      )}

      <div className="flex justify-center items-center space-x-12">
        <button
          onClick={handleCreateTeam}
          className="p-2 rounded relative group"
          disabled={!isConnected}
          style={{
            imageRendering: "pixelated",
            boxShadow: "0 0 10px rgba(246, 173, 85, 0.5)",
            opacity: isConnected ? 1 : 0.5,
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          <div className="absolute inset-0 bg-orange-600 rounded transform rotate-1 -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700 rounded"></div>
          <div className="absolute inset-2 bg-orange-600 border-t-2 border-l-2 border-orange-400 border-b-2 border-r-2 border-orange-800 rounded-sm"></div>
          <div className="relative z-10 font-pixel text-white text-base font-bold px-3 py-1.5 flex items-center">
            <span className="mr-1.5 text-xl">🏮</span>{" "}
            <span>Create a Room</span>
          </div>
          <div className="absolute -inset-px bg-white opacity-0 group-hover:opacity-20 rounded transition-opacity"></div>
          <div className="absolute inset-0 border-2 border-dashed border-orange-300 opacity-0 group-hover:opacity-40 rounded"></div>
        </button>

        <button
          onClick={handleJoinTeam}
          className="p-2 rounded relative group"
          disabled={!isConnected}
          style={{
            imageRendering: "pixelated",
            boxShadow: "0 0 10px rgba(129, 140, 248, 0.5)",
            opacity: isConnected ? 1 : 0.5,
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          <div className="absolute inset-0 bg-indigo-600 rounded transform -rotate-1 -z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded"></div>
          <div className="absolute inset-2 bg-indigo-600 border-t-2 border-l-2 border-indigo-400 border-b-2 border-r-2 border-indigo-800 rounded-sm"></div>
          <div className="relative z-10 font-pixel text-white text-base font-bold px-3 py-1.5 flex items-center">
            <span className="mr-1.5 text-xl">🎮</span> <span>Join a Room</span>
          </div>
          <div className="absolute -inset-px bg-white opacity-0 group-hover:opacity-20 rounded transition-opacity"></div>
          <div className="absolute inset-0 border-2 border-dashed border-indigo-300 opacity-0 group-hover:opacity-40 rounded"></div>
        </button>
      </div>

      {isConnected && (
        <div className="mt-2 text-green-400 text-xs">
          <span>✓ Connected to server</span>
        </div>
      )}
    </div>
  );
};

export default TeamButtons;
