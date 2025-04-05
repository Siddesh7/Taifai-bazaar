import React from "react";

interface HeaderUIProps {
  formattedAddress: string;
  returnToHome: () => void;
  roomCode: string | null;
  handleLeaveRoom: () => void;
}

const HeaderUI: React.FC<HeaderUIProps> = ({
  formattedAddress,
  returnToHome,
  roomCode,
  handleLeaveRoom,
}) => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-gray-900 bg-opacity-80 px-4 py-4 flex justify-between items-center z-50">
        <button
          onClick={returnToHome}
          className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-md flex items-center text-sm"
        >
          ← Home
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold tracking-wide flex items-center space-x-2">
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-300 to-red-500 animate-pulse-slow"
              style={{
                textShadow:
                  "0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)",
                fontFamily: "'Press_Start_2P', monospace",
              }}
            >
              臺北夜市
            </span>
            <span className="text-white opacity-70 mx-1 text-xl">|</span>
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400"
              style={{
                textShadow:
                  "0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(14, 165, 233, 0.3)",
                fontFamily: "'Press_Start_2P', monospace",
              }}
            >
              Taifei Bazaar
            </span>
          </h1>
        </div>
        <div className="px-3 py-1 bg-green-600 text-white rounded-md text-sm flex items-center">
          <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
          {formattedAddress ? (
            <span>{formattedAddress}</span>
          ) : (
            "Wallet Connected"
          )}
        </div>
      </div>

      {roomCode && (
        <div className="absolute top-16 left-4 z-40 flex items-center">
          <div className="flex items-center bg-gray-800 bg-opacity-90 px-3 py-2 rounded-md border border-gray-700">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white text-sm font-pixel mr-2">Room:</span>
            <span className="font-mono font-bold text-yellow-400">
              {roomCode}
            </span>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="ml-2 px-3 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-pixel rounded-md flex items-center transition-colors border border-red-900"
            style={{ textShadow: "0 0 2px rgba(0,0,0,0.8)" }}
          >
            <span className="mr-1.5">🚪</span> Leave Room
          </button>
        </div>
      )}
    </>
  );
};

export default HeaderUI;
