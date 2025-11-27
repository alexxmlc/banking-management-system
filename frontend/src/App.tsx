import { Routes, Route, Link } from "react-router-dom";
import ATMManager from "./components/ATMManager";

function App() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                    <span className="font-semibold text-lg tracking-tight text-gray-800">Admin<span className="text-blue-600">Console</span></span>
                </div>

                <div className="flex items-center space-x-1">
                    <Link to="/atms" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        ATM Network
                    </Link>
                    <Link to="/users" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        Users
                    </Link>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <button
                        onClick={() => { localStorage.removeItem("token"); window.location.href = '/login'; }}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="py-8">
                <Routes>
                    <Route path="/atms" element={<ATMManager />} />
                    <Route path="/" element={
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, Administrator</h2>
                            <p className="text-gray-500 max-w-md">Select a module from the navigation bar to manage the banking infrastructure.</p>
                            <Link to="/atms" className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                Manage ATMs
                            </Link>
                        </div>
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default App;