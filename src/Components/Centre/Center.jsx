import Postpub from "./Postpub";
import Cardpost from "./Cardpost";

import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { useContext } from "react";
import { UidContext } from "../../context/UidContext";

export default function Center() {
  const { posts } = useSelector((state) => state.posts);
  const { users } = useSelector((state) => state.users);
  const { userId } = useContext(UidContext);

  return (
    <div className="w-full">
      <div />
      <div className="flex flex-col gap-6 rounded-2xl pb-4 mt-6">
        <Postpub />

        {isEmpty(posts) ? (
          <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
            {`< Aucun poste pour le moment >`}
          </p>
        ) : (
          <>
            {posts.map((item) => {
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
            <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
              {`< Fin des postes >`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
