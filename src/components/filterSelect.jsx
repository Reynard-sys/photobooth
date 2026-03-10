import Image from "next/image";
import { FILTERS } from "@/lib/constants";

export default function FilterSelect({ selectedFilter, onSelectFilter }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid grid-cols-3 items-center justify-center z-10 gap-4">
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              className="relative inline-block group"
              onClick={() => onSelectFilter(filter.id)}
            >
              <div
                className={`absolute inset-0 rounded-xl translate-x-2 translate-y-2 transition-colors ${
                  isSelected
                    ? "bg-[#F2AEBD]"
                    : "bg-[#3D568F] group-active:bg-[#F2AEBD] xl:group-hover:bg-[#F2AEBD]"
                }`}
              />
              <div
                className={`relative border sm:border-2 rounded-xl transition-colors flex items-center justify-center
                  w-[18vw]  h-[12vw]
                  sm:w-[18vw] sm:h-[12vw]
                  md:w-[14vw] md:h-[10vw]
                  lg:w-[6.5vw] lg:h-[3.5vw]
                  xl:w-[8vw]  xl:h-[3.5vw]
                  2xl:w-[7vw] 2xl:h-[3.5vw]
                  py-2 sm:py-0.5 lg:py-1 xl:py-2 2xl:py-2
                  ${
                    isSelected
                      ? "bg-[#3D568F] border-[#F2AEBD]"
                      : "bg-[#F2DDDC] border-[#3D568F] group-active:bg-[#3D568F] group-active:border-[#F2AEBD] xl:group-hover:bg-[#3D568F] xl:group-hover:border-[#F2AEBD]"
                  }`}
              >
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <Image
                    src={filter.icon}
                    alt={`${filter.alt} Filter Button`}
                    width={200}
                    height={50}
                    className={`pointer-events-none object-contain w-full h-full ${
                      isSelected ? "hidden" : "group-active:hidden xl:group-hover:hidden"
                    }`}
                  />
                  <Image
                    src={filter.hoverIcon}
                    alt={`${filter.alt} Filter Button Hover`}
                    width={200}
                    height={50}
                    className={`pointer-events-none object-contain w-full h-full ${
                      isSelected ? "block" : "hidden group-active:block xl:group-hover:block"
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
