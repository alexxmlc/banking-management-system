import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get2faQrPng, verify2faCode } from "./services/authService";

export default function TwoFASetup() {
  //citeste datele trimise prin navigate
  const location = useLocation();
  
  //unde te redirectioneaza dupa succes
  const navigate = useNavigate();

  //primesti userId din state-ul locatiei
  const userId = location.state?.userId;

  //state-uri
  const [qrUrl, setQrUrl] = useState("");
  const [code, setCode] = useState("");
  const [loadingQr, setLoadingQr] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    let currentUrl = "";

    async function loadQr() {
      setError("");
      setInvalid(false);

      if (!userId) {
        setError("Missing userId for 2FA setup. Please register again.");
        setLoadingQr(false);
        return;
      }

      setLoadingQr(true);
      try {
        //astept qr din backend
        currentUrl = await get2faQrPng(userId);
        //il setez in state
        setQrUrl(currentUrl);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingQr(false);
      }
    }

    //bucla de incarcare a qr code-ului
    loadQr();

    return () => {
      //daca pagina se inchide sau se schimba userId => se elibereaza memoria
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [userId]); //ori de cate ori se chimba userId


  //verificare cod 2fa
  const onVerify = async () => {
    setError("");
    setInvalid(false);

    //verificare ca codul sa aiba fix 6 cifre
    if (!/^\d{6}$/.test(code)) {
      setError("Code must be 6 digits.");
      return;
    }

    setVerifying(true);
    try {
      //verific codul in backend
      const ok = await verify2faCode(userId, code);
      if (!ok) {
        setInvalid(true);
        return;
      }
      //daca e ok => du-l la login
      navigate("/login");
    } catch (e) {
      setError(e.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/80 border border-indigo-400/40 rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-indigo-200">2FA Setup</h1>
        <p className="text-sm text-slate-300 mt-2">
          Scan the QR code with Google Authenticator / Authy, then enter the 6-digit code.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/60 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {loadingQr ? (
          <p className="mt-6 text-slate-300">Generating QR...</p>
        ) : qrUrl ? (
          <div className="mt-6 flex flex-col items-center gap-4">
            <img
              src={qrUrl}
              alt="2FA QR Code"
              className="bg-white p-3 rounded-2xl"
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-slate-200 mb-1">
                6-digit code
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="123456"
              />
              {invalid && (
                <p className="mt-2 text-sm text-red-200">
                  Invalid code. Try again.
                </p>
              )}
            </div>

            <button
              onClick={onVerify}
              disabled={verifying}
              className="w-full px-4 py-2.5 rounded-full bg-indigo-400 text-slate-950 text-sm font-semibold
                         hover:bg-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {verifying ? "Verifying..." : "Verify & Finish"}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
