import ProfilImg from "../Profil/ProfilImg";

import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { UidContext } from "../../context/UidContext";

export default function Messageperso({ user, message, notif, viewed }) {
  const { isOnline } = useContext(SocketContext);
  const { formatDate } = useContext(UidContext);

  return (
    <>
      <div className="flex cursor-pointer flex-row gap-3">
        <ProfilImg online={isOnline(user._id)} image={user.image} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center gap-2">
            <label className="font-semibold text-[var(--opposite)] whitespace-nowrap overflow-hidden text-ellipsis">
              {user.name}
            </label>
            <p className="text-xs text-[var(--opposite)] font-semibold whitespace-nowrap">
              {formatDate(message.updatedAt)}
            </p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <label
              className={`text-sm line-clamp-1 text-[var(--opposite)] ${
                viewed ? "opacity-50 font-light" : "font-semibold"
              }`}
            >
              {message.message}
            </label>

            {notif && (
              <p className="flex justify-center items-center text-xs h-5 w-5 rounded-full bg-[var(--primary-color)] text-[var(--white)] font-semibold">
                {notif}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
