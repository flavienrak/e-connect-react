import Postpub from "../Centre/Postpub";

export default function CreatePost() {
  return (
    <div className="mt-6 w-full">
      <div />
      <div className="flex flex-col gap-6">
        <div className="px-4 h-14 flex justify-center items-center rounded-xl bg-[var(--bg-primary)]">
          <p className="text-[var(--primary-color)] font-semibold text-lg">
            Creer un post
          </p>
        </div>
        <Postpub />
      </div>
    </div>
  );
}
