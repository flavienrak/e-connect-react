import ProfilImg from "../Profil/ProfilImg";
import qs from "query-string";

import { useContext } from "react";
import { UidContext } from "../../context/UidContext";
import { SocketContext } from "../../context/SocketContext";
import { isEmpty } from "../../lib/allFunctions";
import { Link } from "react-router-dom";

export default function SingleNotification({ user, notification }) {
  const { isOnline } = useContext(SocketContext);
  const { formatDate, path } = useContext(UidContext);

  const message = () => {
    if (notification.liked) {
      return "A réagi à votre post";
    } else if (notification.commented) {
      return "A commenté votre post";
    } else if (notification.followed) {
      return "S'est abonnée";
    } else if (notification.newPostFollowed) {
      return "A publié un nouveau post";
    }
  };

  const url = () => {
    const actualPath =
      notification.newPost || notification.liked || notification.commented
        ? "post"
        : notification.followed
        ? "profil"
        : "accueil";

    const postId = !isEmpty(notification.postId) ? notification.postId : null;
    const userId = notification.followed ? notification.userId : null;

    return qs.stringifyUrl(
      {
        url: path,
        query: {
          path: actualPath,
          ...(!isEmpty(postId) && { post: postId }),
          ...(!isEmpty(userId) && { user: userId, active: "view-profil" }),
        },
      },
      { skipNull: true }
    );
  };

  return (
    <Link
      to={url()}
      className="relative bg-[var(--bg-primary)] flex rounded-xl p-4 gap-2 items-center cursor-default"
    >
      <div className="flex justify-center items-center gap-2">
        <ProfilImg online={isOnline(user._id)} image={user.image} />
        <div className="flex items-center min-h-full">
          <p className="pr-10 flex justify-center flex-col">
            <span className="font-semibold text-[var(--opposite)]">
              {user.name}
            </span>
            <span className="text-sm line-clamp-1 text-[var(--opposite)] opacity-80 font-light">
              {message()}
            </span>
          </p>
        </div>
      </div>
      <p className="text-xs text-[var(--opposite)] font-semibold absolute top-5 right-5">
        {formatDate(notification.createdAt)}
      </p>
    </Link>
  );
}
