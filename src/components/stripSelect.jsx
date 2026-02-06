import Image from "next/image";

export default function StripSelect({ selectedStrip, onSelectStrip }) {
  const strips = [
    {
      id: "Frame1",
      icon: "star.png",
      hoverIcon: "hover_star.png",
      alt: "Lucky Star",
    },
    {
      id: "Frame2",
      icon: "neko.png",
      hoverIcon: "hover_neko.png",
      alt: "Neko",
    },
    {
      id: "Frame3",
      icon: "love.png",
      hoverIcon: "hover_love.png",
      alt: "Love",
    },
    {
      id: "Frame4",
      icon: "wanted.png",
      hoverIcon: "hover_wanted.png",
      alt: "Wanted",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-2 items-center justify-center z-10 mt-0 gap-4 xl:gap-6">
        {strips.map((strip) => {
          const isSelected = selectedStrip === strip.id;

          return (
            <button
              key={strip.id}
              type="button"
              className="relative inline-block group"
              onClick={() => onSelectStrip(strip.id)}
            >
              <div
                className={`absolute inset-0 rounded-xl translate-x-2 sm:translate-x-2 lg:translate-x-2 translate-y-2 sm:translate-y-2 lg:translate-y-2 transition-colors ${
                  isSelected
                    ? "bg-[#F2AEBD]"
                    : "bg-[#3D568F] group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD]"
                }`}
              ></div>
              <div
                className={`relative border sm:border-2 rounded-xl transition-colors flex items-center justify-center
                  w-[30vw] h-[12vw] 
                  sm:w-[30vw] sm:h-[12vw] 
                  md:w-[25vw] md:h-[10vw] 
                  lg:w-[18vw] lg:h-[7vw] 
                  xl:w-[10vw] xl:h-[4vw]
                  2xl:w-[8vw] 2xl:h-[3vw]
                  py-2 sm:py-0.5 lg:py-3 xl:py-2 2xl:py-2
                  ${
                    isSelected
                      ? "bg-[#3D568F] border-[#F2AEBD]"
                      : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]"
                  }`}
              >
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <Image
                    src={`/${strip.icon}`}
                    alt={`${strip.alt} Strip Button`}
                    width={200}
                    height={50}
                    priority
                    className={`pointer-events-none object-contain w-full h-full ${
                      isSelected
                        ? "hidden"
                        : "group-active:hidden xl:group-hover:hidden"
                    }`}
                  />
                  <Image
                    src={`/${strip.hoverIcon}`}
                    alt={`${strip.alt} Strip Button Hover`}
                    width={200}
                    height={50}
                    priority
                    className={`pointer-events-none object-contain w-full h-full ${
                      isSelected
                        ? "block"
                        : "hidden group-active:block xl:group-hover:block"
                    }`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
