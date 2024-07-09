import ProfilImg from "../Profil/ProfilImg";

import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { UidContext } from "../../context/UidContext";
import { FaUser } from "react-icons/fa";
import { isEmpty } from "../../lib/allFunctions";
import { useSelector } from "react-redux";

export default function Messageperso({ user, message, notif, viewed }) {
  const { users } = useSelector((state) => state.users);
  const { isOnline } = useContext(SocketContext);
  const { formatDate, profilUrl, userId } = useContext(UidContext);

  const actualUser = users.find((item) =>
    (item._id === message.senderId) !== userId
      ? message.receiverId
      : message.senderId
  );

  if (!isEmpty(actualUser))
    return (
      <>
        <div className="flex cursor-pointer flex-row gap-3">
          <ProfilImg online={isOnline(user._id)} image={user.image} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center gap-2">
              <label className="font-semibold text-[var(--opposite)] whitespace-nowrap overflow-hidden text-ellipsis">
                {user.name}
              </label>
              <p className="text-xs text-[var(--opposite)] font-semibold whitespace-nowrap">
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
      </>
    );
}
