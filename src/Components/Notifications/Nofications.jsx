import React from "react";
import pdp from "../../assets/image/ff.jpg";

import { FaUser } from "react-icons/fa";
import { isEmpty } from "../../lib/allFunctions";

export default function Nofications() {
  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Notifications (<span>{4}</span>)
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative bg-[var(--bg-primary)] flex rounded-xl p-4 gap-2 items-center">
            <div className="flex justify-center items-center gap-2">
              <div className="relative w-10 h-full min-w-10">
                {isEmpty(pdp) ? (
                  <>
                    <i className="w-28 h-28 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
                      <FaUser size={"3rem"} />
                    </i>
                  </>
                ) : (
                  <img
                    src={pdp}
                    alt="Profile"
                    className="rounded-full object-cover w-10 h-10"
                  />
                )}
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
            <p className="text-xs text-slate-400 absolute top-5 right-5">
              10h:10
            </p>
          </div>

          <div className="relative bg-[var(--bg-primary)] flex rounded-xl p-4 gap-2 items-center">
            <div className="flex justify-center items-center gap-2">
              <div className="relative w-10 h-full min-w-10">
                {isEmpty(pdp) ? (
                  <>
                    <i className="w-28 h-28 rounded-full flex justify-center items-center bg-[var(--bg-secondary)] text-[var(--white)]">
                      <FaUser size={"3rem"} />
                    </i>
                  </>
                ) : (
                  <img
                    src={pdp}
                    alt="Profile"
                    className="rounded-full object-cover w-10 h-10"
                  />
                )}
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
            <p className="text-xs text-slate-400 absolute top-5 right-5">
              10h:10
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
