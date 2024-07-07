import toast from "react-hot-toast";
import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";
import CommentsPost from "../postes/CommentsPost";

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
  updatePostInfos,
} from "../../redux/slices/postsSlice";
import { LuHeart } from "react-icons/lu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { updateUserInfos } from "../../redux/slices/userSlice";
import { FaCircleCheck, FaRegCircleCheck } from "react-icons/fa6";
import { SocketContext } from "../../context/SocketContext";

export default function Cardpost({ sender, post, isOwn, isViewPost }) {
  const { user } = useSelector((state) => state.user);
  const { isOnline, socket } = useContext(SocketContext);
  const { apiUrl, userId, toastStyle, postUrl, path, currentQuery } =
    useContext(UidContext);

  const emoji = useRef(null);
  const emojiContainer = useRef(null);
  const dispatch = useDispatch();

  const [isCollapse, setIsCollapse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (socket) {
      const commentPost = (post) => {
        dispatch(updateCommentsPostInfos({ post }));
      };
      const editPost = (post) => {
        dispatch(updatePostInfos({ post }));
      };

      socket.on("editPost", editPost);
      socket.on("commentPost", commentPost);

      return () => {
        socket.off("commentPost", commentPost);
        socket.off("editPost", editPost);
      };
    }
  }, [socket]);

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

  const viewPostUrl = qs.stringifyUrl(
    {
      url: path,
      query: {
        path: currentQuery.path,
        post: post._id,
      },
    },
    { skipNull: true }
  );

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
      <div className="flex w-full flex-col gap-2 rounded-xl bg-[var(--bg-primary)] p-4 group">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <Link to={url}>
              <ProfilImg online={isOnline(sender._id)} image={sender.image} />
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

          <div className="flex items-center gap-2">
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
              className={`text-sm text-[var(--opposite)] font-light whitespace-pre-line ${
                isCollapse || isViewPost ? "" : "line-clamp-3"
              }`}
            >
              {post.message}{" "}
              {!isViewPost && (
                <Link
                  to={viewPostUrl}
                  className="w-max opacity-0 text-[var(--primary-color)] group-hover:opacity-100 hover:underline"
                >
                  <span className="text-sm">{`consulter ->`}</span>
                </Link>
              )}
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

        {showComments && <CommentsPost post={post} />}
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
