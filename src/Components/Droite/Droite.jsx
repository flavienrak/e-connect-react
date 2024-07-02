import { useState } from "react";
import { mdiMessageReplyOutline } from "@mdi/js";

import Icon from "@mdi/react";
import Ajouter from "./Ajouter";
import Messageperso from "./Messageperso";
import pdp1 from "../../assets/image/profil2.jpeg";

const data = [
  {
    id: "1",
    lab: "message1",
    nom: "Tsiaro Andrio",
    message: "Bonjour Bouta",
    pdp: pdp1,
  },
];

const Droite = () => {
  const [filteredData, setFilteredData] = useState(data);

  return (
    <div className="fixed w-full h-full right-48 top-20 flex justify-end pointer-events-none">
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
        <h1 className="font-semibold text-[var(--opposite)]">Suggestions</h1>
        <div className="flex h-72 w-full flex-col gap-2 rounded-xl">
          <Ajouter pdp={pdp1} pseudo="Melander" />
          <Ajouter pdp={pdp1} pseudo="Melander" />
        </div>
      </div>
    </div>
  );
};

export default Droite;
