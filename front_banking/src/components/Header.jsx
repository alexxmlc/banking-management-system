import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div
        className="w-full 
                   mx-auto 
                   px-6 
                   py-4 
                   grid
                   grid-cols-3  
                   items-center"
      >
        {/* Logo */}
        <Link to="/" className="justify-self-start">
          <p
            className="text-[30px]
                       font-bold 
                       text-indigo-400/70"
          >
            Point<span className="text-violet-400">Bank</span>
          </p>
        </Link>

        {/* NAV */}
        <nav
          className="flex 
                     gap-10
                     text-[15px]
                     justify-self-center"
        >
          {["About us", "Services", "Cards", "Contact"].map((label) => (
            <button
              key={label}
              type="button"
              className="
                group
                relative
                inline-flex
                items-center
                justify-center
                text-[15px]
                font-sans
                px-4 
                py-2.5
                rounded-full 
                border 
                border-indigo-400/70
                bg-slate-900/80 
                text-indigo-100
                backdrop-blur-xl
                shadow-md
                hover:shadow-indigo-400/40
                hover:-translate-y-0.5
                hover:scale-[1.02]
                active:scale-95
                transition-all
                duration-500
                ease-out
                cursor-pointer
                overflow-hidden
              "
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
              <span className="relative z-10 font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
