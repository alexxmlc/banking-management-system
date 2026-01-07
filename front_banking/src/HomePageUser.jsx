import React from 'react';
import HeaderUser from './components/HeaderUser.jsx';
import { useEffect, useRef } from "react";
import Notifications from './Notifications.jsx';

function HomePageUser(){
    //background effect for page
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

    return(
        //MAIN        
        <main
            className="relative
                    min-h-screen 
                     bg-slate-950 
                     text-white 
                    flex 
                    flex-col
                    overflow-hidden"
        >
            {/*BACKGROUND EFFECT*/}
            <div id="blob" 
                ref={blobRef} 
            />
            <div id="blur"/>

            {/*HEADER*/}
            <div className="relative z-10 flex flex-col">
        
            <HeaderUser />
            {/* PAGE CONTENT */}
            <div className="mx-auto w-full max-w-6xl px-4 pt-10">
                <div className="grid gap-6 md:grid-cols-3 items-start">
    
                {/* NOTIFICARI */}
                <div className="md:col-span-2 flex justify-start">
                    <div className="w-full max-w-2xl">
                        <Notifications />
                    </div>
                </div>

                {/* CATCH-PHRASE */}
                <aside className="md:col-span-1">
                    <div className="p-6 rounded-3xl border border-slate-700 bg-slate-900/40 shadow-xl">
                        <h1 className="text-3xl font-semibold mb-4 text-indigo-200">
                            Time is money.
                        </h1>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                            See it, move it, and protect it — all your accounts in one secure, real-time dashboard.
                        </p>
                    </div>
                </aside>

            </div>
            </div>     
            </div>
        </main>
    );
}

export default HomePageUser;