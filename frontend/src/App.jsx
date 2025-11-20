import {useEffect, useState} from 'react';
import Login from './Login';
import Accounts from './Accounts';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is already logged in (has a token)
    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token'); // Delete token
        setIsAuthenticated(false); // Switch back to Login screen
    };

    return (<div>
            {isAuthenticated ? (<Accounts onLogout={handleLogout}/>) : (
                <Login onLoginSuccess={() => setIsAuthenticated(true)}/>)}
        </div>);
}

export default App;