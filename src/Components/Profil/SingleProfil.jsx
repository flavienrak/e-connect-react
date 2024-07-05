import ProfilMenu from "./ProfilMenu";
import qs from "query-string";
import ProfilImg from "./ProfilImg";

import { fr } from "date-fns/locale";
import { useContext, useEffect } from "react";
import { UidContext } from "../../context/UidContext";
import { format } from "date-fns";
import { SocketContext } from "../../context/SocketContext";

export default function SingleProfil({
  user,
  items,
  active,
  views,
  setViews,
  setActive,
  setItems,
}) {
  const { isOnline } = useContext(SocketContext);
  const { userId, path } = useContext(UidContext);

  const url = qs.stringifyUrl(
    {
      url: path,
      query: {
        path: "message",
        user: user._id,
      },
    },
    { skipNull: true }
  );

  useEffect(() => {
    if (user?.posts || user?.followers || user?.followed) {
      setItems((prev) => {
        let newState = [...prev];
        if (user?.posts) {
          newState.forEach((item, index) => {
            if (item.active === "publications") {
              newState[index] = {
                ...newState[index],
                number: user.posts.length,
              };
            }
          });
        }
        if (user?.followed) {
          newState.forEach((item, index) => {
            if (item.active === "abonnements") {
              newState[index] = {
                ...newState[index],
                number: user.followed.length,
              };
            }
          });
        }
        if (user?.followers) {
          newState.forEach((item, index) => {
            if (item.active === "abonnees") {
              newState[index] = {
                ...newState[index],
                number: user.followers.length,
              };
            }
          });
        }
        return newState;
      });
    }
  }, [user?.posts, user?.followers, user?.followed]);

  const formatDate = (date) => {
    return format(date, "dd MMMM yyyy", { locale: fr });
  };

  return (
    <div className="bg-[var(--bg-primary)] p-4 rounded-xl flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <ProfilImg
            online={isOnline(user._id) && user._id !== userId}
            image={user.image}
          />
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-[var(--opposite)]">{user.name}</p>
            <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-[var(--opposite)] font-light text-xs">
            {user.views.length > -1 && (
              <>
                <span
                  onClick={() => setViews((prev) => !prev)}
                  className={`font-light text-xs cursor-pointer ${
                    views
                      ? "text-[var(--primary-color)]"
                      : "text-[var(--opposite)] hover:underline hover:text-[var(--primary-color)]"
                  }`}
                >
                  ({user.views.length}) vues
                </span>{" "}
                -{" "}
              </>
            )}

            {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 pl-12 bg-[var(--bg-primary)] p-4 rounded-xl">
        <ProfilMenu
          isOwn={userId === user._id}
          url={url}
          items={items}
          active={active}
          setActive={setActive}
        />
      </div>
    </div>
  );
}
