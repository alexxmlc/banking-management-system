import React, { useEffect, useRef } from "react";
import Header from "./components/Header.jsx";

function AboutUs() {
  // background effect 
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
          duration: 2500,
          fill: "forwards",
        }
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <main
      className="relative min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden"
    >
      {/* BACKGROUND EFFECT */}
      <div id="blob" ref={blobRef} />
      <div id="blur" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="mx-auto w-full max-w-6xl px-4 py-10 min-h-[calc(100vh-80px)] flex items-center">
          <div className="grid gap-6 md:grid-cols-3 items-center w-full justify-items-center">
            <section className="md:col-span-2 space-y-6 w-full">
              {/* DESCRIERE*/}
              <div className="p-6 rounded-3xl border border-slate-700 bg-slate-900/40 shadow-xl">
                <h1 className="text-3xl font-semibold mb-3 text-indigo-200">
                  About PointBank
                </h1>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  PointBank is a modern banking experience built for
                  clarity, and security. We make sure your money is safe and easy to manage.
                </p>
                
              </div>

              {/* Contact */}
              <div className="p-6 rounded-3xl border border-slate-700 bg-slate-900/40 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-indigo-200">
                  Contact
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      Email
                    </div>
                    <div className="text-slate-100 font-medium mt-1">
                      support@pointbank.app
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      Phone
                    </div>
                    <div className="text-slate-100 font-medium mt-1">
                      +40 700 000 000
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      Head Office
                    </div>
                    <div className="text-slate-100 font-medium mt-1">
                      Cluj-Napoca, Romania
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-900/30 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                      Support
                    </div>
                    <div className="text-slate-100 font-medium mt-1">
                       Chat & Email
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href="mailto:support@pointbank.app"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-2xl border border-slate-700 bg-slate-900/30 hover:bg-slate-900/50 transition"
                  >
                    Contact Support
                  </a>
                </div>
              </div>

            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AboutUs;
