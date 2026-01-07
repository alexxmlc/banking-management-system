import React, { useEffect, useRef } from "react";
import Header from "./components/Header.jsx";

function AboutUs() {
  // background effect for page (same as HomePage)
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

      {/* HEADER + CONTENT */}
      <div className="relative z-10 flex flex-col">
        <Header />

        <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-14">
          <div className="grid gap-6 md:grid-cols-3 items-start">
            {/* LEFT CONTENT */}
            <section className="md:col-span-2 space-y-6">
              {/* Short description */}
              <div className="p-6 rounded-3xl border border-slate-700 bg-slate-900/40 shadow-xl">
                <h1 className="text-3xl font-semibold mb-3 text-indigo-200">
                  About PointBank
                </h1>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  PointBank is a modern, neon-inspired banking experience built for speed,
                  clarity, and security. We focus on clean UX, real-time updates, and smarter
                  controls so your money is always easy to track and manage.
                </p>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-3">
                  Whether you’re managing personal finances or scaling a business, our goal is to
                  keep everything simple, transparent, and premium-feeling.
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
                      24/7 · Chat & Email
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

              {/* Partners */}
              <div className="p-6 rounded-3xl border border-slate-700 bg-slate-900/40 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-indigo-200">
                  Partners
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { name: "NovaShield Security", tag: "Fraud & Risk" },
                    { name: "AetherPay Networks", tag: "Payments" },
                    { name: "CloudMint Analytics", tag: "Insights" },
                    { name: "LumenKYC Systems", tag: "Compliance" },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-slate-700 bg-slate-900/30"
                    >
                      <div className="font-medium text-slate-100">{p.name}</div>
                      <span className="text-xs px-2 py-1 rounded-full border border-slate-600 text-slate-300">
                        {p.tag}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-slate-400 text-sm">
                  *Partners are demo entities for UI showcase.
                </p>
              </div>
            </section>

            {/* RIGHT ASIDE */}
            <aside className="md:col-span-1">
              <div className="p-6 rounded-3xl border border-slate-700 bg-slate-900/40 shadow-xl">
                <h2 className="text-2xl font-semibold mb-3 text-indigo-200">
                  Built for clarity
                </h2>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Real-time notifications, a clean dashboard, and premium account options — without
                  the noise.
                </p>

                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Security</span>
                    <span className="text-slate-100 font-medium">Bank-grade</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Experience</span>
                    <span className="text-slate-100 font-medium">Neon clean</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Support</span>
                    <span className="text-slate-100 font-medium">Always on</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AboutUs;
