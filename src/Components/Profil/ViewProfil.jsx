import SingleProfil from "./SingleProfil";
import Ajouter from "../Droite/Ajouter";
import Cardpost from "../Centre/Cardpost";

import { useContext, useEffect, useState } from "react";
import { UidContext } from "../../context/UidContext";
import { isEmpty } from "../../lib/allFunctions";
import { useSelector } from "react-redux";

export default function ViewProfil() {
  const { currentQuery, apiUrl, userId } = useContext(UidContext);
  const { users } = useSelector((state) => state.users);
  const { posts } = useSelector((state) => state.posts);

  const [user, setUser] = useState(null);

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

  useEffect(() => {
    if (currentQuery?.user) {
      (async () => {
        const res = await fetch(
          `${apiUrl}/user/${userId}/${currentQuery.user}/view-profil`
        ).then((res) => res.json());

        console.log(res);

        if (res?.user) {
          setUser(res.user);
        }
      })();
    }
  }, [currentQuery?.user]);

  console.log(user);

  if (!isEmpty(user))
    return (
      <div className="mt-6 w-full">
        <div />
        <div className="flex flex-col gap-6">
          <SingleProfil
            user={user}
            items={items}
            active={active}
            setActive={setActive}
            setItems={setItems}
          />

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
                    <div key={item} className="w-full grid grid-cols-2 gap-2">
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
                    <div key={item} className="w-full grid grid-cols-2 gap-2">
                      <Ajouter
                        user={actualUser}
                        isFollowed={user.followed.includes(actualUser._id)}
                      />
                    </div>
                  );
              })}
            </>
          )}
          <br />
        </div>
      </div>
    );
}
