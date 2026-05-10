"use client";
import Image from "next/image";
function KarvanRoad() {
  return (
    <div className="w-full flex flex-col p-4 gap-10">
      <h1 className="text-2xl font-bold text-center lg:text-right lg:mr-19 text-grayScale">
        تاریخچه موکب
      </h1>
      <Image
        src="/Road.png"
        alt="karvan-road"
        width={1296}
        height={252}
        className="object-cover lg:block hidden mx-auto"
      />
      <Image
        src="/MobileRoad.png"
        alt="karvan-road"
        width={1296}
        height={252}
        className="object-cover lg:hidden max-w-87.5 mx-auto"
      />
    </div>
  );
}

export default KarvanRoad;
