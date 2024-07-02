import qs from "query-string";

import { createContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { allPaths, notLoggedPaths, protectedPaths } from "../lib/paths";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../lib/allFunctions";
import { updatePersistInfos } from "../redux/slices/persistSlice";
import { fetchUserInfos } from "../redux/slices/userSlice";

const apiUrl = "http://localhost:8000/api";

export const UidContext = createContext();

export default function UidContextProvider({ children }) {
  const location = useLocation();
  const push = useNavigate();
  const dispatch = useDispatch();
  const { authToken } = useSelector((state) => state.persistInfos);

  const [currentQuery, setCurrentQuery] = useState({});
  const [showLogout, setShowLogout] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const newParams = qs.parse(location.search);
    setCurrentQuery(newParams);
  }, [location.search]);

  useEffect(() => {
    if (!allPaths.includes(location.pathname)) {
      push("/home");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isEmpty(authToken)) {
      (async () => {
        const res = await fetch(`${apiUrl}/token/${authToken}/verify`).then(
          (res) => res.json()
        );

        if (res?.verify) {
          setUserId(res.verify.infos.id);
          if (notLoggedPaths.includes(location.pathname)) {
            push("/home?path=accueil");
          }
        } else {
          dispatch(updatePersistInfos({ authToken: null }));
          if (protectedPaths.includes(location.pathname)) {
            push("/login");
          }
        }
      })();
    } else {
      if (protectedPaths.includes(location.pathname)) {
        push("/login");
      }
    }
  }, [authToken]);

  useEffect(() => {
    if (!isEmpty(userId)) {
      (async () => {
        const res = await fetch(`${apiUrl}/user/${userId}/get-user`).then(
          (res) => res.json()
        );

        if (res?.user) {
          dispatch(fetchUserInfos({ user: res.user }));
        } else {
          dispatch(updatePersistInfos({ authToken: null }));
          if (protectedPaths.includes(location.pathname)) {
            push("/login");
          }
        }
      })();
    }
  }, [userId]);

  const toastStyle = {
    style: {
      border: "1px solid var(--primary-color)",
      padding: "0.8rem",
      color: "var(--white)",
      background: "var(--linear-gradient)",
    },
    iconTheme: {
      primary: "var(--white)",
      secondary: "var(--text)",
    },
  };

  const loginOut = (value) => {
    setShowLogout(value);
  };

  return (
    <UidContext.Provider
      value={{
        path: location.pathname,
        currentQuery,
        toastStyle,
        apiUrl,
        showLogout,
        loginOut,
      }}
    >
      {children}
      <Toaster />
    </UidContext.Provider>
  );
}
