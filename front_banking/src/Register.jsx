// src/Register.jsx (or src/pages/Register.jsx)
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
      setError("Passwords do not match.");
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

      // After successful registration, redirect to login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your information and try again.");
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
            Create your account
          </h1>
          <p className="text-sm text-slate-300 mb-6">
            Open your PointBank account to see and manage all your finances in one place.
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

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Phone number
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="+40 7xx xxx xxx"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Street, number, city"
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-slate-200 mb-1"
                >
                  Confirm password
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

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full px-4 py-2.5 rounded-full bg-indigo-400 text-slate-950 text-sm font-semibold
                         hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed
                         transition border border-indigo-300 shadow-lg shadow-indigo-500/20"
            >
              {loading ? "Creating your account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;
