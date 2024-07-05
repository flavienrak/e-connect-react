import Ajouter from "../Droite/Ajouter";

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { SocketContext } from "../../context/SocketContext";
import { updateUserInfos } from "../../redux/slices/userSlice";

export default function Abonnees() {
  const { user } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.users);
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (socket) {
      const followed = (followers) => {
        dispatch(updateUserInfos({ user: { followers } }));
      };

      socket.on("followed", followed);
      return () => {
        socket.off("followed", followed);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (!isEmpty(users)) {
      const allFollowers = users.filter(
        (item) => item._id !== user._id && user.followers.includes(item._id)
      );

      setFollowers(allFollowers);
    }
  }, [users, user?.followers]);

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Abonnées (<span>{user.followers.length}</span>)
          </p>
        </div>

        {!isEmpty(followers) ? (
          <div className="grid grid-cols-2 gap-2">
            {followers.map((item) => (
              <div key={item._id} className="w-full">
                <Ajouter
                  user={item}
                  isFollowed={user.followed.includes(item._id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
            {`< Aucun abonnee pour le moment >`}
          </p>
        )}
      </div>
    </div>
  );
}
