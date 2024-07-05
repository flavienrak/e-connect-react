import Ajouter from "../Droite/Ajouter";
import Cardpost from "../Centre/Cardpost";
import ProfilMenu from "../Profil/ProfilMenu";

import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { UidContext } from "../../context/UidContext";

export default function Search() {
  const { posts } = useSelector((state) => state.posts);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);
  const { apiUrl, userId, currentQuery } = useContext(UidContext);

  const [noResults, setNoResults] = useState(false);
  const [userResult, setUserResult] = useState([]);
  const [postResult, setPostResult] = useState([]);
  const [messageResult, setMessageResult] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [items, setItems] = useState([
    {
      label: "Post",
      active: "posts",
      number: 0,
    },
    {
      label: "Utilisateur",
      active: "users",
      number: 0,
    },
    {
      label: "Message",
      active: "messages",
      number: 0,
    },
  ]);

  const [active, setActive] = useState(items[0].active);

  useEffect(() => {
    if (
      !isEmpty(currentQuery?.search) &&
      currentQuery?.search?.trim().length > 2
    ) {
      (async () => {
        const res = await fetch(`${apiUrl}/user/${userId}/search`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ key: currentQuery.search.trim() }),
        }).then((res) => res.json());

        if (res?.results) {
          setUserResult(res.results.users);
          setPostResult(res.results.posts);
          setMessageResult(res.results.messages);

          const hasResults =
            res.results.users.length > 0 ||
            res.results.posts.length > 0 ||
            res.results.messages.length > 0;

          setNoResults(!hasResults);
        }
      })();
    }
  }, [currentQuery?.search]);

  useEffect(() => {
    if (!isEmpty(posts) && !isEmpty(postResult)) {
      const postIds = postResult.map((item) => item._id);
      setUserPosts(posts.filter((item) => postIds.includes(item._id)));
    }
  }, [posts, postResult]);

  useEffect(() => {
    if (!isEmpty(postResult)) {
      if (active !== items[0].active) {
        setActive(items[0].active);
      }
    } else if (!isEmpty(userResult)) {
      if (active !== items[1].active) {
        setActive(items[1].active);
      }
    } else if (!isEmpty(messageResult)) {
      if (active !== items[2].active) {
        setActive(items[2].active);
      }
    }

    setItems((prev) => {
      let newState = [...prev];

      newState = newState.map((item) => {
        if (item.active === items[0].active) {
          return { ...item, number: postResult.length };
        }
        if (item.active === items[1].active) {
          return { ...item, number: userResult.length };
        }
        if (item.active === items[2].active) {
          return { ...item, number: messageResult.length };
        }
        return item;
      });

      return newState;
    });
  }, [userResult, postResult, messageResult]);

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Résultats ({currentQuery.search})
          </p>
        </div>

        {!noResults ? (
          <>
            <div className="flex items-center gap-4 pl-12 bg-[var(--bg-primary)] p-4 rounded-xl">
              <ProfilMenu
                isOwn={true}
                userId={user._id}
                items={items}
                active={active}
                setActive={setActive}
              />
            </div>

            {!isEmpty(postResult) && active === items[0].active && (
              <>
                {userPosts.map((item) => {
                  const actualUser = users.find(
                    (us) => us._id === item.senderId
                  );

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
              </>
            )}

            {!isEmpty(userResult) && active === items[1].active && (
              <>
                <div className="w-full grid grid-cols-2 gap-2">
                  {userResult.map((item) => (
                    <div key={item._id} className="w-full">
                      <Ajouter
                        user={item}
                        isFollowed={user.followed.includes(item._id)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {!isEmpty(messageResult) && active === items[2].active && (
              <>Messages</>
            )}
            <br />
          </>
        ) : (
          <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
            {`< Aucun résultat trouvé >`}
          </p>
        )}
      </div>
    </div>
  );
}
