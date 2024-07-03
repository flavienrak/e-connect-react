import { useContext } from "react";
import { UidContext } from "../../context/UidContext";
import { useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";

import Center from "../Centre/Center";
import Droite from "../Droite/Droite";
import Gauche from "../Gauche/Gauche";
import Navbar from "../Navbar/Navbar";
import Profil from "../Profil/Profil";
import Message from "../Message/Message";
import Notifications from "../Notifications/Nofications";
import Setting from "../setting/Setting";
import Postes from "../postes/Postes";
import Suggestions from "../suggestion/Suggestion";
import Abonnees from "../abonnees/Abonnees";
import Suivies from "../suivies/Suivies";
import CreatePost from "../postes/CreatePost";
import ViewProfil from "../Profil/ViewProfil";
import Search from "../search/Search";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  const { currentQuery } = useContext(UidContext);

  if (!isEmpty(user))
    return (
      <>
        <div className="w-full h-full min-h-screen bg-[var(--bg-secondary)]">
          <Navbar />
          <Gauche />
          <Droite />
          <div className="px-[2%] sm:px-[10%] flex flex-col min-h-screen">
            <div className="h-14"></div>
            <div className="flex flex-1 justify-evenly gap-[2%]">
              <div className="w-16 lg:w-60"></div>
              <div className="relative flex-1">
                {!isEmpty(currentQuery?.search?.trim()) &&
                currentQuery?.search?.trim().length > 2 ? (
                  <Search />
                ) : currentQuery?.active === "create-post" ? (
                  <CreatePost />
                ) : currentQuery?.active === "view-profil" &&
                  !isEmpty(currentQuery?.user) ? (
                  <ViewProfil />
                ) : currentQuery?.path === "poste" ? (
                  <Postes />
                ) : currentQuery?.path === "suggestion" ? (
                  <Suggestions />
                ) : currentQuery?.path === "abonnee" ? (
                  <Abonnees />
                ) : currentQuery?.path === "suivie" ? (
                  <Suivies />
                ) : currentQuery?.path === "profil" ? (
                  <Profil />
                ) : currentQuery?.path === "message" ? (
                  <Message />
                ) : currentQuery?.path === "notification" ? (
                  <Notifications />
                ) : currentQuery?.path === "setting" ? (
                  <Setting />
                ) : (
                  <Center />
                )}
              </div>
              <div className="hidden md:block md:w-60"></div>
            </div>
          </div>
        </div>
      </>
    );
}
