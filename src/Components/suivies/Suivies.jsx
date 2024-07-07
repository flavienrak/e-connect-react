import { useSelector } from "react-redux";
import Ajouter from "../Droite/Ajouter";
import { useEffect, useState } from "react";
import { isEmpty } from "../../lib/allFunctions";

export default function Suivies() {
  const { user } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.users);

  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    if (users) {
      setFollowedUsers(
        users.filter(
          (item) => item._id !== user._id && user.followed.includes(item._id)
        )
      );
    }
  }, [users]);

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Suivies (<span>{user.followed.length}</span>)
          </p>
        </div>
        {!isEmpty(followedUsers) ? (
          <div className="grid grid-cols-2 gap-2">
            {followedUsers.map((item) => (
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
            {`< Aucune personne suivie pour le moment >`}
          </p>
        )}
      </div>
    </div>
  );
}
