import { useEffect, useRef } from "react";
import Header from "./components/Header.jsx";
import { Link } from "react-router-dom";

function ServicesHome() {
  const blobRef = useRef(null);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const { clientX, clientY } = event;
      if (!blobRef.current) return;

      blobRef.current.animate(
        { left: `${clientX}px`, top: `${clientY}px` },
        { duration: 2500, fill: "forwards" }
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const services = [
    { title: "Instant Transfers", icon: "↗" },
    { title: "Multiple Accounts", icon: "⎔" },
    { title: "Deposit Funds", icon: "＋" },
    { title: "Withdraw Funds", icon: "−" },
  ];

  return (
    <main className="relative min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* BACKGROUND EFFECT */}
      <div id="blob" ref={blobRef} />
      <div id="blur" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* CONTENT */}
        <div className="flex flex-1 items-center justify-center px-4 pt-28 pb-10">
          <div className="w-full max-w-3xl bg-slate-900/80 border border-indigo-400/40 rounded-3xl shadow-xl p-8">
            
            {/* HERO TEXT */}
            <h1 className="text-2xl md:text-3xl font-semibold text-indigo-200">
              Time is money. Save both.
            </h1>

            <p className="text-sm text-slate-300 mt-2 mb-8 max-w-2xl">
              Manage transfers, accounts, deposits and withdrawals!
            </p>

            {/* SERVICES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="
                    group relative rounded-2xl
                    bg-slate-950/60 border border-slate-700
                    p-6
                    hover:border-indigo-400/50 hover:bg-slate-950/70
                    transition duration-300
                  "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
                        w-11 h-11 rounded-xl flex items-center justify-center
                        bg-indigo-500/10 border border-indigo-400/30
                        text-indigo-200
                      "
                      aria-hidden="true"
                    >
                      <span className="text-lg">{s.icon}</span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-100">
                      {s.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* PARTEA DE CREATE ACCOUNT SI LOGIN DACA AI CONT */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="w-full">
                <button
                  className="
                    w-full px-4 py-2.5 rounded-full
                    bg-indigo-400 text-slate-950 text-sm font-semibold
                    hover:bg-indigo-300 transition
                    border border-indigo-300 shadow-lg shadow-indigo-500/20
                  "
                >
                  Create your account
                </button>
              </Link>

              <Link to="/login" className="w-full">
                <button
                  className="
                    w-full px-4 py-2.5 rounded-full
                    bg-slate-950/60 text-indigo-200 text-sm font-semibold
                    border border-indigo-400/40
                    hover:border-indigo-300 hover:bg-slate-950/70
                    transition
                  "
                >
                  I already have an account
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ServicesHome;
