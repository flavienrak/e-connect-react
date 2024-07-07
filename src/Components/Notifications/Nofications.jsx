import SingleNotification from "./SingleNotification";

import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { UidContext } from "../../context/UidContext";
import { updateAllNotifications } from "../../redux/slices/notificationsSlice";

export default function Nofications() {
  const { users } = useSelector((state) => state.users);
  const { notifications } = useSelector((state) => state.notifications);
  const { userId, apiUrl } = useContext(UidContext);

  const dispatch = useDispatch();

  const [prevNotifications, setPrevNotifications] = useState(notifications);

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

  useEffect(() => {
    if (notifications) {
      setPrevNotifications(notifications);
    }
  }, [notifications]);

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Notifications (<span>{notifications.length}</span>)
          </p>
        </div>

        {!isEmpty(prevNotifications) ? (
          <div className="grid grid-cols-2 gap-2">
            {prevNotifications.map((item) => {
              const actualUser = users.find((us) => us._id === item.senderId);

              if (!isEmpty(actualUser))
                return (
                  <div key={item._id}>
                    <SingleNotification user={actualUser} notification={item} />
                  </div>
                );
            })}
          </div>
        ) : (
          <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
            {`< Aucune notification pour le moment >`}
          </p>
        )}
      </div>
    </div>
  );
}
