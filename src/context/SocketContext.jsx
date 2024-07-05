import io from "socket.io-client";

import { createContext, useContext, useEffect, useState } from "react";
import { UidContext } from "./UidContext";
import { isEmpty } from "../lib/allFunctions";

const socketUrl = "http://localhost:8000";
export const SocketContext = createContext();

export default function SocketContextProvider({ children }) {
  const { userId } = useContext(UidContext);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!isEmpty(userId)) {
      const newSocket = io(socketUrl, { query: { id: userId } });
      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [socket]);

  const isOnline = (id) => {
    return onlineUsers.includes(id);
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isOnline }}>
      {children}
    </SocketContext.Provider>
  );
}
