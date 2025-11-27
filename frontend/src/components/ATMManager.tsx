import { useEffect, useState, type FormEvent } from "react";
import { request } from "../utils/api";
import type {ATM} from "../types";

interface ATMForm {
    name: string;
    latitude: string; // Keeping as string for input handling, parsing on submit
    longitude: string;
}

function ATMManager() {
    const [atms, setAtms] = useState<ATM[]>([]);
    const [form, setForm] = useState<ATMForm>({ name: "", latitude: "", longitude: "" });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        loadATMs();
    }, []);

    const loadATMs = async () => {
        try {
            const data = await request<ATM[]>("/atms");
            if (data) {
                setAtms(data);
            }
        } catch (err: any) {
            console.error("Failed to load ATMs", err);
            setError("Failed to load ATMs. Is backend running?");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this ATM?")) return;
        try {
            await request<null>(`/atms/${id}`, "DELETE");
            setAtms(atms.filter((atm) => atm.id !== id));
        } catch (err: any) {
            alert("Error: " + err.message);
        }
    };

    const handleAdd = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic validation
        if (!form.name || !form.latitude || !form.longitude) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        try {
            const newATM = await request<ATM>("/atms", "POST", {
                name: form.name,
                latitude: parseFloat(form.latitude),
                longitude: parseFloat(form.longitude),
            });

            if (newATM) {
                setAtms([...atms, newATM]);
                setForm({ name: "", latitude: "", longitude: "" });
            }
        } catch (err: any) {
            alert("Error adding ATM: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">ATM Network Control</h1>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
          Total Units: {atms.length}
        </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ADD PANEL */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                            <span>Deploy New Unit</span>
                        </h2>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location Identifier</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Central Station"
                                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="46.7..."
                                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={form.latitude}
                                        onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="23.6..."
                                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={form.longitude}
                                        onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Deploying..." : "Initialize Unit"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* LIST PANEL */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Coordinates</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {atms.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No units currently online.
                                    </td>
                                </tr>
                            ) : (
                                atms.map((atm) => (
                                    <tr key={atm.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-400">#{atm.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{atm.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                            {atm.latitude?.toFixed(4)}, {atm.longitude?.toFixed(4)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(atm.id)}
                                                className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                                            >
                                                Decommission
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ATMManager;