import { useContext } from "react";
import { FaUser } from "react-icons/fa";
import { UidContext } from "../../context/UidContext";
import { isEmpty } from "../../lib/allFunctions";

export default function ProfilImg({ image, online }) {
  const { profilUrl } = useContext(UidContext);

  return (
    <div className="relative min-w-10 min-h-10 cursor-pointer">
      {isEmpty(image) ? (
        <i className="w-10 h-10 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
          <FaUser size={"1.15rem"} />
        </i>
      ) : (
        <img
          src={profilUrl + image}
          className="rounded-full object-cover h-10 w-10"
          alt=""
        />
      )}
      {online && (
        <i className="absolute bottom-0 right-0 h-3 w-3 border-2 border-[var(--bg-primary)] rounded-full bg-[var(--primary-color)]" />
      )}
    </div>
  );
}
