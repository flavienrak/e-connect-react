import qs from "query-string";
import ProfilImg from "../Profil/ProfilImg";

import { useContext, useEffect, useState } from "react";
import { TbHome2, TbNewSection } from "react-icons/tb";
import { LuHeart, LuSettings } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { UidContext } from "../../context/UidContext";
import { HiOutlineUserGroup, HiOutlineWindow } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { PiShareNetwork } from "react-icons/pi";
import { isEmpty } from "../../lib/allFunctions";
import { FiMessageSquare } from "react-icons/fi";
import { SlBell } from "react-icons/sl";

export default function Gauche() {
  const { user } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notifications);
  const { currentQuery, path, refetchPost } = useContext(UidContext);

  const push = useNavigate();

  const [actualLink, setActualLink] = useState(
    qs.stringifyUrl(
      {
        url: path,
        query: {
          path: currentQuery.path,
          active: "create-post",
        },
      },
      { skipNull: true }
    )
  );

  const [menuItems, setMenuItems] = useState([
    {
      label: "Accueil",
      path: "accueil",
      icon: <TbHome2 size={"1.5rem"} />,
      notified: true,
      number: 0,
    },
    {
      label: "Messages",
      path: "message",
      icon: <FiMessageSquare size={"1.5rem"} />,
      notified: true,
      number: 0,
    },
    {
      label: "Postes",
      path: "poste",
      icon: <HiOutlineWindow size={"1.5rem"} />,
      notified: false,
    },
    {
      label: "Suivies",
      path: "suivie",
      icon: <LuHeart size={"1.35rem"} />,
      notified: false,
    },
    {
      label: "Notifications",
      path: "notification",
      icon: <SlBell size={"1.4rem"} />,
      notified: true,
      number: 0,
    },
    {
      label: "Abonnées",
      path: "abonnee",
      icon: <PiShareNetwork size={"1.5rem"} />,
      notified: false,
    },
    {
      label: "Suggestions",
      path: "suggestion",
      icon: <HiOutlineUserGroup size={"1.5rem"} />,
      notified: false,
    },
    {
      label: "Profil",
      path: "profil",
      icon: <AiOutlineUser size={"1.5rem"} />,
      notified: false,
    },
    {
      label: "Paramètres",
      path: "setting",
      icon: <LuSettings size={"1.5rem"} />,
      notified: false,
    },
  ]);

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
    } else {
      push(
        qs.stringifyUrl(
          {
            url: path,
            query: {
              path: "accueil",
            },
          },
          { skipNull: true }
        )
      );
    }
  }, [currentQuery?.path]);

  useEffect(() => {
    if (notifications) {
      setMenuItems((prev) => {
        let newState = [...prev];

        newState.forEach((item) => {
          if (item.notified) {
            if (item.path === prev[0].path) {
              item.number =
                notifications.filter((notif) => !notif.viewed && notif.newPost)
                  .length +
                notifications.filter((notif) => !notif.viewed && notif.editPost)
                  .length;
            } else if (item.path === prev[1].path) {
              item.number = notifications.filter(
                (notif) => !notif.viewed && notif.newMessage
              ).length;
            } else if (item.path === prev[4].path) {
              item.number =
                notifications.filter((notif) => !notif.viewed && notif.liked)
                  .length +
                notifications.filter(
                  (notif) => !notif.viewed && notif.commented
                ).length +
                notifications.filter((notif) => !notif.viewed && notif.followed)
                  .length +
                notifications.filter(
                  (notif) => !notif.viewed && notif.newPostFollowed
                ).length;
            }
          }
        });

        return newState;
      });
    }
  }, [notifications]);

  const url = (actualPath) =>
    qs.stringifyUrl(
      {
        url: path,
        query: {
          path: actualPath,
        },
      },
      { skipNull: true }
    );

  return (
    <>
      <div className="fixed w-full h-full left-[2%] sm:left-[10%] top-20 pointer-events-none">
        <div className="flex w-16 flex-col gap-6  pointer-events-auto lg:w-60">
          <Link
            to={url("profil")}
            className="flex gap-4 rounded-lg bg-[var(--bg-primary)] h-14 items-center px-2 justify-center lg:px-4 lg:justify-start"
          >
            <ProfilImg online={true} image={user.image} />
            <div className="overflow-hidden hidden lg:block">
              <div className="font-semibold text-[var(--opposite)]">
                {user.name}
              </div>
              <p className="text-xs text-[var(--opposite)] whitespace-nowrap text-ellipsis">
                {user.email}
              </p>
            </div>
          </Link>

          <div className="flex w-full flex-col overflow-hidden rounded-xl bg-[var(--bg-primary)]">
            <div className="flex w-full flex-col items-center justify-center gap-1 ">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={url(item.path)}
                  onClick={() => {
                    if (item.path === menuItems[0].path) {
                      refetchPost(true);
                    }
                  }}
                  className={`relative flex w-full gap-4 cursor-pointer border-l-4 h-12 items-center px-4 
                    ${
                      currentQuery?.path === item.path ||
                      (item.path === menuItems[0].path &&
                        isEmpty(currentQuery?.path))
                        ? "border-[var(--primary-color)] bg-[var(--bg-secondary)] text-[var(--primary-color)]"
                        : "hover:text-[var(--primary-color)] border-transparent text-[var(--opposite)]"
                    }
                    `}
                >
                  <i className="w-9">{item.icon}</i>
                  <p className="font-semibold w-max hidden lg:block">
                    {item.label}
                  </p>

                  {item.notified && item?.number !== 0 && (
                    <div
                      className={`absolute left-7 top-2 border-2 flex size-5 items-center justify-center rounded-full bg-[var(--red)] font-bold text-[var(--white-color)] ${
                        currentQuery?.path === item.path ||
                        (item.path === menuItems[0].path &&
                          isEmpty(currentQuery?.path))
                          ? "border-[var(--bg-secondary)]"
                          : "border-[var(--bg-primary)]"
                      }`}
                    >
                      <p className="text-xs flex justify-center items-center">
                        {item.number}
                      </p>
                    </div>
                  )}
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
