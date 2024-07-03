import Cardpost from "../Centre/Cardpost";

import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { useContext, useEffect, useState } from "react";
import { UidContext } from "../../context/UidContext";

export default function Postes() {
  const { posts } = useSelector((state) => state.posts);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);
  const { userId } = useContext(UidContext);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (!isEmpty(posts)) {
      setUserPosts(posts.filter((item) => item.senderId === user._id));
    }
  }, [posts]);

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6 rounded-2xl pb-4">
        {isEmpty(userPosts) ? (
          <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
            {`< Vous n'avez aucun poste pour le moment >`}
          </p>
        ) : (
          <>
            <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
              <p className="text-[var(--primary-color)] font-semibold text-lg">
                Mes posts (<span>{userPosts.length}</span>)
              </p>
            </div>
            {userPosts.map((item) => {
              const actualUser = users.find((us) => us._id === item.senderId);

              if (!isEmpty(actualUser))
                return (
                  <div key={item._id} className="w-full h-full">
                    <Cardpost
                      isOwn={actualUser._id === userId}
                      sender={actualUser}
                      post={item}
                    />
                  </div>
                );
            })}
            <div />
          </>
        )}
      </div>
    </div>
  );
}
