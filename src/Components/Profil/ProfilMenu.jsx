import { BiSolidMessageDetail } from "react-icons/bi";
import { isEmpty } from "../../lib/allFunctions";
import { Link } from "react-router-dom";

export default function ProfilMenu({ url, isOwn, active, setActive, items }) {
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
                : "button cursor-pointer text-[var(--opposite)]"
            }`}
          >
            <span className="text-sm font-bold">{item.number}</span>{" "}
            <span className="text-sm">
              {item.label}
              {item.number > 1 && <span>s</span>}
            </span>
          </label>
        ))}

        {!isOwn && (
          <Link to={url}>
            <i className="flex justify-center items-center bg-[var(--primary-color)] font-extrabold h-10 w-12 min-w-12 rounded-3xl text-[var(--white)] text-4xl pt-1 cursor-pointer">
              <BiSolidMessageDetail size={"1.5rem"} />
            </i>
          </Link>
        )}
      </>
    );
}
