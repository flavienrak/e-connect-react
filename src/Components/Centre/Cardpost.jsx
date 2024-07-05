import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";
import Comment from "../postes/Comment";

import { IoMdHeart } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { isEmpty } from "../../lib/allFunctions";
import { FaCommentAlt, FaRegCommentAlt } from "react-icons/fa";
import { format } from "timeago.js";
import { useContext, useEffect, useRef, useState } from "react";
import { UidContext } from "../../context/UidContext";
import { useDispatch, useSelector } from "react-redux";
import {
  removeOnePostInfos,
  updateCommentsPostInfos,
  updateLikesPostInfos,
} from "../../redux/slices/postsSlice";
import { LuHeart } from "react-icons/lu";
import { BsEmojiSmile } from "react-icons/bs";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { updateUserInfos } from "../../redux/slices/userSlice";
import { FaCircleCheck, FaRegCircleCheck } from "react-icons/fa6";
import { SocketContext } from "../../context/SocketContext";

export default function Cardpost({ sender, post, isOwn }) {
  const { user } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.persistInfos);
  const { users } = useSelector((state) => state.users);
  const { isOnline, socket } = useContext(SocketContext);
  const { apiUrl, userId, toastStyle, postUrl, path, currentQuery } =
    useContext(UidContext);

  const emoji = useRef(null);
  const commentTextarea = useRef(null);
  const textarea = useRef(null);
  const emojiContainer = useRef(null);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [isCollapse, setIsCollapse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (socket) {
      const likePost = (post) => {
        dispatch(updateLikesPostInfos({ post }));
      };
      const commentPost = (post) => {
        dispatch(updateCommentsPostInfos({ post }));
      };

      socket.on("likePost", likePost);
      socket.on("commentPost", commentPost);

      return () => {
        socket.off("likePost", likePost);
        socket.off("commentPost", commentPost);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "2.5rem";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (commentTextarea.current) {
      commentTextarea.current.style.height = "2.5rem";
      commentTextarea.current.style.height = `${commentTextarea.current.scrollHeight}px`;
    }
  }, [comment]);

  useEffect(() => {
    if (!isEmpty(sender?._id)) {
      setIsFollowed(
        user.followed.some(
          (item) => item === sender._id && sender._id !== userId
        )
      );
    }
  }, [user?.followed, sender._id]);

  useEffect(() => {
    if (showEmoji) {
      const element = emojiContainer.current;
      if (element) {
        const spaceAbove = element.getBoundingClientRect().top;

        if (spaceAbove >= 450) {
          element.style.top = "auto";
          element.style.bottom = "2.5rem";
        } else {
          element.style.top = "2.5rem";
          element.style.bottom = "auto";
        }
      }

      const handleClickOutside = (e) => {
        if (emoji.current && !emoji.current.contains(e.target)) {
          setShowEmoji(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showEmoji, emojiContainer]);

  const url = qs.stringifyUrl(
    {
      url: path,
      query: {
        ...(userId !== sender._id
          ? { path: currentQuery.path }
          : { path: "profil" }),
        ...(userId !== sender._id && { active: "view-profil" }),
        ...(userId !== sender._id && { user: sender._id }),
      },
    },
    { skipNull: true }
  );

  const handleChangeEmoji = (e) => {
    setMessage((prev) => prev + e.emoji);
  };

  const handleLike = async () => {
    setIsLoading(true);
    const res = await fetch(
      `${apiUrl}/post/${userId}/${post._id}/like-post`
    ).then((res) => res.json());
    setIsLoading(false);

    if (res?.post) {
      dispatch(updateUserInfos({ user: res.user }));
      dispatch(updateLikesPostInfos({ post: res.post }));
    }
  };

  const resetComment = () => {
    setComment("");
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!isEmpty(comment?.trim())) {
      const res = await fetch(
        `${apiUrl}/post/${userId}/${post._id}/comment-post`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment }),
        }
      ).then((res) => res.json());
      resetComment();

      if (res?.post) {
        dispatch(updateUserInfos({ user: res.user }));
        dispatch(updateCommentsPostInfos({ post: res.post }));
        toast.success("Commentaire ajouté", toastStyle);
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleComment(e);
    }
  };

  const handleDeletePost = async () => {
    const res = await fetch(
      `${apiUrl}/post/${userId}/${post._id}/delete-post`
    ).then((res) => res.json());
    setDeletePost(false);

    if (res?.post) {
      dispatch(removeOnePostInfos({ post: res.post }));
      toast.success("Post supprime avec succes", toastStyle);
    }
  };

  const handleFollowUser = async () => {
    const res = await fetch(
      `${apiUrl}/user/${userId}/${sender._id}/follow-user`
    ).then((res) => res.json());

    if (res?.user) {
      if (isFollowed) {
        toast.success("Désabonée", toastStyle);
      } else {
        toast.success("Abonnée", toastStyle);
      }

      dispatch(updateUserInfos({ user: res.user }));
    }
  };

  const handleRejectPost = async () => {
    const res = await fetch(
      `${apiUrl}/post/${userId}/${post._id}/reject-post`
    ).then((res) => res.json());

    if (res?.post) {
      dispatch(updateUserInfos({ user: res.user }));
      toast.success("Post supprime", toastStyle);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-2 rounded-xl bg-[var(--bg-primary)] p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <Link to={url}>
              <ProfilImg
                online={isOnline(sender._id) && sender._id !== userId}
                image={sender.image}
              />
            </Link>

            <div className="">
              <p className="font-bold text-[var(--opposite)] flex items-center gap-2">
                {sender.name}{" "}
                {sender._id !== userId && (
                  <>
                    <span
                      onClick={handleFollowUser}
                      className="cursor-pointer hover:text-[var(--primary-color)] opacity-90"
                    >
                      {isFollowed ? (
                        <FaCircleCheck size={"1rem"} />
                      ) : (
                        <FaRegCircleCheck size={"1rem"} />
                      )}
                    </span>
                  </>
                )}
              </p>
              <p className=" text-xs text-[var(--opposite)] opacity-60 font-light">
                {format(post.createdAt, "fr")}
              </p>
            </div>
          </div>

          {!user.rejectedPost.includes(post._id) && (
            <i
              onClick={() => {
                if (isOwn) {
                  setDeletePost((prev) => !prev);
                } else {
                  handleRejectPost();
                }
              }}
              className="cursor-pointer"
            >
              <MdClose className="text-slate-400" size={"1.5rem"} />
            </i>
          )}
        </div>

        {!isEmpty(post.image) && (
          <div className="h-72 w-full rounded-xl">
            <img
              src={postUrl + post.image}
              className="size-full rounded-xl object-cover"
              alt=""
            />
          </div>
        )}

        {!isEmpty(post.message) && (
          <div className="flex items-center gap-2 pl-2">
            <p
              onClick={() => setIsCollapse((prev) => !prev)}
              className={`text-sm text-[var(--opposite)] font-light ${
                isCollapse ? "" : "line-clamp-3"
              }`}
            >
              {post.message}
            </p>
          </div>
        )}

        <div className="flex justify-evenly gap-4">
          <i
            onClick={handleLike}
            className={`flex gap-2 justify-center items-center w-1/2 rounded-full h-10 cursor-pointer select-none button ${
              isLoading ? "pointer-events-none" : ""
            } ${
              post.likes?.includes(userId)
                ? "text-[var(--primary-color)]"
                : "text-[var(--opposite)] opacity-50"
            }`}
          >
            {!isEmpty(post.likes) && (
              <span className="not-italic">{post.likes.length}</span>
            )}

            {post.likes?.includes(userId) ? (
              <IoMdHeart size={"1.5rem"} />
            ) : (
              <LuHeart size={"1.5rem"} />
            )}
          </i>

          <i
            onClick={() => setShowComments((prev) => !prev)}
            className={`flex gap-2 justify-center items-center w-1/2 rounded-full h-10 cursor-pointer select-none button ${
              showComments
                ? "text-[var(--primary-color)]"
                : "text-[var(--opposite)] opacity-50"
            }`}
          >
            {!isEmpty(post.comments) && (
              <span className="not-italic">{post.comments.length}</span>
            )}
            {showComments ? (
              <FaCommentAlt size={"1.35rem"} />
            ) : (
              <FaRegCommentAlt size={"1.35rem"} />
            )}
          </i>
        </div>

        {showComments && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor=""
              className="font-semibold p-2 text-[var(--opposite)]"
            >
              Commentaires
            </label>

            <form onSubmit={handleComment} className="overflow-visible">
              <div className="relative w-full flex items-center">
                <div className="w-full flex flex-col gap-2">
                  <div className="relative flex items-center">
                    <textarea
                      ref={commentTextarea}
                      type="text"
                      className="w-full text-sm outline-none py-3 px-4 rounded-xl overflow-hidden bg-[var(--bg-secondary)] pl-12 textarea text-[var(--opposite)] placeholder:opacity-50"
                      placeholder="Ajouter un commentaire..."
                      value={comment}
                      onKeyDown={handleEnter}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <i
                      ref={emoji}
                      onClick={() => setShowEmoji((prev) => !prev)}
                      className={`cursor-pointer absolute left-3 ${
                        showEmoji
                          ? "text-[var(--primary-color)]"
                          : "text-[var(--opposite)] opacity-25 hover:opacity-100"
                      }`}
                    >
                      <BsEmojiSmile size={"1.5rem"} />
                      <div
                        ref={emojiContainer}
                        className="absolute top-10 -left-3 z-10"
                      >
                        <EmojiPicker
                          onEmojiClick={handleChangeEmoji}
                          theme={mode}
                          open={showEmoji}
                        />
                      </div>
                    </i>
                  </div>

                  <div className="w-full flex gap-2 items-center justify-end">
                    <label
                      onClick={resetComment}
                      className="rounded-3xl button px-4 py-2 text-xs button text-[var(--opposite)] cursor-pointer"
                    >
                      Annuler
                    </label>
                    <button
                      type="submit"
                      className="rounded-3xl bg-[var(--primary-color)] px-4 py-2 text-xs font-semibold  text-[var(--white)]"
                    >
                      Commenter
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {!isEmpty(post.comments) && (
              <div className="flex flex-col">
                {post.comments
                  .slice()
                  .reverse()
                  .map((item) => {
                    const actualUser = users.find(
                      (us) => us._id === item.userId
                    );

                    if (!isEmpty(actualUser))
                      return (
                        <div key={item._id} className="w-full">
                          <Comment
                            post={post}
                            comment={item}
                            user={actualUser}
                          />
                        </div>
                      );
                  })}
              </div>
            )}
          </div>
        )}
      </div>

      {deletePost && isOwn && (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bgTrans z-10">
          <motion.div
            initial={{ y: -15 }}
            animate={{ y: 0 }}
            className="bg-[var(--bg-primary)] brd p-4 rounded-xl max-w-72 flex flex-col gap-2"
          >
            <p className="text-center font-semibold text-[var(--opposite)]">
              Voulez-vous vraiment supprimer le post ?
            </p>
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setDeletePost(false)}
                className="bg-[var(--bg-secondary)] text-[var(--opposite)] opacity-90 px-4 py-1 rounded-full w-1/2 font-light button"
              >
                Non
              </button>
              <button
                onClick={handleDeletePost}
                className="bg-[var(--primary-color)] text-[var(--white)] px-4 py-1 rounded-full w-1/2"
              >
                Oui
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
