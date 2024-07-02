import { useDispatch, useSelector } from "react-redux";
import { updatePersistInfos } from "../../redux/slices/persistSlice";

export default function Setting() {
  const { mode, theme } = useSelector((state) => state.persistInfos);
  const dispatch = useDispatch();

  return (
    <div className="mt-6 bg-[var(--bg-primary)] rounded-xl p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-[var(--opposite)]">Mode</h1>
        <div className="flex gap-4">
          <div
            onClick={() => dispatch(updatePersistInfos({ mode: "light" }))}
            className={`h-12 w-1/2 rounded-lg bg-[var(--white)] flex justify-center items-center text-[var(--text)] ${
              mode === "light"
                ? "border-2 border-[var(--opposite)]"
                : "cursor-pointer"
            }`}
          >
            Clair
          </div>
          <div
            onClick={() => dispatch(updatePersistInfos({ mode: "dark" }))}
            className={`h-12 w-1/2 rounded-lg bg-slate-950 flex justify-center items-center text-[var(--white)] ${
              mode === "dark"
                ? "border-2 border-[var(--opposite)]"
                : "cursor-pointer"
            }`}
          >
            Sombre
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-[var(--opposite)]">Themes</h1>
        <div className="grid grid-cols-4 gap-4 flex-wrap">
          <div
            onClick={() => dispatch(updatePersistInfos({ theme: "default" }))}
            className={`h-12 w-full rounded-lg flex justify-center items-center text-[var(--white)] text-sm bg-[#9c149c] ${
              theme === "default"
                ? "border-2 border-[var(--opposite)]"
                : "cursor-pointer"
            }`}
          >
            Par defaut
          </div>
          <div
            onClick={() => dispatch(updatePersistInfos({ theme: "purple" }))}
            className={`h-12 w-full rounded-lg flex justify-center items-center text-[var(--white)] text-sm bg-[#5a3bd8] ${
              theme === "purple"
                ? "border-2 border-[var(--opposite)]"
                : "cursor-pointer"
            }`}
          >
            Violet
          </div>
          <div
            onClick={() => dispatch(updatePersistInfos({ theme: "green" }))}
            className={`h-12 w-full rounded-lg flex justify-center items-center text-[var(--white)] text-sm bg-[#1dc85c] ${
              theme === "green"
                ? "border-2 border-[var(--opposite)]"
                : "cursor-pointer"
            }`}
          >
            Vert
          </div>
          <div
            onClick={() => dispatch(updatePersistInfos({ theme: "yellow" }))}
            className={`h-12 w-full rounded-lg flex justify-center items-center text-[var(--white)] text-sm bg-[#e0b638] ${
              theme === "yellow"
                ? "border-2 border-[var(--opposite)]"
                : "cursor-pointer"
            }`}
          >
            Jaune
          </div>
        </div>
      </div>
    </div>
  );
}
