import { Link } from "react-router-dom";

function Header(){


    return(
        <header>

            <div className="w-full 
                            mx-auto 
                            px-6 
                            py-4 
                            grid
                            grid-cols-3  
                            items-center">
                <Link to = "/" className="justify-self-start">
                    <p className="text-[30px]
                                  font-bold 
                                  text-emerald-400">
                            PointBank
                    </p>
                </Link>
            

                <nav className="flex gap-16
                                space-x-4
                                text-[15px]
                                justify-self-center">

                    <button className=" text-[17px] 
                                        font-sans
                                        px-4 
                                        py-2 
                                        rounded-full 
                                        bg-slate-900/80 
                                        border 
                                        border-emerald-500/60 
                                        hover:bg-emerald-500 
                                        hover:text-slate-950 transition">
                        About us
                    </button>
                    <button className="text-[17px] 
                                        font-sans
                                        px-4 
                                        py-2 
                                        rounded-full 
                                        bg-slate-900/80 
                                        border 
                                        border-emerald-500/60 
                                        hover:bg-emerald-500 
                                        hover:text-slate-950 transition">
                        Services
                    </button>
                    <button className="text-[17px] 
                                        font-sans
                                        px-4 
                                        py-2 
                                        rounded-full 
                                        bg-slate-900/80 
                                        border 
                                        border-emerald-500/60 
                                        hover:bg-emerald-500 
                                        hover:text-slate-950 transition">
                        Cards
                    </button>
                    <button className="text-[17px] 
                                        font-sans
                                        px-4 
                                        py-2 
                                        rounded-full 
                                        bg-slate-900/80 
                                        border 
                                        border-emerald-500/60 
                                        hover:bg-emerald-500 
                                        hover:text-slate-950 transition">
                        Contact
                    </button>      
                </nav>
            </div>
        </header>
    );
}


export default Header