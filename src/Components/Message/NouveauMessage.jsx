import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";

import { useContext, useEffect, useState } from "react";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { escapeRegExp, isEmpty } from "../../lib/allFunctions";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { UidContext } from "../../context/UidContext";
import { Link } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";

export default function NouveauMessage() {
  const { users } = useSelector((state) => state.users);
  const { isOnline } = useContext(SocketContext);
  const { userId, path, currentQuery } = useContext(UidContext);

  const [collapse, setCollapse] = useState(false);
  const [name, setName] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!isEmpty(name?.trim())) {
      setFilteredUsers(
        users.filter(
          (item) =>
            (item.name.toLowerCase().includes(name.trim().toLowerCase()) ||
              item.email.toLowerCase().includes(name.trim().toLowerCase())) &&
            item._id !== userId
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [name]);

  const highlightText = (text, highlight) => {
    const escapedHighlight = escapeRegExp(highlight);
    const parts = text.split(new RegExp(`(${escapedHighlight})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span
          key={index}
          className="text-sm font-semibold bg-[var(--primary-color)]"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const url = (id) =>
    qs.stringifyUrl(
      {
        url: path,
        query: {
          path: currentQuery.path === "message" ? currentQuery.path : "message",
          user: id,
        },
      },
      { skipNull: true }
    );

  return (
    <div className="bg-[var(--bg-primary)] w-full p-4 rounded-xl flex flex-col items-start gap-4">
      <div className="flex w-full justify-between">
        <div></div>
        <label
          onClick={() => setCollapse((prev) => !prev)}
          className="bg-[var(--primary-color)] rounded-full px-4 py-2 text-[var(--white)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <i>
            <BsFillBookmarkPlusFill size={"1rem"} />
          </i>
          <span className="text-sm select-none">Nouveau</span>
        </label>
      </div>

      {collapse && (
        <div className="flex w-full flex-col gap-6">
          <div className="relative items-center flex-1 flex gap-2">
            <input
              type="text"
              value={name}
              placeholder="Saisir le nom"
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="h-12 w-full bg-[var(--bg-secondary)] rounded-lg focus:outline focus:outline-slate-400 px-10 textarea text-[var(--opposite)] placeholder:text-slate-400 font-light"
            />
            <i className="absolute text-slate-400 left-4">
              <IoSearch size={"1rem"} />
            </i>
          </div>

          {!isEmpty(name?.trim()) && (
            <div className="flex flex-col">
              {!isEmpty(filteredUsers) ? (
                <>
                  {filteredUsers.map((item) => (
                    <Link
                      to={url(item._id)}
                      key={item._id}
                      className={`relative p-2 flex justify-between group border-l-2 hover:border-[var(--primary-color)] hover:bg-[var(--bg-secondary)] transition delay-75 cursor-default brd`}
                    >
                      <div className="w-full flex flex-row gap-3">
                        <ProfilImg
                          online={isOnline(item._id)}
                          image={item.image}
                        />

                        <div className="w-full flex flex-col">
                          <div className="w-full flex justify-between">
                            <p className="text-sm font-semibold text-[var(--opposite)]">
                              {highlightText(item.name, name)}
                            </p>
                          </div>

                          <div className="w-full">
                            <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
                  {`< Aucun utilisateur trouvé >`}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
