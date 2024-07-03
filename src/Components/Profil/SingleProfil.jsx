import ProfilMenu from "./ProfilMenu";

import { FaUser } from "react-icons/fa";
import { isEmpty } from "../../lib/allFunctions";
import { useContext, useEffect } from "react";
import { UidContext } from "../../context/UidContext";
import { Link } from "react-router-dom";

export default function SingleProfil({
  user,
  items,
  active,
  setActive,
  setItems,
}) {
  const { formatDate, profilImg } = useContext(UidContext);

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

  return (
    <div className="bg-[var(--bg-primary)] p-4 rounded-xl flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          {isEmpty(user.image) ? (
            <i className="w-10 h-10 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
              <FaUser size={"1rem"} />
            </i>
          ) : (
            <img
              src={profilImg + user.image}
              alt="Profile"
              className="rounded-full h-10 w-10 min-w-10 object-cover"
            />
          )}
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-[var(--opposite)]">{user.name}</p>
            <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-slate-400 font-light text-xs">
            {/* <Link to={"/home?path=accueil"}> */}
            <span className="text-slate-400 font-light text-xs">
              ({user.views.length}) vues
            </span>
            {/* </Link>{" "} */} - {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 pl-12 bg-[var(--bg-primary)] p-4 rounded-xl">
        <ProfilMenu items={items} active={active} setActive={setActive} />
      </div>
    </div>
  );
}
