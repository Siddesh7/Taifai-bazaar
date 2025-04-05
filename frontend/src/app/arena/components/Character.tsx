import React from "react";

interface CharacterProps {
  position: { x: number; y: number };
  username: string;
  currentEmote: string | null;
  characterSize: { width: number; height: number };
  isOtherPlayer?: boolean;
}

const Character: React.FC<CharacterProps> = ({
  position,
  username,
  currentEmote,
  characterSize,
  isOtherPlayer = false,
}) => {
  return (
    <div
      className="absolute z-30"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${characterSize.width}px`,
        height: `${characterSize.height}px`,
        imageRendering: "pixelated",
      }}
    >
      <div className="w-full h-full relative">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/3 bg-[#F5D7B5] rounded-t-sm"></div>
        <div
          className={`absolute top-1/3 left-1/6 w-2/3 h-1/3 ${
            isOtherPlayer ? "bg-green-600" : "bg-red-600"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-1/4 w-1/5 h-1/3 ${
            isOtherPlayer ? "bg-blue-800" : "bg-blue-700"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 right-1/4 w-1/5 h-1/3 ${
            isOtherPlayer ? "bg-blue-800" : "bg-blue-700"
          }`}
        ></div>
        <div
          className={`absolute top-1/3 left-0 w-1/6 h-1/4 ${
            isOtherPlayer ? "bg-green-600" : "bg-red-600"
          }`}
        ></div>
        <div
          className={`absolute top-1/3 right-0 w-1/6 h-1/4 ${
            isOtherPlayer ? "bg-green-600" : "bg-red-600"
          }`}
        ></div>
        <div className="absolute top-[15%] left-[35%] w-[10%] h-[5%] bg-black"></div>
        <div className="absolute top-[15%] right-[35%] w-[10%] h-[5%] bg-black"></div>
        <div className="absolute top-[22%] left-[40%] w-[20%] h-[5%] bg-black"></div>
      </div>
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="bg-gray-900 bg-opacity-70 text-white px-2 py-0.5 text-xs rounded-full font-pixel">
          {username}
        </div>
      </div>
      {currentEmote && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg">
            {currentEmote}
          </div>
        </div>
      )}
    </div>
  );
};

export default Character;
