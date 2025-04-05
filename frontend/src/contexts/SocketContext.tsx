"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  createRoom: () => void;
  joinRoom: (roomCode: string) => void;
  leaveRoom: (roomCode: string) => void;
  roomCode: string;
  players: Record<string, PlayerData>;
  error: string | null;
}

export interface PlayerData {
  id: string;
  position: { x: number; y: number };
  username: string;
  emote: string | null;
}

// Default context values
const defaultContext: SocketContextType = {
  socket: null,
  isConnected: false,
  createRoom: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
  roomCode: '',
  players: {},
  error: null
};

// Create the context
const SocketContext = createContext<SocketContextType>(defaultContext);

// Socket.io server URL
const SOCKET_SERVER_URL = 'http://localhost:3001';

// Provider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState<Record<string, PlayerData>>({});
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    console.log('Initializing socket connection to', SOCKET_SERVER_URL);
    
    // First check if server is reachable
    fetch(SOCKET_SERVER_URL)
      .then(response => {
        console.log('Server is reachable:', response.status);
      })
      .catch(err => {
        console.error('Server fetch error:', err);
      });
    
    // Create socket connection with more options
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
      forceNew: true
    });

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server with ID:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      setError('Failed to connect to server. Please try again.');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    // Store socket in state
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, []);

  // Handle room events
  useEffect(() => {
    if (!socket) return;

    // Room created event
    socket.on('room_created', ({ roomCode }) => {
      console.log('Room created with code:', roomCode);
      setRoomCode(roomCode);
      setPlayers({
        [socket.id]: {
          id: socket.id,
          position: { x: 600, y: 300 },
          username: 'Guest',
          emote: null
        }
      });
      setError(null);
    });

    // Room joined event
    socket.on('room_joined', ({ roomCode, players }) => {
      setRoomCode(roomCode);
      setPlayers(players);
      setError(null);
    });

    // New player joined the room
    socket.on('player_joined', ({ player }) => {
      setPlayers(prev => ({
        ...prev,
        [player.id]: player
      }));
    });

    // Player moved event
    socket.on('player_moved', ({ playerId, position }) => {
      setPlayers(prev => {
        if (prev[playerId]) {
          return {
            ...prev,
            [playerId]: {
              ...prev[playerId],
              position
            }
          };
        }
        return prev;
      });
    });

    // Player emoted event
    socket.on('player_emoted', ({ playerId, emote }) => {
      setPlayers(prev => {
        if (prev[playerId]) {
          return {
            ...prev,
            [playerId]: {
              ...prev[playerId],
              emote
            }
          };
        }
        return prev;
      });
    });

    // Player renamed event
    socket.on('player_renamed', ({ playerId, username }) => {
      setPlayers(prev => {
        if (prev[playerId]) {
          return {
            ...prev,
            [playerId]: {
              ...prev[playerId],
              username
            }
          };
        }
        return prev;
      });
    });

    // Player left event
    socket.on('player_left', ({ playerId }) => {
      setPlayers(prev => {
        const newPlayers = { ...prev };
        delete newPlayers[playerId];
        return newPlayers;
      });
    });

    // Room error event
    socket.on('room_error', ({ message }) => {
      setError(message);
    });

    // Clean up listeners on unmount
    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('player_moved');
      socket.off('player_emoted');
      socket.off('player_renamed');
      socket.off('player_left');
      socket.off('room_error');
    };
  }, [socket]);

  // Create a new room
  const createRoom = () => {
    if (socket && isConnected) {
      console.log('Sending create_room event to server');
      socket.emit('create_room');
    } else {
      console.error('Cannot create room: Socket not connected', {
        socket: !!socket,
        isConnected
      });
    }
  };

  // Join an existing room
  const joinRoom = (code: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', { roomCode: code });
    }
  };

  // Leave the current room
  const leaveRoom = (code: string) => {
    if (socket && isConnected && code) {
      socket.emit('leave_room', { roomCode: code });
      setRoomCode('');
      setPlayers({});
    }
  };

  // The context value
  const value: SocketContextType = {
    socket,
    isConnected,
    createRoom,
    joinRoom,
    leaveRoom,
    roomCode,
    players,
    error
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext); 