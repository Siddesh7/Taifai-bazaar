import React, { useEffect, useState } from "react";

interface SpeechRecognitionUiProps {
  position: { x: number; y: number };
  activeTile: number | null;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  agentResponse: string | null;
}

const SpeechRecognitionUi: React.FC<SpeechRecognitionUiProps> = ({
  position,
  activeTile,
  isRecording,
  isProcessing,
  error,
  agentResponse,
}) => {
  const [visibleResponse, setVisibleResponse] = useState<string | null>(null);
  const [lastPosition, setLastPosition] = useState(position);

  // Set the response when it arrives
  useEffect(() => {
    if (agentResponse) {
      setVisibleResponse(agentResponse);
      setLastPosition(position);
    }
  }, [agentResponse, position]);

  // Clear the response when position changes
  useEffect(() => {
    if (
      visibleResponse &&
      (lastPosition.x !== position.x || lastPosition.y !== position.y)
    ) {
      setVisibleResponse(null);
    }
  }, [position, lastPosition, visibleResponse]);

  return (
    <>
      {activeTile !== null && (isRecording || isProcessing) && (
        <div
          className="absolute z-50"
          style={{
            left: `${position.x - 50}px`,
            top: `${position.y - 40}px`,
          }}
        >
          <div className="bg-gray-900 bg-opacity-90 px-3 py-2 rounded-md border border-gray-700 flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isRecording ? "bg-green-500" : "bg-blue-500"
              } animate-pulse`}
            ></div>
            <span className="text-white text-sm font-pixel">
              {isRecording ? "Recording" : "Agent Thinking..."}
            </span>
            {isProcessing && (
              <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>
      )}

      {error && activeTile !== null && (
        <div
          className="absolute z-50"
          style={{
            left: `${position.x - 50}px`,
            top: `${position.y - 60}px`,
          }}
        >
          <div className="bg-red-900 bg-opacity-90 px-3 py-2 rounded-md border border-red-700">
            <span className="text-white text-sm font-pixel">{error}</span>
          </div>
        </div>
      )}

      {visibleResponse &&
        activeTile !== null &&
        !isRecording &&
        !isProcessing && (
          <div
            className="absolute z-50"
            style={{
              left: `${position.x - 100}px`,
              top: `${position.y - 80}px`,
              maxWidth: "200px",
            }}
          >
            <div className="bg-blue-900 bg-opacity-90 px-3 py-2 rounded-md border border-blue-700">
              <span className="text-white text-sm font-pixel">
                {visibleResponse}
              </span>
            </div>
          </div>
        )}
    </>
  );
};

export default SpeechRecognitionUi;
