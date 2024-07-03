import qs from "query-string";
import frLocale from "timeago.js/lib/lang/fr";

import { createContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { allPaths, notLoggedPaths, protectedPaths } from "../lib/paths";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../lib/allFunctions";
import { updatePersistInfos } from "../redux/slices/persistSlice";
import { fetchUserInfos } from "../redux/slices/userSlice";
import { fetchPostsInfos } from "../redux/slices/postsSlice";
import { register } from "timeago.js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { fetchUsers } from "../redux/slices/usersSlice";

register("fr", frLocale);

const apiUrl = "http://localhost:8000/api";
const profilImg = "http://localhost:8000/uploads/profile/";
const postImg = "http://localhost:8000/uploads/post/";

export const UidContext = createContext();

export default function UidContextProvider({ children }) {
  const location = useLocation();
  const push = useNavigate();
  const dispatch = useDispatch();

  const { authToken } = useSelector((state) => state.persistInfos);

  const [currentQuery, setCurrentQuery] = useState({});
  const [showLogout, setShowLogout] = useState(false);
  const [userId, setUserId] = useState(null);
  const [getUsers, setGetUsers] = useState(false);
  const [getPosts, setGetPosts] = useState(false);

  useEffect(() => {
    const newParams = qs.parse(location.search);
    setCurrentQuery(newParams);
  }, [location.search]);

  useEffect(() => {
    if (!allPaths.includes(location.pathname)) {
      push("/home?path=accueil");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isEmpty(currentQuery?.path)) {
      push("/home?path=accueil");
    }
  }, [currentQuery?.path]);

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
          setGetUsers(true);
        } else {
          dispatch(updatePersistInfos({ authToken: null }));
          if (protectedPaths.includes(location.pathname)) {
            push("/login");
          }
        }
      })();
    }
  }, [userId]);

  useEffect(() => {
    if (getUsers) {
      (async () => {
        const res = await fetch(`${apiUrl}/user/${userId}/get-all`).then(
          (res) => res.json()
        );

        if (res?.users) {
          dispatch(fetchUsers({ users: res.users }));
          setGetPosts(true);
        }
      })();
    }
  }, [getUsers]);

  useEffect(() => {
    if (getPosts) {
      (async () => {
        const res = await fetch(`${apiUrl}/post/get-all`).then((res) =>
          res.json()
        );

        if (res?.posts) {
          dispatch(fetchPostsInfos({ posts: res.posts }));
        }
      })();
    }
  }, [getPosts]);

  const formatDate = (date) => {
    return format(date, "dd MMMM yyyy", { locale: fr });
  };

  const toastStyle = {
    style: {
      border: "1px solid var(--primary-color)",
      padding: "0.8rem",
      color: "var(--white)",
      background: "var(--primary-color)",
    },
    iconTheme: {
      primary: "var(--white)",
      secondary: "var(--primary-color)",
    },
  };

  const loginOut = (value) => {
    setShowLogout(value);
  };

  return (
    <UidContext.Provider
      value={{
        userId,
        apiUrl,
        toastStyle,
        showLogout,
        currentQuery,
        profilImg,
        postImg,
        path: location.pathname,
        loginOut,
        formatDate,
      }}
    >
      {children}
      <Toaster />
    </UidContext.Provider>
  );
}
