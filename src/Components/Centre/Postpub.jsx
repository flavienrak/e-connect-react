import { useEffect, useRef, useState } from "react";
import { isEmpty } from "../../lib/allFunctions";
import { IoImageOutline } from "react-icons/io5";

export default function Postpub() {
  const textarea = useRef(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "1rem";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [message]);

  const handleChangeFile = (e) => {
    if (e.target.files) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      setImage(newUrl);
    }
  };

  const handleReset = () => {
    setImage("");
    setMessage("");
  };

  return (
    <>
      <div className="flex items-center justify-between flex-col gap-4 mt-6 rounded-xl bg-[var(--bg-primary)] p-3 min-h-14">
        <textarea
          ref={textarea}
          type="text"
          className="w-full text-sm outline-none py-3 px-4 rounded-lg overflow-hidden bg-[var(--bg-secondary)] textarea"
          placeholder="Quoi de neuf aujourd'hui ?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {(!isEmpty(message.trim()) || !isEmpty(image.trim())) && (
          <div className=" flex w-full flex-col gap-2 rounded-xl bg-[var(--white)] p-4">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-2">
                <img
                  src={"/icon.png"}
                  className="size-10 rounded-full object-cover "
                  alt=""
                />
                <div className="flex flex-col justify-center">
                  <p className="font-bold">Flavien RAK</p>
                  <p className=" text-xs text-gray-500 ">10h:10</p>
                </div>
              </div>
            </div>

            {!isEmpty(image.trim()) && (
              <div className=" h-72 w-full rounded-xl">
                <img
                  src={"/icon.png"}
                  className="size-full rounded-xl object-cover"
                  alt=""
                />
              </div>
            )}

            {!isEmpty(message.trim()) && (
              <div className="flex items-center gap-2">
                <p className="text-sm">{message}</p>
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
            <button
              onClick={handleReset}
              className="h-full rounded-3xl button px-4 py-2 text-xs button"
            >
              Annuler
            </button>
            <button className="h-full rounded-3xl bg-[var(--primary-color)] px-4 py-2 text-xs font-semibold  text-teal-50">
              Publier
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
