const Story = ({ image, pdp, pseudo }) => {
  return (
    <>
      <div className=" relative  mr-1 h-48 w-full shrink-0 rounded-xl bg-gradient-to-b from-transparent to-[var(--black-color)] transition ease-in ">
        <div className="z-20 hover:scale-105">
          <img
            src={image}
            className="  h-48 w-full rounded-xl object-cover  transition delay-75 ease-in hover:scale-110"
            alt=""
          />
        </div>
        <div className="left-2 top-2 flex  size-8 items-center justify-center rounded-full bg-violet-700 p-0.5 ">
          <img
            src={pdp}
            className=" size-6 rounded-full bg-[var(--black-color)] object-cover"
            alt=""
          />
        </div>
        <p className="absolute bottom-4 left-2 z-10 text-justify text-sm font-semibold text-[var(--white-color)]">
          {pseudo}
        </p>
        <div className=" bg-custom-gradient absolute left-0 top-0 h-48 w-full rounded-xl hover:bg-[var(--hover-color)]"></div>
      </div>
    </>
  );
};
export default Story;
