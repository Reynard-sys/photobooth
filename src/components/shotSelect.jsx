import Image from "next/image";

export default function ShotButton({ shots, isSelected, onClick }) {
  return (
    <button
      type="button"
      className="relative inline-block group"
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 rounded-xl translate-x-2 translate-y-2 transition-colors ${
          isSelected
            ? "bg-[#F2AEBD]"
            : "bg-[#3D568F] group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD]"
        }`}
      ></div>
      <div
        className={`relative border sm:border-2 rounded-xl py-4 sm:py-5 md:py-5 xl:py-5 px-8 sm:px-12 lg:px-9 md:px-12 xl:px-12 transition-colors ${
          isSelected
            ? "bg-[#3D568F] border-[#F2AEBD]"
            : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]"
        }`}
      >
        <Image
          src={`/${shots}shots.png`}
          alt={`${shots} Shots Button`}
          width={200}
          height={15}
          priority
          className={`pointer-events-none w-[4vw] sm:w-[4vw] lg:w-[2vw] md:w-[4vw] xl:w-[3vw] h-auto ${isSelected ? "hidden" : "group-active:hidden"}`}
        />
        <Image
          src={`/hover_${shots}shots.png`}
          alt={`Hovered ${shots} Shots Button`}
          width={200}
          height={15}
          priority
          className={`pointer-events-none w-[4vw] sm:w-[4vw] lg:w-[2vw] md:w-[4vw] xl:w-[3vw] h-auto ${isSelected ? "block" : "hidden group-active:block"}`}
        />
      </div>
    </button>
  );
}
