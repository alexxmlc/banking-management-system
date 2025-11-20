import { useState, useEffect } from 'react';

function Accounts({ onLogout }) {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);

    // useEffect with [] runs ONLY once when the component appears
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');

        fetch('/accounts/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Send the token we saved earlier!
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Could not load accounts");
                return response.json();
            })
            .then(data => setAccounts(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Accounts</h1>
                    <button onClick={onLogout} className="text-red-500 hover:text-red-700 font-medium">
                        Logout
                    </button>
                </div>

                {error && <div className="text-red-500">{error}</div>}

                <div className="grid gap-6 md:grid-cols-2">
                    {accounts.map((acc) => (
                        <div key={acc.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 font-bold uppercase">IBAN</p>
                            <p className="text-lg font-mono text-gray-800 mb-4">{acc.iban}</p>
                            <p className="text-3xl font-bold text-green-600">
                                {acc.balance} <span className="text-lg text-gray-400">{acc.currency}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Accounts;