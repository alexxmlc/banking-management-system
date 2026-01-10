import { useState, useEffect, useRef } from "react";
import HeaderUser from "./components/HeaderUser.jsx";
import {
    createAccount,
    getMyAccounts,
    transferMoney,
    depositMoney,
    withdrawMoney,
} from "./services/authService.js";

const InputField = ({ label, name, type = "text", placeholder, value, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange} // Pass the handler as a prop
            placeholder={placeholder}
            className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
        />
    </div>
);

const AccountSelect = ({ label, name, value, accounts, onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange} // Pass the handler as a prop
            className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        >
            {accounts.map((acc) => (
                <option key={acc.id} value={acc.iban}>
                    {acc.iban} ({acc.balance} {acc.currency})
                </option>
            ))}
        </select>
    </div>
);

export default function ServicesAccount() {
    // current tab: create, transfer, deposit, withdraw
    const [activeTab, setActiveTab] = useState("create");

    // users account list 
    const [accounts, setAccounts] = useState([]);

    // forms data
    const [formData, setFormData] = useState({
        currency: "RON",
        amount: "",
        fromIban: "",
        toIban: "",
        targetIban: "",
    });

    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    // effects
    // blob anmation
    const blobRef = useRef(null);
    useEffect(() => {
        const handlePointerMove = (event) => {
            const { clientX, clientY } = event;
            if (!blobRef.current) return;
            blobRef.current.animate(
                { left: `${clientX}px`, top: `${clientY}px` },
                { duration: 2500, fill: "forwards" }
            );
        };
        window.addEventListener("pointermove", handlePointerMove);
        return () => window.removeEventListener("pointermove", handlePointerMove);
    }, []);

    // load accounts when users enters the page
    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const data = await getMyAccounts();
            setAccounts(data);
            // default first iban if doesn't exist
            if (data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    fromIban: data[0].iban,
                    targetIban: data[0].iban,
                }));
            }
        } catch (err) {
            console.error("Failed to load accounts", err);
        }
    };

    // handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            let result;

            if (activeTab === "create") {
                result = await createAccount(formData.currency);
                await loadAccounts(); // reaload accounts list
                setMessage({ type: "success", text: "Account created successfully!" });
            }
            else if (activeTab === "transfer") {
                await transferMoney(formData.fromIban, formData.toIban, formData.amount);
                setMessage({ type: "success", text: "Transfer initiated!" });
            }
            else if (activeTab === "deposit") {
                await depositMoney(formData.targetIban, formData.amount);
                setMessage({ type: "success", text: "Money added successfully!" });
            }
            else if (activeTab === "withdraw") {
                await withdrawMoney(formData.targetIban, formData.amount);
                setMessage({ type: "success", text: "Money withdrawn successfully!" });
            }
            await loadAccounts();
            setFormData(prev => ({ ...prev, amount: "" }));
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Operation failed" });
        } finally {
            setLoading(false);
        }
    };

    // // ui helper components
    // const InputField = ({ label, name, type = "text", placeholder, value }) => (
    //     <div className="mb-4">
    //         <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    //         <input
    //             type={type}
    //             name={name}
    //             value={value}
    //             onChange={handleChange}
    //             placeholder={placeholder}
    //             className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
    //             required
    //         />
    //     </div>
    // );

    // // selecting account
    // const AccountSelect = ({ label, name, value }) => (
    //     <div className="mb-4">
    //         <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    //         <select
    //             name={name}
    //             value={value}
    //             onChange={handleChange}
    //             className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
    //         >
    //             {accounts.map((acc) => (
    //                 <option key={acc.id} value={acc.iban}>
    //                     {acc.iban} ({acc.balance} {acc.currency})
    //                 </option>
    //             ))}
    //         </select>
    //     </div>
    // );

    return (
        <main className="relative min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
            {/* Background Effects */}
            <div id="blob" ref={blobRef} />
            <div id="blur" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <HeaderUser />

                <div className="flex-1 flex flex-col items-center justify-center p-4 pt-24">
                    <div className="w-full max-w-2xl bg-slate-900/80 border border-indigo-500/30 rounded-3xl shadow-2xl p-6 backdrop-blur-md">

                        <h2 className="text-3xl font-bold text-indigo-200 mb-6 text-center">Banking Services</h2>

                        {/* --- TABS --- */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-slate-700 pb-4">
                            {['create', 'transfer', 'withdraw', 'deposit'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setMessage({ type: "", text: "" });
                                    }}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 
                    ${activeTab === tab
                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* --- FORMS --- */}
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">

                            {/* Message Alert */}
                            {message.text && (
                                <div className={`mb-6 p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 'bg-green-500/20 text-green-200 border border-green-500/50'}`}>
                                    {message.text}
                                </div>
                            )}

                            {/* 1. CREATE ACCOUNT FORM */}
                            {activeTab === "create" && (
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-400"
                                        >
                                            <option value="RON">RON</option>
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                        </select>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4">A new IBAN will be generated automatically for you.</p>
                                </div>
                            )}

                            {/* 2. TRANSFER FORM */}
                            {activeTab === "transfer" && (
                                <div>
                                    <AccountSelect
                                        label="From My Account"
                                        name="fromIban"
                                        value={formData.fromIban}

                                        accounts={accounts}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="To IBAN (Receiver)"
                                        name="toIban"
                                        placeholder="RO..."
                                        value={formData.toIban}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Amount"
                                        name="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* 3. DEPOSIT FORM */}
                            {activeTab === "deposit" && (
                                <div>
                                    <AccountSelect
                                        label="Select Account to Load"
                                        name="targetIban"
                                        value={formData.targetIban}
                                        accounts={accounts}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Amount to Add"
                                        name="amount"
                                        type="number"
                                        placeholder="100.00"
                                        value={formData.amount}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* 4. WITHDRAW FORM */}
                            {activeTab === "withdraw" && (
                                <div>
                                    <AccountSelect
                                        label="Withdraw From"
                                        name="targetIban"
                                        value={formData.targetIban}
                                        accounts={accounts}
                                        onChange={handleChange}
                                    />
                                    <InputField
                                        label="Amount to Withdraw"
                                        name="amount"
                                        type="number"
                                        placeholder="50.00"
                                        value={formData.amount}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {/* ACTION BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : activeTab.toUpperCase()}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}