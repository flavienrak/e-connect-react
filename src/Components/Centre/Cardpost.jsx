import { GoComment } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { MdClose } from "react-icons/md";

export default function Cardpost({ photopdp, photopost, pseudo, date }) {
  return (
    <>
      <div className=" flex w-full flex-col gap-2 rounded-xl bg-[var(--bg-primary)] p-4">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <img
              src={photopdp}
              className="size-10 rounded-full object-cover "
              alt=""
            />
            <div className=" leading-none">
              <p className="font-bold text-[var(--opposite)]">{pseudo}</p>
              <p className=" text-xs text-[var(--opposite)] opacity-60 font-light">
                {date}
              </p>
            </div>
          </div>
          <i>
            <MdClose className="text-slate-400" size={"1.5rem"} />
          </i>
        </div>
        <div className=" h-72 w-full rounded-xl">
          <img
            src={photopost}
            className="size-full rounded-xl object-cover"
            alt=""
          />
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm line-clamp-3 text-[var(--opposite)] opacity-70 font-light">
            Lorem ipsum dolor sit nim laboriosam veritatis quas animi. Lorem
            ipsum dolor sit, amet consectetur adipisicing elit. Sunt, facilis
            exercitationem! Nulla, iusto suscipit! Unde beatae tempora, incidunt
            eligendi velit quae deleniti rerum! Explicabo quibusdam nostrum
            earum quisquam ducimus exercitationem!
          </p>
        </div>
        <div className="flex justify-evenly gap-4">
          <i className="flex gap-4 justify-center items-center w-1/2 rounded-full h-10 button">
            <span className="not-italic">12</span>
            <IoMdHeartEmpty size={"1.5rem"} />
            {/* <IoMdHeart size={"1.5rem"} /> */}
          </i>
          <i className="flex gap-4 justify-center items-center w-1/2 rounded-full h-10 button">
            <span className="not-italic">12</span>
            <GoComment size={"1.35rem"} />
          </i>
        </div>
      </div>
    </>
  );
}
