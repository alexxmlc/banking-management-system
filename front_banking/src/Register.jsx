import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import { register as registerUser } from "./services/authService";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");

  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Parolele nu coincid.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        username,
        email,
        password,
        phoneNumber: phone,
        address,
      });

      // după ce s-a creat contul, îl poți trimite pe login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Înregistrarea a eșuat. Verifică datele și încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Header />

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-lg bg-slate-900/80 border border-indigo-400/40 rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold mb-2 text-indigo-200">
            Creează-ți un cont
          </h1>
          <p className="text-sm text-slate-300 mb-6">
            Deschide-ți contul PointBank ca să vezi și să gestionezi toate finanțele într-un singur loc.
          </p>

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
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="your.username"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="you@example.com"
              />
            </div>

            {/* Telefon */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Număr de telefon
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="07xx xxx xxx"
              />
            </div>

            {/* Adresă */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Adresă
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Str. Exemplu nr. 10"
              />
            </div>

            {/* Parolă */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200 mb-1"
                >
                  Parolă
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

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-slate-200 mb-1"
                >
                  Confirmă parola
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Buton submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full px-4 py-2.5 rounded-full bg-indigo-400 text-slate-950 text-sm font-semibold
                         hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed
                         transition border border-indigo-300 shadow-lg shadow-indigo-500/20"
            >
              {loading ? "Se creează contul..." : "Creează cont"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;
