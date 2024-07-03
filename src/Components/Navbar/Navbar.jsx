import toast from "react-hot-toast";
import qs from "query-string";

import { IoMdLogOut } from "react-icons/io";
import { useDispatch } from "react-redux";
import { updatePersistInfos } from "../../redux/slices/persistSlice";
import { useContext, useEffect, useState } from "react";
import { UidContext } from "../../context/UidContext";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import { isEmpty } from "../../lib/allFunctions";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const push = useNavigate();

  const { showLogout, loginOut, toastStyle, path, currentQuery } =
    useContext(UidContext);

  const [searchKey, setSearchKey] = useState({ value: "", valid: false });
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (isSubmit) {
      setIsSubmit(false);
    }

    if (
      !isEmpty(searchKey.value?.trim()) &&
      searchKey.value?.trim().length > 2
    ) {
      if (!searchKey.valid) {
        setSearchKey((prev) => ({ ...prev, valid: true }));
      }
    } else {
      if (searchKey.valid) {
        setSearchKey((prev) => ({ ...prev, valid: false }));
      }
    }
  }, [searchKey.value]);

  useEffect(() => {
    if (isSubmit && !searchKey.valid) {
      toast.error("Inferieures a 3 caracteres", toastStyle);
    }
  }, [isSubmit]);

  const handleSearch = async () => {
    if (searchKey.valid) {
      const url = qs.stringifyUrl(
        {
          url: path,
          query: {
            path: currentQuery.path,
            search: searchKey.value,
          },
        },
        { skipNull: true }
      );

      setSearchKey({ value: "", valid: false });
      push(url);
    } else if (!isEmpty(searchKey.value?.trim())) {
      setIsSubmit(true);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSearch();
    }
  };

  const handleLogout = () => {
    dispatch(updatePersistInfos({ authToken: null }));
    window.location = "/login";
  };

  return (
    <>
      <div className="fixed z-10 w-full bg-[var(--bg-primary)] px-[2%] sm:px-[10%] py-2">
        <div className="flex w-full h-full">
          <h1 className="flex items-center gap-2 w-max sm:w-1/5">
            <p className="flex justify-center items-center bg-[var(--primary-color)] font-extrabold h-10 w-12 min-w-12 rounded-3xl text-[var(--white)] text-4xl pb-1">
              e
            </p>
            <span className="font-bold text-2xl text-[var(--primary-color)] hidden sm:block">
              Connect
            </span>
          </h1>

          <div className="flex flex-1 sm:flex-auto w-3/5 items-center justify-center px-10">
            <div className="flex w-full relative items-center">
              <i
                onClick={handleSearch}
                className="text-[var(--white)] absolute right-0 bg-[var(--primary-color)] flex h-10 justify-center items-center w-12 rounded-3xl"
              >
                <IoSearch size={"1.35rem"} />
              </i>
              <input
                className={`w-full pl-7 pr-4 py-1 rounded-full border bg-[var(--bg-secondary)] text-[var(--opposite)] h-10 placeholder:opacity-50 outline-none input`}
                type="text"
                id="search"
                value={searchKey.value}
                onChange={(e) =>
                  setSearchKey((prev) => ({ ...prev, value: e.target.value }))
                }
                onKeyDown={handleEnter}
                placeholder="Rechercher..."
              />
            </div>
          </div>

          <div className="flex w-max sm:w-1/5 justify-end gap-4">
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
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bgTrans z-10">
          <motion.div
            initial={{ y: -15 }}
            animate={{ y: 0 }}
            className="bg-[var(--bg-primary)] brd p-4 rounded-xl max-w-72 flex flex-col gap-2 pointer-events-auto"
          >
            <p className="text-center font-semibold text-[var(--opposite)]">
              Voulez-vous vraiement vous deconnecter ?
            </p>
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => loginOut(false)}
                className="bg-[var(--bg-secondary)] text-[var(--opposite)] opacity-90 px-4 py-1 rounded-full w-1/2 font-light button"
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
