import ClockNavigation from "./ClockNavigation";

function Home() {
  return (
    <main className="min-h-screen 
                    bg-slate-950 
                    text-white 
                    flex flex-col">
      {/* HEADER */}
      <header className="w-full">

        <div className="w-full 
                        mx-auto 
                        px-6 
                        py-4 
                        flex items-center 
                        justify-between">

          <div className="text-[30px]
                          font-bold ">

            <p className="text-emerald-400">PointBank</p>
          </div>

          <div className="space-x-4">

            <button className="px-4 py-2 
                                rounded-full 
                                border 
                                border-emerald-400 
                                text-[15px] 
                                hover:bg-emerald-400/10 
                                transition">
              Login
            </button>
            
            <button className="px-4 py-2 
                               rounded-full 
                               bg-emerald-400 
                               text-slate-950 
                               text-[15px] 
                               font-semibold 
                               hover:bg-emerald-300 
                               transition">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <section className="flex-1 
                          flex 
                          items-center">

        <div className="max-full
                        px-6 
                        flex 
                        items-center
                        gap-16
                        justify-start">
          <ClockNavigation />

          {/* CATCH-PHRASE*/}
          <div className="hidden 
                          md:block 
                          ml-[80px]
                          max-w-md">

            <h1 className="text-3xl 
                            md:text-4xl 
                            font-semibold mb-4">
              Time is money.
            </h1>
            <p className="text-slate-300 
                          text-sm 
                          md:text-base">

              See it, move it, and protect it — all your accounts in one secure, real-time dashboard.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
