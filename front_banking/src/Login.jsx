import { useState } from "react";
import Header from "./components/Header.jsx";
import { login } from "./services/authService";

function Login() {
  const [username, setUsername] = useState(""); // backend expects username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(username, password);
      console.log("Login success:", data);

      // store token + user if you want to keep the user logged in
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      // TODO: redirect to dashboard or main page after login
      // e.g. useNavigate from react-router, but we keep it simple for now
      // navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen 
                 bg-slate-950 
                 text-white 
                 flex 
                 flex-col"
    >
      <Header />

      {/* Page content */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900/80 border border-indigo-400/40 rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold mb-2 text-indigo-200">
            Log in to your account
          </h1>
          <p className="text-sm text-slate-300 mb-6">
            See, move, and protect your money in one dashboard.
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full px-4 py-2.5 rounded-full bg-indigo-400 text-slate-950 text-sm font-semibold
                         hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed
                         transition border border-indigo-300 shadow-lg shadow-indigo-500/20"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
