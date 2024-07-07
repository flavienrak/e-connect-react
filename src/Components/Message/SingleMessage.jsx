import EmojiPicker from "emoji-picker-react";
import TextMessage from "./TextMessage";
import ProfilImg from "../Profil/ProfilImg";
import qs from "query-string";

import { MdClose } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { RiSendPlane2Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useRef, useState } from "react";
import { UidContext } from "../../context/UidContext";
import { isEmpty } from "../../lib/allFunctions";
import { Link } from "react-router-dom";
import {
  addMessageInfos,
  updateMessagesInfos,
} from "../../redux/slices/messagesSlice";
import { SocketContext } from "../../context/SocketContext";
import { deleteNotificationsInfos } from "../../redux/slices/notificationsSlice";
import { FaUser } from "react-icons/fa";

export default function SingleMessage() {
  const { mode } = useSelector((state) => state.persistInfos);
  const { users } = useSelector((state) => state.users);
  const { messages } = useSelector((state) => state.messages);
  const { isOnline } = useContext(SocketContext);
  const { currentQuery, apiUrl, userId, path, profilUrl } =
    useContext(UidContext);

  const last = useRef(null);
  const textarea = useRef(null);
  const emoji = useRef(null);
  const emojiContainer = useRef(null);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actualMessages, setActualMessages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if ((isMounted || isAdded) && last?.current) {
      last?.current.scrollIntoView();
      setIsAdded(false);
    }
  }, [isMounted, isAdded]);

  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "2.5rem";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (!isEmpty(currentQuery?.user)) {
      setUser(users.find((item) => item._id === currentQuery.user));

      (async () => {
        const res = await fetch(
          `${apiUrl}/message/${userId}/${currentQuery.user}/view-all`
        ).then((res) => res.json());

        if (res?.messages) {
          dispatch(
            updateMessagesInfos({
              messages: res.messages,
              userId: currentQuery.user,
            })
          );
        }
      })();
    }
  }, [currentQuery?.user, users]);

  useEffect(() => {
    if (messages) {
      (async () => {
        const res = await fetch(
          `${apiUrl}/notification/${userId}/message/view-all`
        ).then((res) => res.json());

        if (res?.notifications) {
          dispatch(
            deleteNotificationsInfos({ notifications: res.notifications })
          );
        }
      })();

      setActualMessages(
        messages.find((item) => item.userId === currentQuery.user)?.messages ||
          []
      );

      if ((isMounted || isAdded) && last?.current) {
        last?.current.scrollIntoView();
        setIsAdded(false);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!isEmpty(actualMessages)) {
      setIsViewed(
        actualMessages.every((item) => item.viewed === true) &&
          actualMessages[actualMessages.length - 1]?.senderId === userId
      );
    }
  }, [actualMessages]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmpty(message.trim())) {
      setIsLoading(true);
      const res = await fetch(
        `${apiUrl}/message/${userId}/${currentQuery.user}/send-message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message.trim() }),
        }
      ).then((res) => res.json());
      setIsLoading(false);
      setMessage("");

      if (res?.message) {
        dispatch(
          addMessageInfos({ message: res.message, userId: currentQuery.user })
        );
        setIsAdded(true);
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const url = qs.stringifyUrl(
    {
      url: path,
      query: {
        path: "profil",
        active: "view-profil",
        user: user?._id,
      },
    },
    { skipNull: true }
  );

  if (!isEmpty(user))
    return (
      <div className="w-full max-h-full rounded-xl bg-[var(--bg-primary)]">
        <div className="flex items-center justify-between p-4 w-full">
          <div className="flex gap-2 items-center ">
            <Link to={url}>
              <ProfilImg online={isOnline(user._id)} image={user.image} />
            </Link>

            <div className=" leading-0">
              <p className="font-semibold text-lg leading-6 text-[var(--opposite)]">
                {user.name}
              </p>
              <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
                {isOnline(user._id) && user._id !== userId
                  ? "en ligne"
                  : `${user.email}`}
              </p>
            </div>
          </div>

          <Link to={"/home?path=message"} className="flex items-center gap-4">
            <i className="text-[var(--opposite)] opacity-25">
              <MdClose size={"1.5rem"} />
            </i>
          </Link>
        </div>

        <div className="relative h-full overflow-hidden px-4">
          <div className="scr max-h-[28.5rem] overflow-y-auto">
            <div className="h-full pr-4 pl-2">
              {!isEmpty(actualMessages) && (
                <div className="w-full flex gap-2 flex-col">
                  {actualMessages.map((item) => (
                    <div key={item._id} className="w-full">
                      <TextMessage message={item} comment={item} />
                    </div>
                  ))}
                </div>
              )}

              {isViewed && (
                <div className={`flex justify-end py-2`}>
                  {isEmpty(user.image) ? (
                    <i className="w-5 h-5 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
                      <FaUser size={"0.7rem"} />
                    </i>
                  ) : (
                    <img
                      src={profilUrl + user.image}
                      className="rounded-full object-cover h-5 w-5"
                      alt=""
                    />
                  )}
                </div>
              )}

              <div className="h-14" />
              <div ref={last} />
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full gap-2 flex flex-row items-center p-4 max-h-[28rem] overflow-visible"
        >
          <label ref={emoji} className="relative">
            <i
              onClick={() => setShowEmoji((prev) => !prev)}
              className={`cursor-pointer ${
                showEmoji ? "text-[var(--primary-color)]" : "text-slate-400 "
              }`}
            >
              <BsEmojiSmile size={"1.5rem"} />
            </i>
            <div ref={emojiContainer} className="absolute -left-3">
              <EmojiPicker theme={mode} open={showEmoji} />
            </div>
          </label>

          <textarea
            type="text"
            ref={textarea}
            placeholder="Votre message..."
            value={message}
            onKeyDown={handleEnter}
            onChange={(e) => setMessage(e.target.value)}
            className="py-3 px-4 flex-1 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] textarea text-[var(--opposite)] font-light focus:outline focus:outline-slate-400"
          />
          <i className="flex justify-center items-center bg-[var(--primary-color)] text-[var(--white)] p-3 rounded-xl h-full cursor-pointer">
            <RiSendPlane2Line size={"1.5rem"} />
          </i>
        </form>
      </div>
    );
}
