import pdp from "../../assets/image/vola.png";

import { useContext } from "react";
import { TbHome2, TbMessage } from "react-icons/tb";
import { LuBell, LuSettings } from "react-icons/lu";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { UidContext } from "../../context/UidContext";
import { BsPostcard } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";

const menuItems = [
  { label: "Accueil", path: "accueil", icon: <TbHome2 size={"1.5rem"} /> },
  { label: "Messages", path: "message", icon: <TbMessage size={"1.5rem"} /> },
  { label: "Postes", path: "poste", icon: <BsPostcard size={"1.5rem"} /> },
  {
    label: "Abonnees",
    path: "abonnee",
    icon: <HiOutlineUserGroup size={"1.5rem"} />,
  },
  {
    label: "Suivies",
    path: "suivie",
    icon: <FaRegHeart size={"1.5rem"} />,
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
  const { currentQuery } = useContext(UidContext);
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <div className="fixed w-full h-full left-48 top-20 pointer-events-none">
        <div className="flex w-60 flex-col gap-6  pointer-events-auto">
          <div className="md:hidden lg:flex flex gap-4 rounded-lg bg-[var(--bg-primary)] h-14 items-center px-4">
            <img src={pdp} alt="Profile" className="rounded-full h-9 w-9" />
            <div className="overflow-hidden">
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
                  <p className="font-semibold w-max">{item.label}</p>
                  {/* <div className="absolute left-7 top-2 border-2 border-[var(--white)] flex size-5 items-center justify-center rounded-full bg-[var(--red-color)] font-bold text-[var(--white-color)]">
                    <p className="text-xs flex justify-center items-center">
                      1
                    </p>
                  </div> */}
                </Link>
              ))}
            </div>
          </div>
          <button className="w-full rounded-3xl bg-[var(--primary-color)] px-4 h-11 font-semibold text-[var(--white)] hover:opacity-80">
            Creer un post
          </button>
        </div>
      </div>
    </>
  );
}
