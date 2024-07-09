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
import { differenceInCalendarDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { fetchUsers } from "../redux/slices/usersSlice";
import { fetchMessagesInfos } from "../redux/slices/messagesSlice";
import {
  deleteNotificationsInfos,
  fetchNotifications,
  updateAllNotifications,
} from "../redux/slices/notificationsSlice";

register("fr", frLocale);

const apiUrl = "http://localhost:8000/api";
const profilUrl = "http://localhost:8000/uploads/profile/";
const postUrl = "http://localhost:8000/uploads/post/";

export const UidContext = createContext();

export default function UidContextProvider({ children }) {
  const location = useLocation();
  const push = useNavigate();
  const dispatch = useDispatch();

  const { authToken } = useSelector((state) => state.persistInfos);
  const { posts } = useSelector((state) => state.posts);

  const [currentQuery, setCurrentQuery] = useState({});
  const [showLogout, setShowLogout] = useState(false);
  const [userId, setUserId] = useState(null);
  const [getNotifications, setGetNotifications] = useState(false);
  const [getUsers, setGetUsers] = useState(false);
  const [getPosts, setGetPosts] = useState(false);
  const [getMessages, setGetMessages] = useState(false);

  const [loadPost, setLoadPost] = useState(false);

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
          dispatch(updatePersistInfos({ authToken: "" }));
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
          setGetNotifications(true);
        } else {
          dispatch(updatePersistInfos({ authToken: "" }));
          if (protectedPaths.includes(location.pathname)) {
            push("/login");
          }
        }
      })();
    }
  }, [userId]);

  useEffect(() => {
    if (!isEmpty(getNotifications)) {
      (async () => {
        const res = await fetch(
          `${apiUrl}/notification/${userId}/get-notifs`
        ).then((res) => res.json());

        if (res?.notifications) {
          dispatch(fetchNotifications({ notifications: res.notifications }));
          setGetUsers(true);
        }
      })();
    }
  }, [getNotifications]);

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
    if (getPosts || currentQuery?.path === "accueil") {
      (async () => {
        setLoadPost(true);
        const res = await fetch(`${apiUrl}/post/${userId}/get-all`).then(
          (res) => res.json()
        );

        if (!isEmpty(posts)) {
          setTimeout(() => {
            setLoadPost(false);
          }, 2000);
        } else {
          setLoadPost(false);
        }

        if (res?.posts) {
          (async () => {
            const res = await fetch(
              `${apiUrl}/notification/${userId}/post/view-all`
            ).then((res) => res.json());

            if (res?.notifications) {
              dispatch(
                deleteNotificationsInfos({ notifications: res.notifications })
              );
            }
          })();

          dispatch(fetchPostsInfos({ posts: res.posts }));
          setGetMessages(true);
          setGetPosts(false);
        }
      })();
    }
  }, [getPosts]);

  useEffect(() => {
    if (getMessages) {
      (async () => {
        const res = await fetch(`${apiUrl}/message/${userId}/get-all`).then(
          (res) => res.json()
        );

        if (res?.messages) {
          dispatch(fetchMessagesInfos({ messages: res.messages }));
        }
      })();
    }
  }, [getMessages]);

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

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const isToday = differenceInCalendarDays(new Date(), messageDate) === 0;

    if (isToday) {
      return format(date, "HH:mm");
    } else {
      return `${format(date, "d", { locale: fr })} ${format(date, "MMMM", {
        locale: fr,
      })} - ${format(date, "HH:mm")}`;
    }
  };

  const loginOut = (value) => {
    setShowLogout(value);
  };

  const refetchPost = (value) => {
    setGetPosts(value);
  };

  return (
    <UidContext.Provider
      value={{
        userId,
        apiUrl,
        toastStyle,
        showLogout,
        currentQuery,
        profilUrl,
        postUrl,
        loadPost,
        path: location.pathname,
        formatDate,
        refetchPost,
        loginOut,
      }}
    >
      {children}
      <Toaster />
    </UidContext.Provider>
  );
}
