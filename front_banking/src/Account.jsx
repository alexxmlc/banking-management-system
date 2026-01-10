import {useEffect, useState, useRef} from "react";
import { getMyAccounts, createAccount } from "./services/authService.js";
import HeaderUser from "./components/HeaderUser.jsx";


function Account(){
    //BACKGROUND EFFECT
    const blobRef = useRef(null);
    useEffect(() => {
        const handlePointerMove = (event) => {
            const { clientX, clientY} = event;
            if(!blobRef.current) return;

            blobRef.current.animate(
                {left: `${clientX}px`, top: `${clientY}px`},
                {duration: 2500, fill: "forwards"}
            );
        };

        window.addEventListener("pointermove", handlePointerMove);
        return () => window.removeEventListener("pointermove", handlePointerMove);
    }, []);

    //STATES
    const [accounts, setAccounts] = useState([]);
    const [currency, setCurrency] = useState("EUR");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [creating, setCreating] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    //FUNCTII

    //LOAD PENTRU ACCOUNTS
    async function load(){
        try{
            setLoading(true);
            setErr("");

            const data = await getMyAccounts();
            setAccounts(Array.isArray(data) ? data : []);

        }catch(e){
            setErr(e.message || "Failed to load accounts");
        
        }finally{
            setLoading(false);
        }
    }

    //USE EFFECT
    useEffect(() => {
        load();
    }, []);


    //FUNCTIE DE CREATE ACCOUNT
    async function onCreate(){
        try{
            setErr("");
            setCreating(true);

            await createAccount(currency);
            await load();

            setShowCreate(false); //asta ii sa ascund formularu dupa succes

        }catch(e){

            setErr(e.message || "Failed to create account");
        }finally{
            setCreating(false);
        }
    }

    //if (loading) return <div className = "p-6">Loading ... </div>;


    
    return(
        <main
      className="relative min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden"
    >
      {/* BACKGROUND EFFECT */}
      <div id="blob" ref={blobRef} />
      <div id="blur" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col">
        <HeaderUser />

        <div className="mx-auto w-full max-w-6xl px-4 flex-1 flex items-center justify-center">
            <div className="w-full max-w-3xl">
            {/* CARDUL CU ACCOUNTS */}
            <section className="md:col-span-2">
              <div className="p-6 rounded-3xl border border-slate-700 bg-slate-900/40 shadow-xl">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h1 className="text-2xl font-semibold text-indigo-200">
                    Your Accounts
                  </h1>

                  <button
                    onClick={() => setShowCreate((v) => !v)}
                    disabled={creating}
                    className="
                      px-4 py-2 rounded-full
                      border border-indigo-400/70
                      bg-slate-900/60
                      text-indigo-100
                      backdrop-blur-xl
                      shadow-md
                      hover:shadow-indigo-400/40
                      hover:-translate-y-0.5
                      active:scale-95
                      transition-all duration-500 ease-out
                      disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md
                    "
                  >
                    {showCreate ? "Close" : "Create another account"}
                  </button>
                </div>

                {err && (
                  <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-200">
                    {err}
                  </div>
                )}

                {loading ? (
                  <div className="text-slate-300">Loading...</div>
                ) : (
                  <>
                    {(showCreate || accounts.length === 0) && (
                      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
                        <p className="mb-3 text-slate-200">
                          {accounts.length === 0
                            ? "You don't have an account yet."
                            : "Create a new account:"}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            disabled={creating}
                            className="
                              w-full sm:w-auto
                              border border-slate-700
                              bg-slate-950/60
                              text-white
                              rounded-xl px-4 py-2
                              outline-none
                            "
                          >
                            <option value="EUR">EUR</option>
                            <option value="RON">RON</option>
                            <option value="USD">USD</option>
                          </select>

                          <button
                            onClick={onCreate}
                            disabled={creating}
                            className="
                              w-full sm:w-auto
                              px-4 py-2 rounded-xl
                              bg-emerald-600 text-white
                              hover:bg-emerald-500
                              transition
                              disabled:opacity-60
                            "
                          >
                            {creating ? "Creating..." : "Create account"}
                          </button>
                        </div>
                      </div>
                    )}

                    {accounts.length > 0 ? (
                      <div className="space-y-3">
                        {accounts.map((a) => (
                          <div
                            key={a.id}
                            className="rounded-2xl border border-slate-700 bg-slate-950/40 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-400">
                                  IBAN
                                </p>
                                <p className="font-mono text-slate-100 break-all">
                                  {a.iban}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-xs uppercase tracking-widest text-slate-400">
                                  Balance
                                </p>
                                <p className="text-xl font-semibold text-indigo-100">
                                  {a.balance}{" "}
                                  <span className="text-sm text-slate-300">
                                    {a.currency}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      !showCreate && (
                        <div className="text-slate-300">
                          No accounts found.
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
    );
}

export default Account;