import { useEffect, useState } from "react";
import { mdiMessageReplyOutline } from "@mdi/js";

import Icon from "@mdi/react";
import Ajouter from "./Ajouter";
import Messageperso from "./Messageperso";
import pdp1 from "../../assets/image/profil2.jpeg";
import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";

const data = [
  {
    id: "1",
    lab: "message1",
    nom: "Tsiaro Andrio",
    message: "Bonjour Bouta",
    pdp: pdp1,
  },
];

export default function Droite() {
  const { user } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.users);

  const [filteredData, setFilteredData] = useState(data);
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

  return (
    <div className="fixed w-full h-full right-[10%] top-20 hidden justify-end pointer-events-none md:flex">
      <div className="flex w-60 flex-col gap-6 pointer-events-auto">
        <div className="flex flex-col gap-3 rounded-2xl bg-[var(--bg-primary)] p-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[var(--opposite)]">Messages</p>
            <Icon path={mdiMessageReplyOutline} size={1} color="grey" />
          </div>

          {filteredData.map((item) => (
            <div key={item.id}>
              <div>
                <Messageperso
                  nom={item.nom}
                  message={item.message}
                  pdp={item.pdp}
                />
              </div>
            </div>
          ))}
        </div>
        {!isEmpty(suggestUsers) && (
          <>
            <h1 className="font-semibold text-[var(--opposite)]">
              Suggestions
            </h1>
            <>
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
            </>
          </>
        )}
      </div>
    </div>
  );
}
