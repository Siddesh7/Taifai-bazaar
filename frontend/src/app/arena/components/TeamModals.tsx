import React from "react";

interface TeamModalsProps {
  isCreatingTeam: boolean;
  isJoiningTeam: boolean;
  roomCode: string | null;
  joinTeamInput: string;
  setJoinTeamInput: (code: string) => void;
  closeTeamModals: () => void;
  handleJoinTeamSubmit: (e: React.FormEvent) => void;
  socketError: string | null;
}

const TeamModals: React.FC<TeamModalsProps> = ({
  isCreatingTeam,
  isJoiningTeam,
  roomCode,
  joinTeamInput,
  setJoinTeamInput,
  closeTeamModals,
  handleJoinTeamSubmit,
  socketError,
}) => {
  if (!isCreatingTeam && !isJoiningTeam) return null;

  return (
    <div className="absolute top-40 left-0 w-full flex justify-center z-40">
      <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg border-2 border-gray-700 shadow-xl max-w-md w-full">
        {isCreatingTeam && (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-pixel text-white mb-2">
              Your Room Code
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Share this code with friends to play together
            </p>
            {!roomCode ? (
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-16 h-16 border-4 border-t-4 border-yellow-500 rounded-full animate-spin mb-4"></div>
                <p className="text-white text-sm">Generating room code...</p>
              </div>
            ) : (
              <div className="flex items-center justify-center mb-6">
                {roomCode.split("").map((char, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-16 bg-gradient-to-b from-yellow-600 to-yellow-800 flex items-center justify-center mx-1 rounded-md border-2 border-yellow-500 shadow-inner"
                  >
                    <span
                      className="text-2xl font-pixel text-white"
                      style={{
                        textShadow: "0 0 5px rgba(255, 215, 0, 0.5)",
                      }}
                    >
                      {char}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={closeTeamModals}
              className="bg-green-600 hover:bg-green-700 text-white font-pixel px-6 py-2 rounded"
              disabled={!roomCode}
            >
              {roomCode ? "Ready!" : "Please wait..."}
            </button>
          </div>
        )}
        {isJoiningTeam && (
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-pixel text-white mb-2">
              Enter Room Code
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Type the 5-character code to join
            </p>
            <form onSubmit={handleJoinTeamSubmit} className="w-full">
              <div className="flex items-center justify-center mb-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    className="w-12 h-16 bg-gray-800 border-2 border-indigo-500 rounded-md text-center mx-1 text-2xl font-pixel text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 uppercase"
                    value={joinTeamInput[idx] || ""}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      if (/^[A-Z0-9]$/.test(val) || val === "") {
                        const newInput =
                          joinTeamInput.substring(0, idx) +
                          val +
                          joinTeamInput.substring(idx + 1);
                        setJoinTeamInput(newInput);
                        if (val && idx < 4) {
                          const nextInput = e.target
                            .nextElementSibling as HTMLInputElement;
                          if (nextInput) nextInput.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !joinTeamInput[idx] &&
                        idx > 0
                      ) {
                        const prevInput = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        if (prevInput) prevInput.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={closeTeamModals}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-pixel px-4 py-2 rounded mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joinTeamInput.length !== 5}
                  className={`${
                    joinTeamInput.length === 5
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-900 cursor-not-allowed"
                  } text-white font-pixel px-6 py-2 rounded`}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        )}
        {socketError && (
          <div className="bg-red-900 bg-opacity-70 p-3 mt-4 rounded-md">
            <p className="text-red-200 text-sm">{socketError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamModals;
