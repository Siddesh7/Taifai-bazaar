import React from "react";

interface UsernameInputProps {
  username: string;
  setUsername: (name: string) => void;
  handleUsernameSubmit: (e: React.FormEvent) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  username,
  setUsername,
  handleUsernameSubmit,
}) => {
  return (
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
  );
};

export default UsernameInput;
