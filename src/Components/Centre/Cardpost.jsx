import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

import { IoMdHeart } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { isEmpty } from "../../lib/allFunctions";
import { FaCommentAlt, FaRegCommentAlt, FaUser } from "react-icons/fa";
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
import { HiOutlineTrash } from "react-icons/hi";
import { motion } from "framer-motion";

export default function Cardpost({ sender, post, isOwn }) {
  const { mode } = useSelector((state) => state.persistInfos);
  const { apiUrl, userId, toastStyle, profilImg, postImg } =
    useContext(UidContext);

  const emoji = useRef(null);
  const commentTextarea = useRef(null);
  const textarea = useRef(null);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [isCollapse, setIsCollapse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [deletePost, setDeletePost] = useState(false);

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
    if (showEmoji) {
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
  }, [showEmoji]);

  const handleChangeEmoji = (e) => {
    setMessage((prev) => prev + e.emoji);
  };

  const handleLike = async () => {
    setIsLoading(true);
    const res = await fetch(
      `${apiUrl}/post/${userId}/${post._id}/like-post`
    ).then((res) => res.json());

    if (res?.post) {
      dispatch(updateLikesPostInfos({ post: res.post }));
      setIsLoading(false);
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
        dispatch(updateCommentsPostInfos({ post: res.post }));
        toast.success("Commentaire ajoute avec succes", toastStyle);
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleComment(e);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const res = await fetch(
      `${apiUrl}/post/${post._id}/${commentId}/delete-comment`
    ).then((res) => res.json());

    if (res?.post) {
      dispatch(updateCommentsPostInfos({ post: res.post }));
      toast.success("Commentaire supprime avec succes", toastStyle);
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

  return (
    <>
      <div className=" flex w-full flex-col gap-2 rounded-xl bg-[var(--bg-primary)] p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            {isEmpty(sender.image) ? (
              <i className="w-10 h-10 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
                <FaUser size={"1rem"} />
              </i>
            ) : (
              <img
                src={profilImg + sender.image}
                className="rounded-full object-cover h-10 w-10"
                alt=""
              />
            )}

            <div className="">
              <p className="font-bold text-[var(--opposite)]">{sender.name}</p>
              <p className=" text-xs text-[var(--opposite)] opacity-60 font-light">
                {format(post.createdAt, "fr")}
              </p>
            </div>
          </div>
          {isOwn && (
            <i
              onClick={() => setDeletePost((prev) => !prev)}
              className="cursor-pointer"
            >
              <MdClose className="text-slate-400" size={"1.5rem"} />
            </i>
          )}
        </div>

        {!isEmpty(post.image) && (
          <div className=" h-72 w-full rounded-xl">
            <img
              src={postImg + post.image}
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
                      <div className="absolute top-10 -left-3 z-10">
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
                      className="rounded-3xl bg-[var(--primary-color)] px-4 py-2 text-xs font-semibold  text-teal-50"
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
                    return (
                      <div
                        key={item._id}
                        className={`relative p-2 flex justify-between group border-l-2 hover:border-[var(--primary-color)] brd`}
                      >
                        <div className="w-full flex flex-row gap-3">
                          <div className="rounded-full w-10 min-w-10 cursor-pointer">
                            {
                              <i className="w-10 h-10 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
                                <FaUser size={"1rem"} />
                              </i>
                              // <img
                              //   src={"/icon.png"}
                              //   className="h-10 w-10 rounded-full object-cover"
                              //   alt=""
                              // />
                            }
                          </div>

                          {item.userId === userId && (
                            <i
                              onClick={() => handleDeleteComment(item._id)}
                              className="absolute transition delay-75 opacity-0 group-hover:opacity-100 z-10 bottom-2 right-2 h-6 w-6 bg-[var(--primary-color)] rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm flex justify-center items-center text-[var(--white)] hover:opacity-90 cursor-pointer"
                            >
                              <HiOutlineTrash size={"1rem"} />
                            </i>
                          )}

                          <div className="w-full flex flex-col">
                            <div className="w-full flex justify-between">
                              <p className="text-sm font-semibold text-[var(--opposite)]">
                                Flavien RAK
                              </p>
                              <div className="text-xs text-[var(--opposite)] opacity-60 font-light">
                                {format(item.timestamp, "fr")}
                              </div>
                            </div>

                            <div className="w-full">
                              <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        </div>
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
