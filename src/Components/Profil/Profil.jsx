import { useSelector } from "react-redux";

export default function Profil() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="bg-[var(--bg-primary)] p-4 rounded-xl mt-6 flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <img
            src={"/icon.png"}
            className="w-12 h-12 object-cover rounded-full"
            alt=""
          />
          <div className="flex flex-col justify-center">
            <p className="font-semibold text-[var(--opposite)]">{user.name}</p>
            <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
              {user.email}
            </p>
          </div>
        </div>
        <p className="text-slate-400 font-light text-xs">12 decembre 2024</p>
      </div>
      <div className="flex items-center gap-4 pl-12">
        <label
          className={`py-2 px-4 rounded-full w-1/3 flex justify-center items-center gap-2 ${
            true ? "bg-[var(--primary-color)] text-[var(--white)]" : "button"
          }`}
        >
          <span className="text-sm font-bold">5</span>{" "}
          <span className="text-sm">Publications</span>
        </label>
        <label className="py-2 px-4 rounded-full w-1/3 flex justify-center items-center gap-2 button">
          <span className="text-sm font-bold">5</span>{" "}
          <span className="text-sm">Abonnements</span>
        </label>
        <label className="py-2 px-4 rounded-full w-1/3 flex justify-center items-center gap-2 button">
          <span className="text-sm font-bold">5</span>{" "}
          <span className="text-sm">Abonnees</span>
        </label>
      </div>
    </div>
  );
}
