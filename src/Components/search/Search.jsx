import Ajouter from "../Droite/Ajouter";
import Cardpost from "../Centre/Cardpost";
import ProfilMenu from "../Profil/ProfilMenu";

import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { UidContext } from "../../context/UidContext";

export default function Search() {
  const { user } = useSelector((state) => state.user);
  const { apiUrl, userId, currentQuery } = useContext(UidContext);

  const [noResults, setNoResults] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);

  const [items, setItems] = useState([
    {
      label: "Utilisateur",
      active: "users",
      number: 0,
    },
    {
      label: "Post",
      active: "posts",
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
          setUsers(res.results.users || []);
          setPosts(res.results.posts || []);
          setMessages(res.results.messages || []);

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
    if (!isEmpty(users || !isEmpty(posts) || !isEmpty(messages))) {
      setItems((prev) => {
        let newState = [...prev];

        if (!isEmpty(users)) {
          newState.forEach((item, index) => {
            if (item.active === items[0].active) {
              newState[index] = {
                ...newState[index],
                number: users.length,
              };
            }
          });
        }
        if (!isEmpty(posts)) {
          newState.forEach((item, index) => {
            if (item.active === items[1].active) {
              newState[index] = {
                ...newState[index],
                number: posts.length,
              };
            }
          });
        }
        if (!isEmpty(messages)) {
          newState.forEach((item, index) => {
            if (item.active === items[2].active) {
              newState[index] = {
                ...newState[index],
                number: messages.length,
              };
            }
          });
        }

        return newState;
      });
    }
  }, [users, posts, messages]);

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
              <ProfilMenu items={items} active={active} setActive={setActive} />
            </div>

            {!isEmpty(users) && active === items[0].active && (
              <>
                {users.map((item) => (
                  <div key={item._id} className="w-full grid grid-cols-2 gap-2">
                    <Ajouter
                      user={item}
                      isFollowed={user.followed.includes(item._id)}
                    />
                  </div>
                ))}
              </>
            )}

            {!isEmpty(posts) && active === items[1].active && (
              <>
                {posts.map((item) => {
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

            {!isEmpty(messages) && active === items[2].active && <>Messages</>}
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
