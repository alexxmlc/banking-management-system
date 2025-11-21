import { useEffect, useRef } from "react";
import ClockNavigation from "./ClockNavigation";
import { Link } from "react-router-dom";

function Home() {
  const blobRef = useRef(null);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const { clientX, clientY } = event;

      if (!blobRef.current) return;

      blobRef.current.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        {
          duration: 2500, // smooth follow
          fill: "forwards",
        }
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <main
      className="relative 
                 min-h-screen 
                 bg-slate-950 
                 text-white 
                 flex flex-col 
                 overflow-hidden"
    >
      {/* BACKGROUND EFFECT */}
      <div id="blob" ref={blobRef} />
      <div id="blur" />

      {/* ALL REAL CONTENT ABOVE THE EFFECT */}
      <div className="relative z-10">
        {/* HEADER */}
        <header className="w-full">
          <div
            className="w-full 
                       mx-auto 
                       px-6 
                       py-4 
                       flex items-center 
                       justify-between"
          >
            <div
              className="text-[30px]
                         font-bold "
            >
              <Link to="/" className="justify-self-start">
                <p
                  className="text-[30px]
                             font-bold 
                             text-indigo-400/70"
                >
                   Point<span className="text-violet-400">Bank</span>
                </p>
              </Link>
            </div>

            <div className="space-x-4">
              {/* LOGIN */}
              <Link to="/login">
                <button
                  className="
                    group
                    relative
                    inline-flex
                    items-center
                    justify-center
                    px-5
                    py-2.5
                    rounded-full
                    border
                    border-indigo-400/70
                    bg-indigo-500/5
                    text-[15px]
                    text-indigo-200
                    backdrop-blur-lg
                    overflow-hidden
                    shadow-md
                    hover:shadow-indigo-500/40
                    hover:-translate-y-0.5
                    hover:scale-[1.02]
                    active:scale-95
                    transition-all
                    duration-500
                    ease-out
                    cursor-pointer
                  "
                >
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-r
                      from-transparent
                      via-emerald-300/30
                      to-transparent
                      -translate-x-full
                      group-hover:translate-x-full
                      transition-transform
                      duration-1000
                      ease-out
                    "
                  />
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-full
                      bg-gradient-to-r
                      from-indigo-500/10
                     via-violet-400/20
                     to-indigo-500/10
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      duration-500
                    "
                  />
                  <span className="relative z-10 font-medium">
                    Login
                  </span>
                </button>
              </Link>

              {/* REGISTER */}
              <Link to="/register">
                <button
                  className="
                    group
                    relative
                    inline-flex
                    items-center
                    justify-center
                    px-5
                    py-2.5
                    rounded-full
                    text-[15px]
                    font-semibold
                    bg-gradient-to-br
                     from-indigo-500/10
                     via-violet-400/20
                     to-indigo-500/10
                    shadow-lg
                    hover:shadow-indigo-500/50
                    hover:-translate-y-0.5
                    hover:scale-[1.02]
                    active:scale-95
                    transition-all
                    duration-500
                    ease-out
                    overflow-hidden
                    cursor-pointer
                  "
                >
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-r
                      from-transparent
                      via-white/40
                      to-transparent
                      -translate-x-full
                      group-hover:translate-x-full
                      transition-transform
                      duration-1000
                      ease-out
                    "
                  />
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-full
                      bg-gradient-to-r
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      duration-500
                    "
                  />
                  <span className="relative z-10">
                    Register
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <section
          className="flex-1 
                     flex 
                     items-center"
        >
          <div
            className="max-full
                       px-6 
                       flex 
                       items-center
                       gap-16
                       justify-start"
          >
            <ClockNavigation />

            {/* CATCH-PHRASE*/}
            <div
              className="hidden 
                         md:block 
                         ml-[300px]
                         max-w-md"
            >
              <h1
                className="text-3xl 
                           md:text-4xl 
                           font-semibold mb-4"
              >
                Time is money.
              </h1>
              <p
                className="text-slate-300 
                           text-sm 
                           md:text-base"
              >
                See it, move it, and protect it — all your accounts in one secure, real-time dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
