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
  const [hasMoved, setHasMoved] = useState(false);
  const [lastPosition, setLastPosition] = useState(position);

  // Set the response when it arrives, but only if user hasn't moved yet
  useEffect(() => {
    if (agentResponse && !hasMoved) {
      setVisibleResponse(agentResponse);
      setLastPosition(position);
    }
  }, [agentResponse, position, hasMoved]);

  // When position changes, mark that user has moved and clear the response
  useEffect(() => {
    if (
      visibleResponse &&
      (lastPosition.x !== position.x || lastPosition.y !== position.y)
    ) {
      setVisibleResponse(null);
      setHasMoved(true);
    }
  }, [position, lastPosition, visibleResponse]);

  // Reset the hasMoved flag when a new agent response arrives
  useEffect(() => {
    if (agentResponse) {
      setHasMoved(false);
    }
  }, [agentResponse]);

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
        !isProcessing &&
        !hasMoved && (
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
