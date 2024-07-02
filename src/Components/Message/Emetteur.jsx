export default function Emetteur({ value }) {
  return (
    <>
      <div className="flex w-4/5 max-w-4/5 gap-2 justify-between">
        <div className="flex gap-2 flex-col">
          <div className="bg-[var(--bg-secondary)] py-2 flex flex-wrap px-4 leading-6 text-sm rounded-xl">
            <p className="text-[var(--opposite)]">{value}</p>
          </div>
        </div>
      </div>
    </>
  );
}
