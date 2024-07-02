export default function Destinataire({ value }) {
  return (
    <>
      <div className="bg-[var(--primary-color)] text-[var(--white)] flex items-end self-end py-2 px-4  leading-6 text-sm  text-white rounded-2xl ">
        <p>{value}</p>
      </div>
    </>
  );
}
