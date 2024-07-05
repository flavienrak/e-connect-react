import toast from "react-hot-toast";
import ProfilImg from "./ProfilImg";

import { useContext, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../../lib/allFunctions";
import { UidContext } from "../../context/UidContext";
import { updateUserInfos } from "../../redux/slices/userSlice";
import { IoCamera } from "react-icons/io5";

export default function EditProfil() {
  const { user } = useSelector((state) => state.user);
  const { apiUrl, toastStyle } = useContext(UidContext);

  const dispatch = useDispatch();

  const [name, setName] = useState({ value: user.name || "", valid: false });
  const [image, setImage] = useState(!isEmpty(user.image) ? user.image : "");
  const [file, setFile] = useState(null);
  const [editProfil, setEditProfil] = useState(false);

  useEffect(() => {
    // name
    if (name.value?.trim()?.length > 2 && name.value?.trim() !== user.name) {
      if (!name.valid) {
        setName((prev) => ({ ...prev, valid: true }));
      }
    } else {
      if (name.valid) {
        setName((prev) => ({ ...prev, valid: false }));
      }
    }
  }, [name.value]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.valid || file) {
      const data = new FormData();

      if (name.valid) {
        data.append("name", name.value.trim());
      }
      if (file) {
        data.append("file", file);
      }

      const res = await fetch(`${apiUrl}/user/${user._id}/edit-profil`, {
        method: "POST",
        body: data,
      }).then((res) => res.json());

      if (res?.user) {
        dispatch(updateUserInfos({ user: res.user }));
        setEditProfil(false);
        toast.success("Profil modifie avec success", toastStyle);

        if (res.user?.image) {
          window.location.reload();
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--bg-primary)] w-full p-4 rounded-xl flex flex-col items-start gap-4"
    >
      <div className="flex w-full justify-between">
        <div></div>
        <label
          onClick={() => setEditProfil((prev) => !prev)}
          className="bg-[var(--primary-color)] rounded-full px-4 py-2 text-[var(--white)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <i>
            <AiFillEdit />
          </i>
          <span className="text-sm select-none">Editer</span>
        </label>
      </div>

      {editProfil && (
        <div className="flex w-full gap-4">
          <div className="relative flex gap-4 flex-col items-center">
            <ProfilImg image={image} />

            <label
              htmlFor="file"
              className="bg-[var(--bg-primary)] h-8 w-8 flex justify-center items-center absolute rounded-full text-[var(--primary-color)] bottom-0 right-0 cursor-pointer"
            >
              <i>
                <IoCamera size={"1.25rem"} />
              </i>
              <input
                type="file"
                id="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleChangeFile}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 flex gap-2 flex-col justify-center">
            <input
              type="text"
              value={name.value}
              placeholder="Votre nom"
              onChange={(e) => {
                setName((prev) => ({ ...prev, value: e.target.value }));
              }}
              className="h-10 w-full bg-[var(--bg-secondary)] rounded-lg focus:outline focus:outline-slate-400 px-4 textarea text-[var(--opposite)] placeholder:text-slate-400 font-light"
            />
            <button className="bg-[var(--primary-color)] rounded-lg px-4 py-2 text-[var(--white)] flex items-center justify-center gap-2">
              <span className="text-sm">Soumettre</span>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
