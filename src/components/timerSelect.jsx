import Image from "next/image";

export default function TimerButton({ seconds, isSelected, onClick }) {
  return (
    <button
      type="button"
      className="relative inline-block group"
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 rounded-xl translate-x-1 sm:translate-x-2 lg:translate-x-2 translate-y-1 sm:translate-y-2 lg:translate-y-2 transition-colors ${
          isSelected ? "bg-[#F2AEBD]" : "bg-[#3D568F] group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD]"
        }`}
      ></div>
      <div
        className={`relative border sm:border-2 rounded-xl py-3 sm:py-5 md:py-5 xl:py-6 px-8 sm:px-12 lg:px-9 md:px-12 transition-colors ${
          isSelected
            ? "bg-[#3D568F] border-[#F2AEBD]"
            : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]"
        }`}
      >
        <Image
          src={`/${seconds}s.png`}
          alt={`${seconds} Seconds Button`}
          width={200}
          height={15}
          priority
          className={`pointer-events-none w-[4vw] sm:w-[4vw] md:w-[4vw] lg:w-[2vw] xl:w-[3vw] h-auto ${
            isSelected ? "hidden" : "group-active:hidden"
          }`}
        />
        <Image
          src={`/hover_${seconds}s.png`}
          alt={`Hovered ${seconds} Seconds Button`}
          width={200}
          height={15}
          priority
          className={`pointer-events-none w-[4vw] sm:w-[4vw] md:w-[4vw] lg:w-[2vw] xl:w-[3vw] h-auto ${
            isSelected ? "block" : "hidden group-active:block"
          }`}
        />
      </div>
    </button>
  );
}
