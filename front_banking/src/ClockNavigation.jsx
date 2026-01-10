
function ClockNavigation() {
  const navItems = [
    { label: "About us", href: "/about", top: -100, left: 80 },
    { label: "Services", href: "/home/services", top: 100, left: 150 },
    { label: "FindUs", href: "#cards", top: 300, left: 80 },
  ];

  return (
    // [CLOCK] [NAVIGATION]
    <div
      className="mt-16 md:mt-24
                 flex 
                 items-center"
    >
      {/* CLOCK */}
      <div
        className="group
                   relative
                   w-[35rem]
                   aspect-square
                   flex
                   items-center
                   justify-center"
      >
        {/* Outer neon ring */}
        <div
          className="absolute
                     inset-0
                     rounded-full
                     border-[8px]
                     border-indigo-400/80
                     shadow-[0_0_50px_rgba(129,140,248,0.9)]"
        />

        {/* Soft outer glow */}
        <div
          className="absolute
                     inset-10
                     rounded-full
                     bg-indigo-400/20
                     blur-3xl"
        />

        {/* Inner clock face */}
        <div
          className="relative
                     w-[70%]
                     h-[70%]
                     rounded-full
                     bg-slate-950/90
                     border
                     border-indigo-300/50
                     shadow-[0_0_40px_rgba(129,140,248,0.7)]
                     flex
                     items-center
                     justify-center"
        >
          {/* Point Bank text */}
          <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-8">
            <p
              className="
                text-xl
                md:text-2xl
                font-semibold
                tracking-[0.35em]
                uppercase
                text-indigo-100
                drop-shadow-[0_0_8px_rgba(129,140,248,0.9)]
              "
            >
              POINT<span className="text-violet-300">BANK</span>
            </p>
          </div>

          {/* Hands wrapper – this whole thing spins on hover */}
          <div
            className="relative
                       w-[65%]
                       h-[65%]
                       origin-center
                       transition-transform
                       duration-700
                       ease-linear
                       group-hover:rotate-[360deg]"
          >
            {/* Minute hand */}
            <div
              className="absolute
                         top-1/2
                         left-1/2
                         h-[45%]
                         w-[3px]
                         -translate-x-1/2
                         -translate-y-full
                         rounded-full
                         bg-indigo-200
                         shadow-[0_0_14px_rgba(191,219,254,0.9)]"
            />

            {/* Hour hand (shorter + slightly rotated) */}
            <div
              className="absolute
                         top-1/2
                         left-1/2
                         h-[30%]
                         w-[4px]
                         -translate-x-1/2
                         -translate-y-full
                         rounded-full
                         bg-indigo-100
                         shadow-[0_0_10px_rgba(199,210,254,0.9)]
                         rotate-[30deg]"
            />

            {/* Center dot */}
            <div
              className="absolute
                         top-1/2
                         left-1/2
                         -translate-x-1/2
                         -translate-y-1/2
                         h-4
                         w-4
                         rounded-full
                         bg-indigo-300
                         shadow-[0_0_18px_rgba(129,140,248,1)]"
            />
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="relative w-64 h-64">
        {navItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

function NavItem({ item }) {
  return (
    <a
      href={item.href}
      className="
        group
        absolute
        -translate-x-1/2
        -translate-y-1/2
        inline-flex
        items-center
        justify-center
        text-[17px]
        font-sans
        px-5
        py-2.5
        rounded-full
        border
        border-indigo-400/70
        bg-gradient-to-br
        from-indigo-500/20
        via-slate-900/80
        to-slate-950
        backdrop-blur-xl
        shadow-lg
        hover:shadow-indigo-400/40
        hover:-translate-y-1
        hover:scale-[1.02]
        active:scale-95
        transition-all
        duration-500
        ease-out
        cursor-pointer
        overflow-hidden
        text-indigo-100
        hover:text-slate-950
      "
      style={{
        top: `${item.top}px`,
        left: `${item.left}px`,
      }}
    >
      {/* moving shine stripe */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-r
          from-transparent
          via-indigo-300/30
          to-transparent
          -translate-x-full
          group-hover:translate-x-full
          transition-transform
          duration-1000
          ease-out
        "
      />

      {/* subtle glow on hover */}
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

      {/* label */}
      <span className="relative z-10 font-medium">{item.label}</span>
    </a>
  );
}

export default ClockNavigation;
