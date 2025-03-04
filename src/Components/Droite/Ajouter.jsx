import toast from "react-hot-toast";
import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";

import { useContext, useEffect, useState } from "react";
import { UidContext } from "../../context/UidContext";
import { useDispatch } from "react-redux";
import { updateUserInfos } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";

export default function Ajouter({ isOwn, user, isFollowed }) {
  const { isOnline } = useContext(SocketContext);
  const { apiUrl, userId, toastStyle, path, currentQuery } =
    useContext(UidContext);
  const dispatch = useDispatch();

  const [actualLink, setActualLink] = useState(
    "/home?path=accueil&active=create-post"
  );

  useEffect(() => {
    if (currentQuery?.path) {
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
      setActualLink(url);
    }
  }, [currentQuery?.path, user]);

  const handleFollowUser = async () => {
    const res = await fetch(
      `${apiUrl}/user/${userId}/${user._id}/follow-user`
    ).then((res) => res.json());

    if (res?.user) {
      if (isFollowed) {
        toast.success("Désabonée", toastStyle);
      } else {
        toast.success("Abonnée", toastStyle);
      }

      dispatch(updateUserInfos({ user: res.user }));
    }
  };

  const handleRejectUser = async () => {
    const res = await fetch(
      `${apiUrl}/user/${userId}/${user._id}/reject-user`
    ).then((res) => res.json());

    if (res?.user) {
      toast.success("Utilisateur supprimé", toastStyle);
      dispatch(updateUserInfos({ user: res.user }));
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl bg-[var(--bg-primary)] p-4">
      <div className="flex gap-3 items-center">
        <Link
          to={actualLink}
          className="h-10 w-10 relative min-w-10 min-h-10 cursor-pointer"
        >
          <ProfilImg online={isOnline(user._id)} image={user.image} />
        </Link>
        {isOwn ? (
          <div className="flex flex-col flex-1">
            <p className="font-bold text-[var(--opposite)]">{user.name}</p>
            <p className="text-xs line-clamp-1 text-[var(--opposite)] opacity-80 font-light">
              {user.email}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 flex-1">
            <p className="font-bold text-[var(--opposite)]">{user.name}</p>
            <div className="flex gap-2">
              <button
                onClick={handleRejectUser}
                className="rounded-3xl px-2 py-1.5 w-1/2 text-xs text-[var(--opposite)] button"
              >
                Annuler
              </button>
              <button
                onClick={handleFollowUser}
                className="rounded-3xl bg-[var(--primary-color)] px-2 py-1.5 w-1/2 text-[var(--white-color)] hover:opacity-90 text-xs"
              >
                {isFollowed ? "Abonnée" : "Suivre"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
