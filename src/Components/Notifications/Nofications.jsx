import React from "react";
import pdp from "../../assets/image/ff.jpg";

export default function Nofications() {
  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="relative bg-[var(--bg-primary)] flex rounded-xl p-4 gap-2 items-center">
        <div className="flex justify-center items-center gap-2">
          <div className="relative w-10 h-full min-w-10">
            <img
              src={pdp}
              alt=""
              className="rounded-full object-cover w-10 h-10"
            />
          </div>
          <div className="flex items-center min-h-full">
            <p className="pr-10 flex justify-center flex-col">
              <span className="font-semibold text-[var(--opposite)]">
                Flavien RAK
              </span>{" "}
              <span className="text-sm line-clamp-1 text-[var(--opposite)] opacity-80 font-light">
                A reagi a votre poste.
              </span>
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 absolute top-5 right-5">10h:10</p>
      </div>
    </div>
  );
}
