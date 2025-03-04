import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";

import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UidContext } from "../../context/UidContext";
import { SocketContext } from "../../context/SocketContext";
import { updateAllNotifications } from "../../redux/slices/notificationsSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { isEmpty } from "../../lib/allFunctions";

export default function UserMessage({ user, message, notif, viewed }) {
  const { users } = useSelector((state) => state.users);
  const { isOnline } = useContext(SocketContext);
  const { path, formatDate, apiUrl, userId, profilUrl } =
    useContext(UidContext);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await fetch(`${apiUrl}/notification/${userId}/view-all`).then(
        (res) => res.json()
      );

      if (res?.notifications) {
        dispatch(updateAllNotifications({ notifications: res.notifications }));
      }
    })();
  }, []);

  const url = qs.stringifyUrl(
    {
      url: path,
      query: {
        path: "message",
        user: user._id,
      },
    },
    { skipNull: true }
  );

  const actualUser = users.find((item) =>
    (item._id === message.senderId) !== userId
      ? message.receiverId
      : message.senderId
  );

  if (!isEmpty(actualUser))
    return (
      <Link
        to={url}
        className="relative bg-[var(--bg-primary)] flex rounded-xl p-4 gap-2 min-w-60 cursor-default"
      >
        <div className="w-full flex justify-center items-center gap-2">
          <ProfilImg online={isOnline(user._id)} image={user.image} />
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center gap-2">
              <label className="font-semibold text-[var(--opposite)]">
                {user.name}
              </label>
              <p className="text-xs text-[var(--opposite)] font-semibold">
                {formatDate(message.updatedAt)}
              </p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <label
                className={`text-sm line-clamp-1 text-[var(--opposite)] ${
                  viewed ? "opacity-50 font-light" : "font-semibold"
                }`}
              >
                {message.message}
              </label>

              {notif && (
                <p className="flex justify-center items-center text-xs h-5 w-5 rounded-full bg-[var(--primary-color)] text-[var(--white)] font-semibold">
                  {notif}
                </p>
              )}

              {viewed && (
                <div className={`flex justify-end`}>
                  {isEmpty(actualUser.image) ? (
                    <i className="w-5 h-5 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
                      <FaUser size={"0.7rem"} />
                    </i>
                  ) : (
                    <img
                      src={profilUrl + actualUser.image}
                      className="rounded-full object-cover h-5 w-5"
                      alt=""
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
}
