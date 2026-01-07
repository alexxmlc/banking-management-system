import { useState } from "react";
import Header from "./components/Header.jsx";
import { login } from "./services/authService";
import { useEffect, useRef } from "react";
import {useNavigate} from "react-router-dom";


function Login() {
  //efect pentru background (blur colorat dupa mouse movement)
  const blobRef = useRef(null);

  useEffect(() => {

    //fac event handler pe mouse (pointer de movement)
    const handlePointerMove = (event) => {
      //coordonatele mouse-ului
      const {clientX, clientY} = event;

      if(!blobRef.current) return;

      blobRef.current.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`
        },
        {
          duration: 2500, //smooth follow
          fill: "forwards",
        }
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);


  }, [])
  
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //pentru 2FA
  const [code, setCode] = useState("");
  const [need2fa, setNeed2fa] = useState(false);

  //NAVIGARE LA HOME PAGE PENTRU USER
  const navigateHome = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //opreste refresh la pagina dupa submit
    setError("");
    setLoading(true); //porneste starea de loading

    try {
      //scot spatiile din codul 2FA daca e cazul
      const normalizedCode = need2fa ? code.replace(/\s+/g, "") : undefined;

      //TOKEN

      //astept dupa backend
      const data = await login(username, password, normalizedCode);

      console.log("Login success:", data);

      //salvez tokenul si userul in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      //dupa ce login a avut succes => home page pentru user
      navigateHome("/user/home");

    } catch (err) {

      //compun mesajul de eroare in functie de situatie
      const msg = err?.message || "Login failed";
      console.error(err);

      //verific daca e nevoie de 2FA sau altceva
      if (msg.includes("2FA code required")){
        setNeed2fa(true);
        setError("Enter your 2FA code from the authenticator app.");

      }else if(msg.includes("Invalid 2FA code")){
        setNeed2fa(true);
        setError("Invalid 2FA code. Please try again.");
      }else{
        setNeed2fa(false);
        setError("Invalid username or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  

  return (
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

      {/*Content*/}
      <div className="relative z-10 flex flex-col">
      <Header />

      {/* Page content */}
      <div className="flex flex-1 items-center justify-center px-4 pt-32">
        <div className="w-full max-w-md bg-slate-900/80 border border-indigo-400/40 rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold mb-2 text-indigo-200">
            Log in to your account
          </h1>
          <p className="text-sm text-slate-300 mb-6">
            See, move, and protect your money in one dashboard.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/60 px-4 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                //actualizez state-ul la schimbare
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="your.username"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="••••••••"
              />
            </div>

            {/* field pentru 2FA care se afiseaza doar cand e nevoie*/}
            {need2fa && (
              <div>
                <label
                     htmlFor="code"
                      className="block text-sm font-medium text-slate-200 mb-1"
                >
                  2FA Code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  placeholder="123456"
                   required
                />
              </div>
            )}


            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full px-4 py-2.5 rounded-full bg-indigo-400 text-slate-950 text-sm font-semibold
                         hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed
                         transition border border-indigo-300 shadow-lg shadow-indigo-500/20"
            >
              {loading ? "Logging in..." : need2fa ? "Verify & log in" : "Log in"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </main>
  );
}

export default Login;
