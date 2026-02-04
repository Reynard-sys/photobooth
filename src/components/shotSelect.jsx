import Image from "next/image";

export default function ShotButton({ shots, isSelected, onClick }) {
  return (
    <button
      type="button"
      className="relative inline-block group"
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 rounded-xl translate-x-1 sm:translate-x-2 translate-y-1 sm:translate-y-2 transition-colors ${
          isSelected ? "bg-[#F2AEBD]" : "bg-[#3D568F] group-active:bg-[#F2AEBD]"
        }`}
      ></div>
      <div
        className={`relative border sm:border-2 rounded-xl py-3 sm:py-3 md:py-4 px-8 sm:px-10 md:px-12 transition-colors ${
          isSelected
            ? "bg-[#3D568F] border-[#F2AEBD]"
            : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD]"
        }`}
      >
        <Image
          src={`/${shots}shots.png`}
          alt={`${shots} Shots Button`}
          width={200}
          height={15}
          priority
          className={`pointer-events-none w-[6vw] sm:w-[6vw] md:w-[4vw] h-auto ${isSelected ? "hidden" : "group-active:hidden"}`}
        />
        <Image
          src={`/${shots}shots.png`}
          alt={`Hovered ${shots} Shots Button`}
          width={200}
          height={15}
          priority
          className={`pointer-events-none w-[6vw] sm:w-[8vw] md:w-[4vw] h-auto ${isSelected ? "block" : "hidden group-active:block"}`}
        />
      </div>
    </button>
  );
}
