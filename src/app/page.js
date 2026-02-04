import Image from "next/image";
import Border from "../components/border";
import Link from "next/link";

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
        <Link href="/timer" className="lg:hidden relative group">
          <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-1 sm:translate-x-2 translate-y-1 sm:translate-y-2 group-active:bg-[#F2AEBD] transition-colors"></div>
          <div className="relative bg-[#F2DDDC] border-1 sm:border-2 border-[#3D568F] rounded-xl py-3 sm:py-3 md:py-4 px-7 sm:px-10 md:px-12 group-active:bg-[#3D568F] group-active:border-[#F2AEBD] transition-colors">
            <Image
              src="/def_start.png"
              alt="Start Button"
              width={49}
              height={15}
              priority
              className="pointer-events-none w-[14vw] sm:w-[14vw] md:w-[12vw] h-auto group-active:hidden"
            />
            <Image
              src="/hovered_start.png"
              alt="Start Button"
              width={200}
              height={15}
              priority
              className="pointer-events-none w-[14vw] sm:w-[14vw] md:w-[12vw] h-auto hidden group-active:block"
            />
          </div>
        </Link>
        {/* Middle Screen Size */}
        <div className="hidden lg:flex xl:hidden fixed inset-y-0 left-25 items-center justify-center pointer-events-none z-10">
          <div className="flex flex-col items-center gap-6 pointer-events-auto">
            <Image
              src="/pc_title.png"
              alt="Photobooth Large"
              width={529.829}
              height={162.723}
              priority
              className="pointer-events-auto w-[40vw] max-w-530 h-auto"
            />
            <Link href="/timer" className="hidden lg:flex xl:hidden relative group">
              <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-2 translate-y-2 group-hover:bg-[#F2AEBD] transition-colors"></div>
              <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-3 lg:py-4 px-6 lg:px-10 group-hover:bg-[#3D568F] group-hover:border-[#F2AEBD] transition-colors">
                <Image
                  src="/def_start.png"
                  alt="Start Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto w-[5vw] sm:w-[5vw] md:w-[10vw] lg:w-[8vw] h-auto group-hover:hidden"
                />
                <Image
                  src="/hovered_start.png"
                  alt="Start Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto w-[5vw] sm:w-[5vw] md:w-[10vw] lg:w-[8vw] h-auto hidden group-hover:block"
                />
              </div>
            </Link>
          </div>
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
          <div className="flex flex-col items-center gap-6 pointer-events-auto">
            <Image
              src="/pc_title.png"
              alt="Photobooth Large"
              width={800}
              height={162.723}
              priority
              className="pointer-events-auto w-[40vw] max-w-800 h-auto"
            />
            <Link href="/timer"className="hidden xl:flex relative group">
              <div className="absolute inset-0 bg-[#3D568F] rounded-xl translate-x-3 translate-y-3 group-hover:bg-[#F2AEBD] transition-colors"></div>
              <div className="relative bg-[#F2DDDC] border-2 border-[#3D568F] rounded-xl py-3 lg:py-6 px-6 lg:px-15 group-hover:bg-[#3D568F] group-hover:border-[#F2AEBD] transition-colors">
                <Image
                  src="/def_start.png"
                  alt="Start Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto w-[5vw] sm:w-[5vw] md:w-[10vw] lg:w-[8vw] h-auto group-hover:hidden"
                />
                <Image
                  src="/hovered_start.png"
                  alt="Start Button"
                  width={200}
                  height={15}
                  priority
                  className="pointer-events-auto w-[5vw] sm:w-[5vw] md:w-[10vw] lg:w-[8vw] h-auto hidden group-hover:block"
                />
              </div>
            </Link>
          </div>
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
