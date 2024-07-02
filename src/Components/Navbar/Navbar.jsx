import { IoMdLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { updatePersistInfos } from "../../redux/slices/persistSlice";
import { useContext } from "react";
import { UidContext } from "../../context/UidContext";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";

export default function Navbar() {
  const dispatch = useDispatch();
  const { showLogout, loginOut, mode } = useContext(UidContext);

  const handleLogout = () => {
    dispatch(updatePersistInfos({ authToken: null }));
    window.location = "/login";
  };

  return (
    <>
      <div className="fixed z-10 w-full bg-[var(--bg-primary)] px-48 py-2">
        <div className="flex w-full h-full">
          <h1 className="w-1/5 flex items-center gap-2">
            <p className="flex justify-center items-center bg-[var(--primary-color)] font-extrabold h-10 w-12 rounded-3xl text-[var(--white)] text-4xl pb-1">
              e
            </p>
            <span className="font-bold text-2xl text-[var(--primary-color)]">
              Connect
            </span>
          </h1>
          <div className="flex w-3/5 items-center justify-center px-10">
            <div className="flex w-full relative items-center">
              <i className="text-[var(--white)] absolute right-0 bg-[var(--primary-color)] flex h-10 justify-center items-center w-12 rounded-3xl">
                <IoSearch size={"1.35rem"} />
              </i>
              <input
                className={`w-full pl-7 pr-4 py-1 rounded-full border border-slate-200 bg-[var(--bg-secondary)] text-slate-500 h-10 outline-none input`}
                type="text"
                id="search"
                placeholder="Rechercher..."
              />
            </div>
          </div>
          <div className="flex w-1/5 justify-end gap-4">
            <button
              onClick={() => loginOut(true)}
              className="flex justify-center items-center rounded-3xl bg-[var(--primary-color)] h-10 w-12 font-semibold text-[var(--white)] hover:opacity-80"
            >
              <i>
                <IoMdLogOut size={"1.35rem"} />
              </i>
            </button>
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center pointer-events-none bgTrans z-10">
          <motion.div
            initial={{ y: -15 }}
            animate={{ y: 0 }}
            className="bg-[var(--white)] p-4 rounded-xl max-w-72 flex flex-col gap-2 pointer-events-auto"
          >
            <p className="text-center font-semibold">
              Voulez-vous vraiement vous deconnecter ?
            </p>
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => loginOut(false)}
                className="bg-slate-200 text-slate-500 px-4 py-1 rounded-full w-1/2"
              >
                Non
              </button>
              <button
                onClick={handleLogout}
                className="bg-[var(--primary-color)] text-[var(--white)] px-4 py-1 rounded-full w-1/2"
              >
                Oui
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
