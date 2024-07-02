import Icon from "@mdi/react";

const Menu = ({ label, nouvelle, icone, index, style, handle }) => {
  return (
    <div
      onClick={handle}
      style={style}
      className="relative flex w-full  cursor-pointer justify-center border-l-2 border-transparent py-3.5 transition delay-100 ease-in active:border-l-4 active:border-violet-700 active:bg-gray-500/30"
    >
      <Icon size={1} color="grey" className="w-1/4 " path={icone} />
      <p className="ml-8 w-3/5 md:hidden lg:flex font-semibold">{label}</p>
      {index === 3 || index === 2 ? (
        <div className="absolute left-9 top-1 flex size-5 items-center justify-center rounded-full bg-[var(--red-color)] font-bold text-[var(--white-color)]">
          <p>{nouvelle}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Menu;
