import Cardpost from "../Centre/Cardpost";
import TextareaPost from "../Centre/TextareaPost";
import ProfilImg from "../Profil/ProfilImg";
import toast from "react-hot-toast";
import qs from "query-string";

import { useContext, useEffect, useState } from "react";
import { UidContext } from "../../context/UidContext";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { AiFillEdit } from "react-icons/ai";
import { IoImageOutline } from "react-icons/io5";
import { updatePostInfos } from "../../redux/slices/postsSlice";
import { updateUserInfos } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";

export default function SinglePost() {
  const { posts } = useSelector((state) => state.posts);
  const { users } = useSelector((state) => state.users);
  const { currentQuery, userId, toastStyle, apiUrl, postUrl, path } =
    useContext(UidContext);

  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const [post, setPost] = useState({});
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [editPost, setEditPost] = useState(false);

  useEffect(() => {
    if (!isEmpty(currentQuery?.post)) {
      (async () => {
        const res = await fetch(
          `${apiUrl}/post/${userId}/${currentQuery.post}/get-post`
        ).then((res) => res.json());

        if (res?.post) {
          setPost(res.post);
          dispatch(updateUserInfos({ user: res.user }));
        }
      })();
    }
  }, [currentQuery?.post]);

  useEffect(() => {
    if (!isEmpty(post)) {
      setPost(posts.find((item) => item._id === post._id));
      setUser(users.find((item) => item._id === post.senderId));
      setMessage(post.message || "");
      setImage(post.image ? postUrl + post.image : "");
    }
  }, [post, users, posts]);

  useEffect(() => {
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setImage(newUrl);
    }
  }, [file]);

  const handleChangeFile = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setImage(post.image ? postUrl + post.image : "");
    setMessage(post.message || "");
    setEditPost(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmpty(message?.trim()) || file) {
      const data = new FormData();
      if (!isEmpty(message?.trim())) {
        data.append("message", message.trim());
      }
      if (file) {
        data.append("file", file);
      }

      const res = await fetch(
        `${apiUrl}/post/${user._id}/${post._id}/edit-post`,
        {
          method: "POST",
          body: data,
        }
      ).then((res) => res.json());

      if (res?.post) {
        dispatch(updatePostInfos({ post: res.post }));
        toast.success("Post modifié", toastStyle);
        setPost(res.post);
        handleReset();
      }
    } else {
      handleReset();
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const backUrl = qs.stringifyUrl(
    {
      url: path,
      query: {
        path: currentQuery.path,
      },
    },
    { skipNull: true }
  );

  if (!isEmpty(user))
    return (
      <div className="mt-6">
        <div />
        <div className="flex flex-col gap-6 rounded-2xl pb-4">
          <div className="flex w-full bg-[var(--bg-primary)] p-4 rounded-xl justify-between">
            <Link
              to={backUrl}
              className="bg-[var(--primary-color)] rounded-full px-4 py-2 text-[var(--white)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-sm select-none">{`<- Revenir`}</span>
            </Link>

            {userId === post.senderId && (
              <label
                onClick={() => setEditPost((prev) => !prev)}
                className="bg-[var(--primary-color)] rounded-full px-4 py-2 text-[var(--white)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <i>
                  <AiFillEdit />
                </i>
                <span className="text-sm select-none">Editer</span>
              </label>
            )}
          </div>

          {!editPost && (
            <Cardpost
              isViewPost={true}
              sender={user}
              post={post}
              isOwn={user._id === userId}
            />
          )}

          {editPost && userId === post.senderId && (
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--bg-primary)] w-full p-4 rounded-xl flex flex-col items-start gap-4"
            >
              <div className="flex w-full gap-4">
                <div className="flex-1 flex gap-2 flex-col justify-center">
                  <TextareaPost
                    message={message}
                    setMessage={setMessage}
                    handleEnter={handleEnter}
                  />

                  <div className="flex w-full justify-between px-1">
                    <div className="">
                      <label
                        htmlFor="file"
                        className="font-semibold flex items-center gap-2 text-[var(--primary-color)] cursor-pointer"
                      >
                        <i>
                          <IoImageOutline size={"1.5rem"} />
                        </i>
                        <span>Image</span>
                      </label>
                      <input
                        id={"file"}
                        type="file"
                        accept=".jpg, .png, .jpeg"
                        className="hidden"
                        onChange={handleChangeFile}
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <label
                        onClick={handleReset}
                        className="h-full rounded-3xl button px-4 py-2 text-xs text-[var(--opposite)] cursor-pointer button"
                      >
                        Annuler
                      </label>
                      <button
                        type="submit"
                        className="h-full rounded-3xl bg-[var(--primary-color)] px-4 py-2 text-xs font-semibold text-[var(--white)]"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>

                  {(!isEmpty(message.trim()) || !isEmpty(image.trim())) && (
                    <div className=" flex w-full flex-col gap-2 rounded-xl bg-[var(--bg-primary)] p-4">
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-2">
                          <ProfilImg image={user.image} />

                          <div className="flex flex-col justify-center">
                            <p className="font-bold text-[var(--opposite)]">
                              {user.name}
                            </p>
                            <p className=" text-xs text-gray-400">
                              à l'instant
                            </p>
                          </div>
                        </div>
                      </div>

                      {!isEmpty(image.trim()) && (
                        <div className=" h-72 w-full rounded-xl">
                          <img
                            src={image}
                            className="size-full rounded-xl object-cover"
                            alt=""
                          />
                        </div>
                      )}

                      {!isEmpty(message.trim()) && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[var(--opposite)] font-light whitespace-pre-line">
                            {message}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
        <br />
      </div>
    );
}
