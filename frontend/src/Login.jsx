import {useState} from 'react';

function Login({onLoginSuccess}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload
        setError('');

        try {
            const response = await fetch('/auth/login', { // POST request to log in
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            if (!response.ok) { // 403: Forbidden
                throw new Error("Invalid username or password");
            }

            const data = await response.json();

            localStorage.setItem('jwt_token', data.token); // save token to localStorage
            onLoginSuccess();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login to Punct</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Username</label>
                        <input
                            type="text"
                            className="text-gray-800 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
                        <input
                            type="password"
                            className="text-gray-800 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;