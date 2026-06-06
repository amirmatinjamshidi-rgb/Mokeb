const lanternClass =
  "pointer-events-none absolute flex flex-col items-center";

/** Decorative lanterns shared by marketing / reservation heroes. */
export function HeroLanterns() {
  return (
    <>
      <div
        className={`${lanternClass} end-2 top-2 w-14 sm:end-4 sm:top-4 md:end-[15px] md:-top-[23px] md:w-[134px]`}
        aria-hidden
      >
        <div className="hidden h-[92px] w-px bg-gradient-to-b from-transparent via-white/40 to-transparent md:block md:h-[172px]" />
        <div className="mt-1 size-14 shrink-0 rounded-full border-2 border-[#DBBC59]/50 bg-black/10 sm:size-20 md:-mt-10 md:size-[134px]" />
      </div>
      <div
        className={`${lanternClass} start-2 top-2 hidden w-14 sm:flex sm:start-4 sm:top-4 md:start-[15px] md:-top-[23px] md:w-[134px]`}
        aria-hidden
      >
        <div className="hidden h-[72px] w-px bg-gradient-to-b from-transparent via-white/40 to-transparent md:block md:h-[128px]" />
        <div className="mt-1 size-14 shrink-0 rounded-full border-2 border-[#DBBC59]/50 bg-black/10 sm:size-20 md:-mt-7 md:size-[134px]" />
      </div>
    </>
  );
}
