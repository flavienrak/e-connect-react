import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";

import { useContext, useEffect, useRef, useState } from "react";
import { isEmpty } from "../../lib/allFunctions";
import { IoImageOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { UidContext } from "../../context/UidContext";
import { addOnePostInfos } from "../../redux/slices/postsSlice";
import { SocketContext } from "../../context/SocketContext";

export default function Postpub() {
  const { user } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.persistInfos);
  const { socket } = useContext(SocketContext);
  const { apiUrl, toastStyle, path, currentQuery } = useContext(UidContext);

  const textarea = useRef(null);
  const emoji = useRef(null);
  const emojiContainer = useRef(null);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (socket) {
      const createPost = (post) => {
        // dispatch(updateCommentsPostInfos({ post }));
      };

      socket.on("createPost", createPost);
      return () => {
        socket.off("createPost", createPost);
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

  useEffect(() => {
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setImage(newUrl);
    }
  }, [file]);

  const handleChangeFile = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleChangeEmoji = (e) => {
    setMessage((prev) => prev + e.emoji);
  };

  const handleReset = () => {
    setImage("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmpty(message?.trim()) || file) {
      const data = new FormData();
      if (!isEmpty(message?.trim())) {
        data.append("message", message.trim());
      }
      if (file) {
        data.append("file", file);
      }

      const res = await fetch(`${apiUrl}/post/${user._id}/create-post`, {
        method: "POST",
        body: data,
      }).then((res) => res.json());

      handleReset();

      if (res?.post) {
        dispatch(addOnePostInfos({ post: res.post }));
        toast.success("Nouveau post publie", toastStyle);

        const url = qs.stringifyUrl(
          {
            url: path,
            query: {
              path:
                currentQuery.path === "accueil" ? currentQuery.path : "accueil",
            },
          },
          { skipNull: true }
        );
        setActualLink(url);
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full overflow-visible px-0">
      <div className="w-full flex items-center justify-between flex-col gap-4 rounded-xl bg-[var(--bg-primary)] p-3 min-h-14">
        <div className="relative w-full flex items-center">
          <textarea
            ref={textarea}
            type="text"
            className="w-full text-sm outline-none py-3 px-4 rounded-lg overflow-hidden bg-[var(--bg-secondary)] pl-12 placeholder:opacity-50 text-[var(--opposite)] font-light textarea"
            placeholder="Quoi de neuf aujourd'hui ?"
            value={message}
            onKeyDown={handleEnter}
            onChange={(e) => setMessage(e.target.value)}
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
            <div ref={emojiContainer} className="absolute top-10 -left-3">
              <EmojiPicker
                onEmojiClick={handleChangeEmoji}
                theme={mode}
                open={showEmoji}
              />
            </div>
          </i>
        </div>

        {(!isEmpty(message.trim()) || !isEmpty(image.trim())) && (
          <div className=" flex w-full flex-col gap-2 rounded-xl bg-[var(--bg-primary)] p-4">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-2">
                <ProfilImg image={user.image} />

                <div className="flex flex-col justify-center">
                  <p className="font-bold text-[var(--opposite)]">
                    {user.name}
                  </p>
                  <p className=" text-xs text-gray-400">à l'instant</p>
                </div>
              </div>
            </div>

            {!isEmpty(image.trim()) && (
              <div className=" h-72 w-full rounded-xl">
                <img
                  src={image}
                  className="size-full rounded-xl object-cover"
                  alt=""
                />
              </div>
            )}

            {!isEmpty(message.trim()) && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-[var(--opposite)] font-light">
                  {message}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex w-full justify-between px-1">
          <div className="">
            <label
              htmlFor="file"
              className="font-semibold flex items-center gap-2 text-[var(--primary-color)] cursor-pointer"
            >
              <i>
                <IoImageOutline size={"1.5rem"} />
              </i>
              <span>Image</span>
            </label>
            <input
              id={"file"}
              type="file"
              accept=".jpg, .png, .jpeg"
              className="hidden"
              onChange={handleChangeFile}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label
              onClick={handleReset}
              className="h-full rounded-3xl button px-4 py-2 text-xs text-[var(--opposite)] cursor-pointer button"
            >
              Annuler
            </label>
            <button
              type="submit"
              className="h-full rounded-3xl bg-[var(--primary-color)] px-4 py-2 text-xs font-semibold  text-teal-50"
            >
              Publier
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
