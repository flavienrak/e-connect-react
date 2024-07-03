import { useDispatch, useSelector } from "react-redux";
import { updatePersistInfos } from "../../redux/slices/persistSlice";

const themes = [
  {
    value: "default",
    color: "#5a3bd8",
  },
  {
    value: "blue",
    color: "#149be9",
  },
  {
    value: "green",
    color: "#1dc85c",
  },
  {
    value: "yellow",
    color: "#e0b638",
  },
  {
    value: "red",
    color: "#ea4f4f",
  },
];

export default function Setting() {
  const { mode, theme } = useSelector((state) => state.persistInfos);
  const dispatch = useDispatch();

  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Parametres
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--bg-primary)] p-4 rounded-xl flex flex-col gap-3">
            <h1 className="font-semibold text-[var(--opposite)]">Mode</h1>
            <div className="flex gap-4">
              <div
                onClick={() => dispatch(updatePersistInfos({ mode: "light" }))}
                className={`h-12 w-1/2 rounded-lg bg-[var(--white)] flex justify-center items-center text-slate-950 ${
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

          <div className="bg-[var(--bg-primary)] p-4 rounded-xl flex flex-col gap-3">
            <h1 className="font-semibold text-[var(--opposite)]">Themes</h1>
            <div className="flex justify-between gap-4 flex-wrap">
              {themes.map((item) => (
                <div
                  key={item.color}
                  onClick={() =>
                    dispatch(updatePersistInfos({ theme: item.value }))
                  }
                  style={{ background: item.color }}
                  className={`h-12 w-12 rounded-full flex justify-center items-center text-[var(--white)] text-sm ${
                    theme === item.value ? "border-4 brd" : "cursor-pointer"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
