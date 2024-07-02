// Center.js
import pdp1 from "../../assets/image/profil2.jpeg";
import image5 from "../../assets/image/profl5.jpg";
import Postpub from "./Postpub";
import Cardpost from "./Cardpost";

export default function Center() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl pb-4">
      <Postpub pdp={pdp1} />
      <Cardpost
        photopdp={pdp1}
        photopost={image5}
        pseudo="Patricette"
        date="2 minutes ago"
      />
      <p className="text-[var(--opposite)] text-center text-sm flex justify-center items-center py-4 opacity-50">
        {`< Fin des postes >`}
      </p>
    </div>
  );
}
