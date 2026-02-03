import Image from "next/image";
import Border from "../components/border";

export default function Home() {
  return (
    <>
      <Border />
      <main className="flex min-h-screen flex-col items-center p-15 sm:p-18 md:p-12 lg:p-24 pt-25 sm:pt-0 md:pt-5 lg:pt-30 bg-[#FDFDF5]">
        {/* Small Screen Size */}
        <div className="flex lg:hidden inset-0 items-center justify-center pointer-events-none z-10 pt-20 mb-8">
          <Image
            src="/mobile_booth.png"
            alt="Photobooth Small"
            width={600}
            height={300.948}
            priority
            className="pointer-events-auto w-[70vw] max-w-140 h-auto"
          />
        </div>

        <button className="lg:hidden relative group">
          <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-1 translate-y-1"></div>
          <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-3 px-6 hover:bg-[#E6CFCF] transition-colors">
            <Image
              src="/def_start.png"
              alt="Start Button"
              width={49}
              height={15}
              priority
              className="pointer-events-auto w-[49px] sm:w-[120px] md:w-[150px] h-auto"
            />
          </div>
        </button>

        {/* Middle Screen Size */}
        <div className="hidden lg:flex xl:hidden fixed inset-y-0 left-25 items-center justify-center pointer-events-none z-10">
          <Image
            src="/pc_title.png"
            alt="Photobooth Large"
            width={529.829}
            height={162.723}
            priority
            className="pointer-events-auto w-[40vw] max-w-530 h-auto"
          />
        </div>
        <div className="hidden lg:flex xl:hidden fixed inset-y-0 right-25 items-center justify-center pointer-events-none z-10">
          <Image
            src="/pc_booth.png"
            alt="Photobooth Large"
            width={554.039}
            height={621.22}
            priority
            className="pointer-events-auto w-[40vw] max-w-554 h-auto"
          />
        </div>

        {/* Large Screen Size */}
        <div className="hidden xl:flex fixed inset-y-0 left-25 items-center justify-center pointer-events-none z-10">
          <Image
            src="/pc_title.png"
            alt="Photobooth Large"
            width={800}
            height={162.723}
            priority
            className="pointer-events-auto w-[40vw] max-w-800 h-auto"
          />
        </div>
        <div className="hidden xl:flex fixed inset-y-0 right-25 items-center justify-center pointer-events-none z-10">
          <Image
            src="/pc_booth.png"
            alt="Photobooth Large"
            width={600}
            height={621.22}
            priority
            className="pointer-events-auto w-[40vw] max-w-600 h-auto"
          />
        </div>
      </main>
    </>
  );
}
