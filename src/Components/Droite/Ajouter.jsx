const Ajouter = ({ pdp, pseudo }) => {
  return (
    <>
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-[var(--bg-primary)] p-4">
        <div className="flex gap-3 items-center">
          <div className="h-10 w-10 relative min-w-10 min-h-10 cursor-pointer">
            <img
              src={pdp}
              className="w-10 h-10 rounded-full object-cover"
              alt=""
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <p className="font-bold text-[var(--opposite)]">{pseudo}</p>
            <div className="flex gap-2">
              <button className="rounded-3xl px-2 py-1.5 w-1/2 text-xs button">
                Annuler
              </button>
              <button className="rounded-3xl bg-[var(--primary-color)] px-2 py-1.5 w-1/2 text-[var(--white-color)] hover:opacity-90 text-xs">
                Suivre
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Ajouter;
