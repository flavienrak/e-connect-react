import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";

import { BsEmojiSmile } from "react-icons/bs";
import { useSelector } from "react-redux";

export default function TextareaPost({ handleEnter, message, setMessage }) {
  const textarea = useRef(null);
  const emoji = useRef(null);
  const emojiContainer = useRef(null);

  const { mode } = useSelector((state) => state.persistInfos);
  const [showEmoji, setShowEmoji] = useState(false);

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

  return (
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
        <div ref={emojiContainer} className="absolute top-10 -left-3 z-10">
          <EmojiPicker
            onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
            theme={mode}
            open={showEmoji}
          />
        </div>
      </i>
    </div>
  );
}
