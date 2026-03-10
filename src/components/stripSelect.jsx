import Image from "next/image";
import { STRIP_FRAMES } from "@/lib/constants";
import { useState } from "react";

export default function StripSelect({ selectedStrip, onSelectStrip }) {
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 6;
  const totalPages   = Math.ceil(STRIP_FRAMES.length / itemsPerPage);
  const startIndex   = currentPage * itemsPerPage;
  const currentStrips = STRIP_FRAMES.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-4">
        {/* Back Button */}
        <div className="flex items-center justify-center w-[10vw]">
          {currentPage > 0 && (
            <button type="button" onClick={handlePrevPage} className="flex items-center justify-center">
              <Image
                src="/images/ui/back_page.webp"
                alt="Previous Page"
                width={50}
                height={50}
                className="object-contain p-0 lg:p-2 xl:p-0 ml-0 lg:ml-10 xl:ml-0"
              />
            </button>
          )}
        </div>

        {/* 3×2 Grid */}
        <div className="grid grid-cols-3 grid-rows-2 items-center justify-center z-10 gap-4">
          {currentStrips.map((strip) => {
            const isSelected = selectedStrip === strip.id;
            return (
              <button
                key={strip.id}
                type="button"
                className="relative inline-block group"
                onClick={() => onSelectStrip(strip.id)}
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
                      src={strip.icon}
                      alt={`${strip.alt} Strip Button`}
                      width={200}
                      height={50}
                      className={`pointer-events-none object-contain w-full h-full ${
                        isSelected ? "hidden" : "group-active:hidden xl:group-hover:hidden"
                      }`}
                    />
                    <Image
                      src={strip.hoverIcon}
                      alt={`${strip.alt} Strip Button Hover`}
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

        {/* Next Page Button */}
        <div className="flex items-center justify-center w-[10vw]">
          {currentPage < totalPages - 1 && (
            <button type="button" onClick={handleNextPage} className="flex items-center justify-center">
              <Image
                src="/images/ui/next_page.webp"
                alt="Next Page"
                width={50}
                height={50}
                className="object-contain p-0 lg:p-2 xl:p-0 mr-0 lg:mr-10 xl:mr-0"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
