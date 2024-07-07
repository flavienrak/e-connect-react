import io from "socket.io-client";

import { createContext, useContext, useEffect, useState } from "react";
import { UidContext } from "./UidContext";
import { isEmpty } from "../lib/allFunctions";
import {
  removeOnePostInfos,
  updateCommentsPostInfos,
  updateLikesPostInfos,
} from "../redux/slices/postsSlice";
import {
  addNotificationInfos,
  deleteOneNotificationInfos,
} from "../redux/slices/notificationsSlice";
import { useDispatch } from "react-redux";
import {
  addMessageInfos,
  updateMessagesInfos,
} from "../redux/slices/messagesSlice";
import { updateUserInfos } from "../redux/slices/userSlice";

const socketUrl = "http://localhost:8000";
export const SocketContext = createContext();

export default function SocketContextProvider({ children }) {
  const { userId } = useContext(UidContext);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const dispatch = useDispatch();

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
      const getOnlineUsers = (users) => {
        setOnlineUsers(users);
      };

      const followed = (obj) => {
        const { followers, notification } = obj;
        dispatch(updateUserInfos({ user: { followers } }));
        dispatch(addNotificationInfos({ notification }));
      };
      const unfollowed = (obj) => {
        const { followers, notification } = obj;
        dispatch(updateUserInfos({ user: { followers } }));
        dispatch(deleteOneNotificationInfos({ notification }));
      };

      const newMessage = (obj) => {
        const { message, notification, userId } = obj;
        dispatch(addMessageInfos({ message, userId }));
        dispatch(addNotificationInfos({ notification }));
      };
      const viewMessages = (obj) => {
        const { messages, userId } = obj;
        dispatch(updateMessagesInfos({ messages, userId }));
      };
      const deletePost = (post) => {
        dispatch(removeOnePostInfos({ post }));
      };
      const updateLikesPost = (post) => {
        dispatch(updateLikesPostInfos({ post }));
      };
      const updateCommentsPost = (post) => {
        dispatch(updateCommentsPostInfos({ post }));
      };
      const addNotification = (notification) => {
        dispatch(addNotificationInfos({ notification }));
      };
      const deleteNotification = (notification) => {
        dispatch(deleteOneNotificationInfos({ notification }));
      };

      socket.on("followed", followed);
      socket.on("unfollowed", unfollowed);

      socket.on("newMessage", newMessage);
      socket.on("viewMessages", viewMessages);

      socket.on("deletePost", deletePost);
      socket.on("createPost", addNotification);
      socket.on("editPostNotification", addNotification);

      socket.on("likePost", updateLikesPost);
      socket.on("unlikePost", updateLikesPost);

      socket.on("likePostNotification", addNotification);
      socket.on("commentPostNotification", addNotification);

      socket.on("unlikePostNotification", deleteNotification);
      socket.on("deleteCommentPostNotification", deleteNotification);

      socket.on("commentPost", updateCommentsPost);
      socket.on("deleteCommentPost", updateCommentsPost);

      socket.on("getOnlineUsers", getOnlineUsers);

      return () => {
        socket.off("followed", followed);
        socket.off("unfollowed", unfollowed);

        socket.off("newMessage", newMessage);
        socket.off("viewMessages", viewMessages);

        socket.off("deletePost", deletePost);
        socket.off("createPost", addNotification);
        socket.off("editPostNotification", addNotification);

        socket.off("likePost", updateLikesPost);
        socket.off("unlikePost", updateLikesPost);

        socket.off("likePostNotification", addNotification);
        socket.off("commentPostNotification", addNotification);

        socket.off("unlikePostNotification", deleteNotification);
        socket.off("deleteCommentPostNotification", deleteNotification);

        socket.off("commentPost", updateCommentsPost);
        socket.off("deleteCommentPost", updateCommentsPost);

        socket.off("getOnlineUsers", getOnlineUsers);
      };
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
