import Postpub from "./Postpub";
import Cardpost from "./Cardpost";
import PostLoader from "../postes/PostLoader";

import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { useContext, useEffect, useState } from "react";
import { UidContext } from "../../context/UidContext";

export default function Center() {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const { users } = useSelector((state) => state.users);
  const { userId, loadPost } = useContext(UidContext);

  const loaderCount = 2;
  const loaders = Array.from({ length: loaderCount });

  const [isReady, setIsReady] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (!isEmpty(posts)) {
      setUserPosts(
        posts.filter((item) => !user.rejectedPost.includes(item._id))
      );
    }
  }, [posts, user?.rejectedPost]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loadPost]);

  return (
    <div className="w-full">
      <div />
      <div className="flex flex-col gap-6 rounded-2xl pb-4 mt-6">
        <Postpub />

        {loadPost || !isReady ? (
          <div className="flex flex-col gap-6">
            {loaders.map((_, index) => (
              <div key={index} className="w-full">
                <PostLoader index={index} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {isEmpty(userPosts) ? (
              <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
                {`< Aucun poste pour le moment >`}
              </p>
            ) : (
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
                <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
                  {`< Fin des postes >`}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
