import SingleProfil from "./SingleProfil";
import Cardpost from "../Centre/Cardpost";
import Ajouter from "../Droite/Ajouter";
import EditProfil from "./EditProfil";

import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { UidContext } from "../../context/UidContext";

export default function Profil() {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const { users } = useSelector((state) => state.users);
  const { userId } = useContext(UidContext);

  const [items, setItems] = useState([
    {
      label: "Publication",
      active: "publications",
      number: 0,
    },
    {
      label: "Abonnement",
      active: "abonnements",
      number: 0,
    },
    {
      label: "Abonnee",
      active: "abonnees",
      number: 0,
    },
  ]);

  const [active, setActive] = useState(items[0].active);

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Mon profil
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <SingleProfil
            user={user}
            items={items}
            active={active}
            setActive={setActive}
            setItems={setItems}
          />
          <EditProfil />

          {!isEmpty(user?.posts) && active === items[0].active && (
            <>
              {user.posts.map((item) => {
                const actualPost = posts.find((p) => p._id === item);
                const actualUser = users.find(
                  (us) => us._id === actualPost.senderId
                );

                if (!isEmpty(actualUser) && !isEmpty(actualPost))
                  return (
                    <div key={item} className="w-full h-full">
                      <Cardpost
                        isOwn={actualUser._id === userId}
                        sender={actualUser}
                        post={actualPost}
                      />
                    </div>
                  );
              })}
            </>
          )}

          {!isEmpty(user?.followed) && active === items[1].active && (
            <>
              {user.followed.map((item) => {
                const actualUser = users.find((us) => us._id === item);
                if (!isEmpty(actualUser))
                  return (
                    <div
                      key={item._id}
                      className="w-full grid grid-cols-2 gap-2"
                    >
                      <Ajouter
                        user={actualUser}
                        isFollowed={user.followed.includes(actualUser._id)}
                      />
                    </div>
                  );
              })}
            </>
          )}

          {!isEmpty(user?.followers) && active === items[2].active && (
            <>
              {user.followers.map((item) => {
                const actualUser = users.find((us) => us._id === item);
                if (!isEmpty(actualUser))
                  return (
                    <div
                      key={item._id}
                      className="w-full grid grid-cols-2 gap-2"
                    >
                      <Ajouter
                        user={actualUser}
                        isFollowed={user.followed.includes(item._id)}
                      />
                    </div>
                  );
              })}
            </>
          )}
          <br />
        </div>
      </div>
    </div>
  );
}
