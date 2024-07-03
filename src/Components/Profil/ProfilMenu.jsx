import { isEmpty } from "../../lib/allFunctions";

export default function ProfilMenu({ active, setActive, items }) {
  if (!isEmpty(items))
    return (
      <>
        {items?.map((item) => (
          <label
            key={item.active}
            onClick={() => setActive(item.active)}
            className={`py-2 px-4 rounded-full w-1/3 flex justify-center items-center gap-2 ${
              active === item.active
                ? "bg-[var(--primary-color)] text-[var(--white)] border border-transparent"
                : "button cursor-pointer"
            }`}
          >
            <span className="text-sm font-bold">{item.number}</span>{" "}
            <span className="text-sm">
              {item.label}
              {item.number > 1 && <span>s</span>}
            </span>
          </label>
        ))}
      </>
    );
}
