import EmojiPicker from "emoji-picker-react";
import Comment from "./Comment";
import toast from "react-hot-toast";

import { BsEmojiSmile } from "react-icons/bs";
import { isEmpty } from "../../lib/allFunctions";
import { useContext, useEffect, useRef, useState } from "react";
import { UidContext } from "../../context/UidContext";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfos } from "../../redux/slices/userSlice";
import { updateCommentsPostInfos } from "../../redux/slices/postsSlice";

export default function CommentsPost({ post }) {
  const { mode } = useSelector((state) => state.persistInfos);
  const { users } = useSelector((state) => state.users);
  const { toastStyle, userId, apiUrl } = useContext(UidContext);

  const emoji = useRef(null);
  const textarea = useRef(null);
  const emojiContainer = useRef(null);
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "2.5rem";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [comment]);

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
  }, [showEmoji]);

  const handleChangeEmoji = (e) => {
    setComment((prev) => prev + e.emoji);
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
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="" className="font-semibold p-2 text-[var(--opposite)]">
        Commentaires
      </label>

      <form onSubmit={handleComment} className="overflow-visible">
        <div className="relative w-full flex items-center">
          <div className="w-full flex flex-col gap-2">
            <div className="relative flex items-center">
              <textarea
                type="text"
                ref={textarea}
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
              const actualUser = users.find((us) => us._id === item.userId);

              if (!isEmpty(actualUser))
                return (
                  <div key={item._id} className="w-full">
                    <Comment post={post} comment={item} user={actualUser} />
                  </div>
                );
            })}
        </div>
      )}
    </div>
  );
}
