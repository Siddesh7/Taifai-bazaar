import React from "react";

interface EmoteMenuProps {
  position: { x: number; y: number };
  emotes: string[];
  handleEmoteSelect: (emote: string) => void;
}

const EmoteMenu: React.FC<EmoteMenuProps> = ({
  position,
  emotes,
  handleEmoteSelect,
}) => {
  return (
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
  );
};

export default EmoteMenu;
