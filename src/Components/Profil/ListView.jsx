import qs from "query-string";
import ProfilImg from "./ProfilImg";

import { useContext } from "react";
import { UidContext } from "../../context/UidContext";
import { Link } from "react-router-dom";

export default function ListView({ user }) {
  const { isOnline } = useContext(UidContext);
  const { path, currentQuery, userId } = useContext(UidContext);

  const url = qs.stringifyUrl(
    {
      url: path,
      query: {
        path: currentQuery.path,
        active: "view-profil",
        user: user._id,
      },
    },
    { skipNull: true }
  );

  return (
    <div
      className={`relative p-4 flex justify-between group bg-[var(--bg-primary)] rounded-xl`}
    >
      <div className="w-full flex flex-row gap-3">
        <Link to={url} className="rounded-full w-10 min-w-10 cursor-pointer">
          <ProfilImg
            online={isOnline(user._id) && user._id !== userId}
            image={user.image}
          />
        </Link>

        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between">
            <p className="text-sm font-semibold text-[var(--opposite)]">
              {user.name}
            </p>
          </div>

          <div className="w-full">
            <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
