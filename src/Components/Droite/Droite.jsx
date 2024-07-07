import qs from "query-string";
import Ajouter from "./Ajouter";
import Messageperso from "./Messageperso";

import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { UidContext } from "../../context/UidContext";

export default function Droite() {
  const { user } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.users);
  const { messages } = useSelector((state) => state.messages);
  const { path, userId } = useContext(UidContext);

  const [suggestUsers, setSuggestUsers] = useState([]);

  useEffect(() => {
    if (users) {
      setSuggestUsers(
        users.filter(
          (item) => item._id !== user._id && !user.followed.includes(item._id)
        )
      );
    }
  }, [users]);

  useEffect(() => {
    if (!isEmpty(suggestUsers)) {
      setSuggestUsers((prev) => prev.sort(() => 0.5 - Math.random()));
    }
  }, [suggestUsers]);

  const url = (id) =>
    qs.stringifyUrl(
      {
        url: path,
        query: {
          path: "message",
          user: id,
        },
      },
      { skipNull: true }
    );

  return (
    <div className="fixed w-full h-full right-[10%] top-20 hidden justify-end pointer-events-none lg:flex">
      <div className="flex w-60 flex-col gap-6 pointer-events-auto">
        {!isEmpty(messages) && (
          <div className="flex flex-col rounded-2xl bg-[var(--bg-primary)]">
            <div className="flex items-center justify-between p-4">
              <p className="font-bold text-[var(--opposite)]">Messages</p>
              <i className="text-[var(--opposite)]">
                <FiMessageSquare size={"1.5rem"} />
              </i>
            </div>

            {messages.map((item, index) => {
              const actualUser = users.find((us) => us._id === item.userId);
              const actualMessages = item.messages;

              const notif = actualMessages.filter(
                (item) =>
                  item.senderId === actualUser?._id &&
                  item.receiverId === userId &&
                  item.viewed === false
              )?.length;

              const viewed =
                (actualMessages?.every((item) => item.viewed === true) &&
                  actualMessages[actualMessages.length - 1]?.senderId ===
                    actualUser?._id) ||
                actualMessages[actualMessages.length - 1]?.senderId === userId;

              if (!isEmpty(actualUser) && !isEmpty(actualMessages) && index < 3)
                return (
                  <Link
                    to={url(actualUser._id)}
                    key={actualUser._id}
                    className="w-full flex flex-col gap-4 cursor-pointer hover:bg-[var(--bg-secondary)] px-4 py-4"
                  >
                    <Messageperso
                      message={actualMessages[actualMessages.length - 1]}
                      user={actualUser}
                      notif={notif > 0 ? notif : null}
                      viewed={viewed}
                    />
                  </Link>
                );
            })}
          </div>
        )}

        {!isEmpty(suggestUsers) && (
          <>
            <h1 className="font-semibold text-[var(--opposite)] px-1">
              Suggestions
            </h1>
            <div className="flex flex-col gap-2">
              {suggestUsers.map(
                (item, index) =>
                  index < 3 && (
                    <div key={item._id} className="w-full">
                      <Ajouter
                        user={item}
                        isFollowed={user.followed.includes(item._id)}
                      />
                    </div>
                  )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
