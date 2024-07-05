export default function PostLoader({ index }) {
  return (
    <div className="flex flex-col gap-6">
      <div
        style={{ animationDelay: index * 1.5 + "s" }}
        className="bg-[var(--bg-primary)] rounded-xl p-4 h-60 gap-6 flex flex-col justify-between skeleton"
      >
        <div className="flex justify-between">
          <div className="flex gap-2">
            <i className="flex justify-center items-center rounded-full h-10 w-10 min-w-10 min-h-10 bg-[var(--bg-secondary)]"></i>
            <div className="flex flex-col justify-evenly">
              <p className="flex min-h-3 h-3 w-28 rounded-full bg-[var(--bg-secondary)]"></p>
              <p className="flex min-h-3 h-3 w-20 rounded-full bg-[var(--bg-secondary)]"></p>
            </div>
          </div>

          <i className="h-4 w-4 rounded-md bg-[var(--bg-secondary)]" />
        </div>

        <div className="flex flex-1 w-full gap-2 flex-col">
          <p className="flex min-h-3 h-3 w-full rounded-full bg-[var(--bg-secondary)]"></p>
          <p className="flex min-h-3 h-3 w-full rounded-full bg-[var(--bg-secondary)]"></p>
          <p className="flex min-h-3 h-3 w-full rounded-full bg-[var(--bg-secondary)]"></p>
          <p className="flex min-h-3 h-3 w-4/5 rounded-full bg-[var(--bg-secondary)]"></p>
        </div>

        <div className="flex gap-4">
          <p className="flex min-h-10 h-10 w-1/2 rounded-full bg-[var(--bg-secondary)]"></p>
          <p className="flex min-h-10 h-10 w-1/2 rounded-full bg-[var(--bg-secondary)]"></p>
        </div>
      </div>
    </div>
  );
}
