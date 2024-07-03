import Ajouter from "../Droite/Ajouter";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";

export default function Suggestions() {
  const { user } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.users);

  const [suggestUsers, setSuggestUsers] = useState([]);

  useEffect(() => {
    if (users) {
      setSuggestUsers(
        users.filter(
          (item) =>
            item._id !== user._id &&
            !user.followed.includes(item._id) &&
            !user.rejected.includes(item._id)
        )
      );
    }
  }, [users, user?.rejected]);

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Suggestions
          </p>
        </div>
        {!isEmpty(suggestUsers) ? (
          <>
            {suggestUsers.map((item) => (
              <div key={item._id} className="w-full grid grid-cols-2 gap-2">
                <Ajouter
                  user={item}
                  isFollowed={user.followed.includes(item._id)}
                />
              </div>
            ))}
          </>
        ) : (
          <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
            {`< Aucune suggestion pour le moment >`}
          </p>
        )}
      </div>
    </div>
  );
}
