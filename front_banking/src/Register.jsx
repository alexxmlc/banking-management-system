import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import { register as registerUser, uploadDocument } from "./services/authService";

function Register() {
  // Step 1: buletin
  const [docFile, setDocFile] = useState(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [extracted, setExtracted] = useState(null);

  // Step 2: date user
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [phone, setPhone]       = useState("");

  // Autofill din buletin (editabile)
  const [address, setAddress] = useState("");
  const [cnp, setCnp]         = useState("");

  // 2FA UI (doar checkbox in pagina asta)
  const [enable2fa, setEnable2fa] = useState(false);

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  //functie cu care schimbi pagina
  const navigate = useNavigate();

  //preview la imaginea de buletin
  const docPreviewUrl = useMemo(() => {
    return docFile ? URL.createObjectURL(docFile) : null;
  }, [docFile]);

  //extrag datele din poza de buletin
  const handleExtract = async () => {
    setError("");

    if (!docFile) {
      setError("Please select an ID photo first.");
      return;
    }

    setExtractLoading(true);
    try {
      //se scot datele din poza de buletin si le pun in variabila data
      const data = await uploadDocument(docFile);

      console.log("ExtractedData:", data);
      setExtracted(data);

      setCnp(String(data?.cnp || "").trim());
      setAddress(String(data?.address || "").trim());

    } catch (e) {
      setError(`Document upload/extraction failed: ${e.message}`);
    } finally {
      setExtractLoading(false);
    }
  };

  //functia care se ocupa cu inregistrarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //nu poti sa faci register fara upload la poza de buletin
    if (!extracted) {
      setError("Please upload your ID and extract data first.");
      return;
    }

    //asta e pentru validare de parola
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    //verific sa fie cnp (adica sa aiba 13 caractere)
    if (!/^\d{13}$/.test(cnp)) {
      setError("CNP must be exactly 13 digits.");
      return;
    }

    setLoading(true);
    try {

      //aici ce date se asteapta din backend
      await registerUser({
        id: cnp,
        username,
        email,
        password,
        phoneNumber: phone,
        address,
      });

      //daca se bifeaza 2fa => user trimis la pagina de 2fa
      if (enable2fa) {
        navigate("/2fa/setup", { state: { userId: cnp } });
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Header />

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-slate-900/80 border border-indigo-400/40 rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-semibold mb-2 text-indigo-200">
            Create your account
          </h1>
          <p className="text-sm text-slate-300 mb-6">
            Step 1: Upload ID photo to auto-fill. Step 2: Choose your login details.
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/60 px-4 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* STEP 1: Upload buletin */}
          <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4">
            <h2 className="text-sm font-semibold text-slate-200 mb-3">
              Step 1 — Upload your ID
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDocFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-200
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-400 file:text-slate-950
                         hover:file:bg-indigo-300"
            />

            {docPreviewUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-700">
                <img
                  src={docPreviewUrl}
                  alt="ID preview"
                  className="w-full max-h-64 object-contain bg-slate-950"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleExtract}
              disabled={extractLoading || !docFile}
              className="mt-3 w-full px-4 py-2.5 rounded-full bg-indigo-400 text-slate-950 text-sm font-semibold
                         hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed
                         transition border border-indigo-300 shadow-lg shadow-indigo-500/20"
            >
              {extractLoading ? "Extracting..." : "Upload & Extract data"}
            </button>

            {extracted && (
              <p className="mt-2 text-xs text-slate-300">
                ✅ Extracted. Review/edit the fields below.
              </p>
            )}
          </div>

          {/* STEP 2: Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Autofilled */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Address (from ID)
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!extracted}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                           disabled:opacity-60"
                placeholder="Auto-filled after upload"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                CNP (from ID)
              </label>
              <input
                type="text"
                required
                value={cnp}
                onChange={(e) => setCnp(e.target.value)}
                inputMode="numeric"
                maxLength={13}
                disabled={!extracted}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                           disabled:opacity-60"
                placeholder="13 digits"
              />
              <p className="mt-1 text-xs text-slate-400">
                CNP must be 13 digits.
              </p>
            </div>

            {/* User fields */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="your.username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Phone number
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="+40 7xx xxx xxx"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Password
                </label>
                <input
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
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Confirm password
                </label>
                <input
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

            {/* 2FA toggle */}
            <label className="flex items-center gap-3 select-none text-sm text-slate-200">
              <input
                type="checkbox"
                checked={enable2fa}
                onChange={(e) => setEnable2fa(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-950"
              />
              Enable 2FA after registration
            </label>

            <button
              type="submit"
              disabled={loading || !extracted}
              className="mt-2 w-full px-4 py-2.5 rounded-full bg-indigo-400 text-slate-950 text-sm font-semibold
                         hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed
                         transition border border-indigo-300 shadow-lg shadow-indigo-500/20"
            >
              {loading ? "Creating your account..." : "Create account"}
            </button>

            {!extracted && (
              <p className="text-xs text-slate-400">
                Upload your ID first to enable registration.
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

export default Register;
