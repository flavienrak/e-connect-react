import pdp from "../../assets/image/ff.jpg";
import Emetteur from "./Emetteur";
import Destinataire from "./Destinataire";

import { MdClose } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { RiSendPlane2Line } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";

export default function Message() {
  const { mode } = useSelector((state) => state.persistInfos);
  const textarea = useRef(null);
  const last = useRef(null);
  const emoji = useRef(null);

  const [message, setMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "1rem";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [message]);

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

  return (
    <>
      <div className="mt-6 w-full max-h-full rounded-xl bg-[var(--bg-primary)]">
        <div className="flex items-center justify-between p-4 w-full">
          <div className="flex gap-2 items-center ">
            <div>
              <img
                src={pdp}
                className=" w-10 h-10 object-cover rounded-full"
                alt=""
              />
            </div>
            <div className=" leading-0">
              <p className="font-semibold text-lg leading-6 text-[var(--opposite)]">
                Flavien RAK
              </p>
              <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
                flavien@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <i className="text-[var(--opposite)] opacity-25">
              <MdClose size={"1.5rem"} />
            </i>
          </div>
        </div>
        <div className="relative h-full overflow-hidden px-4">
          <div className="scr max-h-[28rem] overflow-y-auto">
            <div className="h-max pr-4 pl-2">
              <div className="w-full flex gap-2 flex-col">
                <Emetteur
                  value={`Bonjour! \n Je suis Flavien. Je viens de Miarinarivo Itasy. Je suis un
              developpeur web`}
                />
                <Destinataire value={`Hello!`} />
                <Emetteur value={`Bonjour`} />
                <Destinataire value={`Hello!`} />
                <Destinataire value={`Hello!`} />
                <Emetteur value={`Bonjour`} />
                <Destinataire value={`Hello!`} />
                <Emetteur value={`Bonjour`} />
                <Destinataire value={`Hello!`} />
                <Emetteur value={`Bonjour`} />
                <Destinataire value={`Hello!`} />
                <Emetteur value={`Bonjour`} />
                <Emetteur value={`Bonjour`} />
                <Destinataire value={`Hello!`} />
                <div ref={last} />
              </div>
            </div>
          </div>
        </div>

        <form className="w-full gap-4 flex flex-row items-center p-4 max-h-[28rem] overflow-visible">
          <label ref={emoji} htmlFor="" className="relative">
            <i
              onClick={() => setShowEmoji((prev) => !prev)}
              className={`cursor-pointer ${
                showEmoji ? "text-[var(--primary-color)]" : "text-slate-400 "
              }`}
            >
              <BsEmojiSmile size={"1.5rem"} />
            </i>
            <div className="absolute bottom-10 -left-3">
              <EmojiPicker theme={mode} open={showEmoji} />
            </div>
          </label>
          <textarea
            type="text"
            ref={textarea}
            placeholder="Votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="py-3 px-4 flex-1 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] textarea text-[var(--opposite)] font-light focus:outline focus:outline-slate-400"
          />
          <i className="flex justify-center items-center bg-[var(--primary-color)] text-[var(--white)] p-3 rounded-xl h-full cursor-pointer">
            <RiSendPlane2Line size={"1.5rem"} />
          </i>
        </form>
      </div>
    </>
  );
}
