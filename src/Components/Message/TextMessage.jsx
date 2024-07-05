import toast from "react-hot-toast";

import { useContext, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { UidContext } from "../../context/UidContext";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessageInfos } from "../../redux/slices/messagesSlice";
import { isEmpty } from "../../lib/allFunctions";
import { SocketContext } from "../../context/SocketContext";

export default function TextMessage({ message, comment }) {
  const { messages } = useSelector((state) => state.messages);
  const { socket } = useContext(SocketContext);
  const { apiUrl, userId, toastStyle, currentQuery } = useContext(UidContext);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(currentQuery?.user) && socket) {
      const deleteMessage = (obj) => {
        const { message, userId } = obj;
        dispatch(deleteMessageInfos({ message, userId }));
      };
      socket.on("deleteMessage", deleteMessage);
      return () => {
        socket.off("deleteMessage", deleteMessage);
      };
    }
  }, [messages, currentQuery?.user, socket]);

  const handleDeleteMessage = async () => {
    if (comment.senderId === userId) {
      const res = await fetch(
        `${apiUrl}/message/${userId}/${currentQuery.user}/${message._id}/delete-message`
      ).then((res) => res.json());

      if (res?.message) {
        dispatch(
          deleteMessageInfos({
            message: res.message,
            userId: currentQuery.user,
          })
        );
        toast.success("Message supprimé", toastStyle);
      }
    }
  };

  return (
    <div
      className={`flex w-full ${
        comment.senderId === userId ? "justify-end" : ""
      }`}
    >
      <div
        className={`w-3/5 flex ${
          comment.senderId === userId ? "justify-end" : ""
        }`}
      >
        <div className={`relative max-w-max group flex items-center`}>
          <i
            onClick={handleDeleteMessage}
            className={`absolute transition delay-75 opacity-0 z-10 h-6 w-6 bg-[var(--primary-color)] flex justify-center items-center text-[var(--white)] ${
              comment.senderId === userId
                ? "-left-8 rounded-tl-xl rounded-tr-xl rounded-br-sm rounded-bl-xl cursor-pointer group-hover:opacity-100"
                : "-right-8 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm"
            }`}
          >
            <HiOutlineTrash size={"1rem"} />
          </i>
          <p
            className={`text-sm font-light py-2 px-4 rounded-3xl ${
              comment.senderId === userId
                ? "text-[var(--white)] bg-[var(--primary-color)]"
                : "text-[var(--opposite)] bg-[var(--bg-secondary)]"
            }`}
          >
            {comment.message}
          </p>
        </div>
      </div>
    </div>
  );
}
