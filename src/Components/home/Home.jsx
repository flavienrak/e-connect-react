import { useContext } from "react";
import { UidContext } from "../../context/UidContext";

import Center from "../Centre/Center";
import Droite from "../Droite/Droite";
import Gauche from "../Gauche/Gauche";
import Navbar from "../Navbar/Navbar";
import Profil from "../Profil/Profil";
import Message from "../Message/Message";
import Notifications from "../Notifications/Nofications";
import Setting from "../setting/Setting";

export default function Home() {
  const { currentQuery } = useContext(UidContext);

  return (
    <>
      <div className="w-full h-full min-h-screen bg-[var(--bg-secondary)]">
        <Navbar />
        <Gauche />
        <Droite />
        <div className="px-24 flex flex-col min-h-screen">
          <div className="h-14"></div>
          <div className="flex flex-1">
            <div className="w-1/4"></div>
            <div className="relative flex-1 px-8">
              {currentQuery?.path === "profil" ? (
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
            <div className="w-1/4"></div>
          </div>
        </div>
      </div>
    </>
  );
}
