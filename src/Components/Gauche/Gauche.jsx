import qs from "query-string";

import { useContext, useEffect, useState } from "react";
import { TbHome2, TbMessage, TbNewSection } from "react-icons/tb";
import { LuBell, LuSettings } from "react-icons/lu";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { UidContext } from "../../context/UidContext";
import { BsPostcard } from "react-icons/bs";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { PiShareNetwork } from "react-icons/pi";
import { isEmpty } from "../../lib/allFunctions";

const menuItems = [
  { label: "Accueil", path: "accueil", icon: <TbHome2 size={"1.5rem"} /> },
  { label: "Messages", path: "message", icon: <TbMessage size={"1.5rem"} /> },
  { label: "Postes", path: "poste", icon: <BsPostcard size={"1.5rem"} /> },
  {
    label: "Suggestions",
    path: "suggestion",
    icon: <HiOutlineUserGroup size={"1.5rem"} />,
  },
  {
    label: "Suivies",
    path: "suivie",
    icon: <FaRegHeart size={"1.5rem"} />,
  },
  {
    label: "Abonnees",
    path: "abonnee",
    icon: <PiShareNetwork size={"1.5rem"} />,
  },
  {
    label: "Notifications",
    path: "notification",
    icon: <LuBell size={"1.5rem"} />,
  },
  {
    label: "Profil",
    path: "profil",
    icon: <AiOutlineUser size={"1.5rem"} />,
  },
  {
    label: "Parametres",
    path: "setting",
    icon: <LuSettings size={"1.5rem"} />,
  },
];

export default function Gauche() {
  const { currentQuery, path, profilImg } = useContext(UidContext);
  const { user } = useSelector((state) => state.user);

  const [actualLink, setActualLink] = useState(
    "/home?path=accueil&active=create-post"
  );

  useEffect(() => {
    if (currentQuery?.path) {
      const url = qs.stringifyUrl(
        {
          url: path,
          query: {
            path: currentQuery.path,
            active: "create-post",
          },
        },
        { skipNull: true }
      );
      setActualLink(url);
    }
  }, [currentQuery?.path]);

  return (
    <>
      <div className="fixed w-full h-full left-[2%] sm:left-[10%] top-20 pointer-events-none">
        <div className="flex w-16 flex-col gap-6  pointer-events-auto lg:w-60">
          <div className="flex gap-4 rounded-lg bg-[var(--bg-primary)] h-14 items-center px-2 justify-center lg:px-4 lg:justify-start">
            {isEmpty(user.image) ? (
              <>
                <i className="w-10 h-10 min-w-10 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
                  <FaUser size={"1rem"} />
                </i>
              </>
            ) : (
              <img
                src={profilImg + user.image}
                alt="Profile"
                className="rounded-full h-10 w-10 min-w-10 object-cover"
              />
            )}
            <div className="overflow-hidden hidden lg:block">
              <div className="font-semibold text-[var(--opposite)]">
                {user.name}
              </div>
              <p className="text-xs text-[var(--opposite)] whitespace-nowrap text-ellipsis">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col overflow-hidden rounded-xl bg-[var(--bg-primary)]">
            <div className="flex w-full flex-col items-center justify-center gap-1 ">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={`/home?path=${item.path}`}
                  className={`relative flex w-full gap-4 cursor-pointer border-l-4 h-12 items-center px-4 
                    ${
                      currentQuery?.path === item.path
                        ? "border-[var(--primary-color)] bg-[var(--bg-secondary)] text-[var(--primary-color)]"
                        : "hover:text-[var(--primary-color)] border-transparent text-[var(--opposite)]"
                    }
                    `}
                >
                  <i className="w-9">{item.icon}</i>
                  <p className="font-semibold w-max hidden lg:block">
                    {item.label}
                  </p>
                  {/* <div className="absolute left-7 top-2 border-2 border-[var(--white)] flex size-5 items-center justify-center rounded-full bg-[var(--red-color)] font-bold text-[var(--white-color)]">
                    <p className="text-xs flex justify-center items-center">
                      1
                    </p>
                  </div> */}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to={actualLink}
            className="w-full flex justify-center items-center rounded-3xl bg-[var(--primary-color)] px-4 h-11 font-semibold text-[var(--white)] hover:opacity-80"
          >
            <i className="lg:hidden">
              <TbNewSection size={"1.5rem"} />
            </i>
            <p className="hidden lg:block">Creer un post</p>
          </Link>
        </div>
      </div>
    </>
  );
}
