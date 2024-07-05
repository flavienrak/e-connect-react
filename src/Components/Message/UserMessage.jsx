import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { UidContext } from "../../context/UidContext";
import { SocketContext } from "../../context/SocketContext";

export default function UserMessage({ user, message }) {
  const { isOnline } = useContext(SocketContext);
  const { path, currentQuery, formatDate, userId } = useContext(UidContext);

  const url = qs.stringifyUrl(
    {
      url: path,
      query: {
        path: currentQuery.path,
        user: user._id,
      },
    },
    { skipNull: true }
  );

  return (
    <Link
      to={url}
      className="relative bg-[var(--bg-primary)] flex rounded-xl p-4 gap-2 min-w-60 cursor-default"
    >
      <div className="flex justify-center items-center gap-2">
        <ProfilImg
          online={isOnline(user._id) && user._id !== userId}
          image={user.image}
        />
        <div className="flex items-center min-h-full">
          <label className="w-full pr-10 flex justify-center flex-col">
            <p className="font-semibold text-[var(--opposite)]">{user.name}</p>
            <p
              className={`text-sm line-clamp-1 text-[var(--opposite)] ${
                message.status === "vue" ? "opacity-80 font-light" : ""
              }`}
            >
              {message.message}
            </p>
          </label>
        </div>
      </div>

      <p className="text-xs text-[var(--opposite)] absolute top-5 right-5 font-semibold">
        {formatDate(message.updatedAt)}
      </p>
    </Link>
  );
}
