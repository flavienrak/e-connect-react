import { useContext } from "react";
import ProfilImg from "../Profil/ProfilImg";

import { format } from "date-fns";
import { SocketContext } from "../../context/SocketContext";

export default function Messageperso({ user, message }) {
  const { isOnline } = useContext(SocketContext);

  return (
    <>
      <div className="flex cursor-pointer flex-row gap-3">
        <ProfilImg online={isOnline(user._id)} image={user.image} />
        <div className="w-full">
          <p className="text-sm font-semibold text-[var(--opposite)]">
            {user.name}
          </p>
          <label className="flex justify-between items-center gap-2">
            <p
              className={`flex-1 text-sm line-clamp-1 text-[var(--opposite)] ${
                message.status === "vue" ? "opacity-80 font-light" : ""
              }`}
            >
              {message.message}
            </p>
            <span className="text-xs text-[var(--opposite)] font-semibold">
              {format(message.updatedAt, "HH:mm")}
            </span>
          </label>
        </div>
      </div>
    </>
  );
}
