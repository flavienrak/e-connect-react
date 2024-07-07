import ProfilImg from "../Profil/ProfilImg";
import toast from "react-hot-toast";

import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import { UidContext } from "../../context/UidContext";
import { HiOutlineTrash } from "react-icons/hi";
import { updateUserInfos } from "../../redux/slices/userSlice";
import { updateCommentsPostInfos } from "../../redux/slices/postsSlice";
import { useDispatch } from "react-redux";

export default function Comment({ user, comment, post }) {
  const { isOnline, socket } = useContext(SocketContext);
  const { userId, toastStyle, apiUrl, formatDate } = useContext(UidContext);

  const dispatch = useDispatch();

  useEffect(() => {
    if (socket) {
      const deleteCommentPost = (post) => {
        dispatch(updateCommentsPostInfos({ post }));
      };

      socket.on("deleteCommentPost", deleteCommentPost);
      return () => {
        socket.off("deleteCommentPost", deleteCommentPost);
      };
    }
  }, [socket]);

  const handleDeleteComment = async () => {
    const res = await fetch(
      `${apiUrl}/post/${userId}/${post._id}/${comment._id}/delete-comment`
    ).then((res) => res.json());

    console.log(res);

    if (res?.post) {
      dispatch(updateUserInfos({ user: res.user }));
      dispatch(updateCommentsPostInfos({ post: res.post }));
      toast.success("Commentaire supprimé", toastStyle);
    }
  };

  return (
    <div
      className={`relative p-2 flex justify-between group border-l-2 hover:border-[var(--primary-color)] hover:bg-[var(--bg-secondary)] transition delay-75 brd`}
    >
      <div className="w-full flex flex-row gap-3">
        <ProfilImg online={isOnline(user._id)} image={user.image} />

        {(comment.userId === userId || post.senderId === userId) && (
          <i
            onClick={handleDeleteComment}
            className="absolute transition delay-75 opacity-0 group-hover:opacity-100 z-10 bottom-2 right-2 h-6 w-6 bg-[var(--primary-color)] rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm flex justify-center items-center text-[var(--white)] hover:opacity-90 cursor-pointer"
          >
            <HiOutlineTrash size={"1rem"} />
          </i>
        )}

        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between">
            <p className="text-sm font-semibold text-[var(--opposite)]">
              {user.name}
            </p>
            <div className="text-xs text-[var(--opposite)] opacity-60 font-light">
              {formatDate(comment.timestamp)}
            </div>
          </div>

          <div className="w-full">
            <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
              {comment.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
