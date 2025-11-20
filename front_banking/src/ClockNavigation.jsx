import clockImg from "./assets/clock.png";

function ClockNavigation() {
  const navItems = [
    // tweak top/left to fine-tune positions
    { label: "About us", href: "#about-us", top: -200, left: 10 },
    { label: "Services", href: "#services", top: 0, left: 150 },
    { label: "Cards", href: "#cards", top: 200, left: 150 },
    { label: "Contact", href: "#contact", top: 400, left: 10 },
  ];

  return (
    //aici sunt doua div-uri [CLOCK] [NAVIGATION]
    <div className="flex 
                    items-center ">
      {/* CLOCK */}
      <div className="w-[30rem]
                      aspect-square">
        <img
          src={clockImg}
          alt="Clock"
          className="w-full
                     h-full 
                     object-contain 
                     origin-center 
                     will-change-transform 
                     transition-transform 
                     duration-700 
                     ease-linear 
                     hover:rotate-[360deg]"
        />
      </div>

      {/* NAVIGATION*/}
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
      className="absolute 
                -translate-x-1/2 
                -translate-y-1/2 
                text-[17px] 
                font-sans
                px-4 
                py-2 
                rounded-full 
                bg-slate-900/80 
                border 
                border-emerald-500/60 
                hover:bg-emerald-500 
                hover:text-slate-950 transition"
      style={{
        top: `${item.top}px`,
        left: `${item.left}px`,
      }}
    >
      {item.label}
    </a>
  );
}

export default ClockNavigation;
