export default function Messageperso({ pdp, nom, message }) {
  return (
    <>
      <div className="mt-2 flex cursor-pointer flex-row gap-3">
        <div className="size-10 rounded-full">
          <img
            src={pdp}
            className="h-10 w-full rounded-full object-cover"
            alt=""
          />
        </div>
        <div className=" leading-none">
          <p className="text-sm font-semibold text-[var(--opposite)]">{nom}</p>
          <p className="text-xs text-[var(--opposite)] opacity-60 font-light">
            {message}
          </p>
        </div>
      </div>
    </>
  );
}
