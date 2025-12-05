import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet'
import 'leaflet-routing-machine'

// --- ICONS ---

const atmIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// "Street View" Style Pegman Icon (SVG Data URI)
const pegmanSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B" stroke="#78350F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="7" r="4" />
  <path d="M5.5 21v-8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8" />
  <path d="M5.5 16h13" />
</svg>`;

const userIcon = new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(pegmanSvg)}`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowSize: [41, 41]
});

// --- HELPERS ---
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
function deg2rad(deg) { return deg * (Math.PI/180) }

// --- MAP COMPONENTS ---

function MapInputHandler({ active, onSelect }) {
    useMapEvents({
        click(e) {
            if (active) {
                onSelect([e.latlng.lat, e.latlng.lng]);
            }
        },
    });
    return null;
}

function Routing({ userPos, targetAtm }) {
    const map = useMap();
    useEffect(() => {
        if (!userPos || !targetAtm) return;
        const routingControl = L.Routing.control({
            waypoints: [ L.latLng(userPos[0], userPos[1]), L.latLng(targetAtm.latitude, targetAtm.longitude) ],
            routeWhileDragging: false, show: false, addWaypoints: false, draggableWaypoints: false, fitSelectedRoutes: true, createMarker: () => null,
            lineOptions: { styles: [{ color: '#6366f1', opacity: 0.8, weight: 6 }] }
        }).addTo(map);
        return () => map.removeControl(routingControl);
    }, [map, userPos, targetAtm]);
    return null;
}

function MapController({ selectedAtm, userPos }) {
    const map = useMap();
    useEffect(() => {
        if (selectedAtm && !userPos) map.flyTo([selectedAtm.latitude, selectedAtm.longitude], 16, { duration: 1.2 });
    }, [selectedAtm, userPos, map]);
    useEffect(() => {
        if (userPos && !selectedAtm) map.flyTo(userPos, 14, { duration: 1.5 });
    }, [userPos, selectedAtm, map])
    return null;
}

// --- TRANSACTION CARD ---
function TransactionCard({ atm, token, userPos, accounts, onClose, onTransaction }) {
    const [transType, setTransType] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [selectedIban, setSelectedIban] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        if (accounts.length > 0 && !selectedIban) setSelectedIban(accounts[0].iban);
    }, [accounts]);

    const currentDistance = userPos ? getDistanceFromLatLonInKm(userPos[0], userPos[1], atm.latitude, atm.longitude) : null;

    // UPDATED: Changed from 0.1 (100m) to 1.0 (1km)
    const isNearby = currentDistance !== null && currentDistance < 1.0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg('Processing...');
        try {
            const result = await onTransaction(transType, selectedIban, amount);
            setStatusMsg(`Success: ${result}`);
            setAmount('');
        } catch (err) {
            setStatusMsg(`Error: ${err.message}`);
        }
    };

    return (
        <div className="absolute bottom-6 right-6 z-[1000] w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-5 rounded-xl shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-indigo-300">{atm.name}</h3>
                    <p className="text-xs text-slate-400">ATM ID: {atm.id}</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {!token ? (
                <div className="text-center py-4 text-slate-400 text-sm">Login to perform transactions</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex bg-slate-950 p-1 rounded-lg">
                        <button type="button" onClick={() => setTransType('deposit')} className={`flex-1 py-1 text-sm rounded ${transType === 'deposit' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Deposit</button>
                        <button type="button" onClick={() => setTransType('withdraw')} className={`flex-1 py-1 text-sm rounded ${transType === 'withdraw' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Withdraw</button>
                    </div>

                    <select className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm outline-none" value={selectedIban} onChange={e => setSelectedIban(e.target.value)}>
                        {accounts.map(acc => ( <option key={acc.id} value={acc.iban}>{acc.currency} •••• {acc.iban.slice(-4)} (Bal: {acc.balance})</option> ))}
                    </select>

                    <input type="number" placeholder="Amount" required className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-indigo-500" value={amount} onChange={e => setAmount(e.target.value)} />

                    {statusMsg && <div className={`text-xs p-2 rounded ${statusMsg.includes('Success') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{statusMsg}</div>}

                    {!isNearby && (
                        <div className="text-xs p-2 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                            ⚠️ Too far ({currentDistance?.toFixed(2)} km). Move closer.
                        </div>
                    )}

                    <button type="submit" disabled={!isNearby} className={`w-full py-2 rounded text-sm font-bold transition ${isNearby ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                        {isNearby ? 'Confirm Transaction' : 'Too Far'}
                    </button>
                </form>
            )}
        </div>
    );
}

// --- MAIN COMPONENT ---
function Atms() {
    const [atms, setAtms] = useState([])
    const [accounts, setAccounts] = useState([])
    // Note: 'map_token' is specific to this component's logic from the previous app.
    // The main app uses 'token'. You might want to unify these later.
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [userPos, setUserPos] = useState(null)

    const [selectedAtm, setSelectedAtm] = useState(null)
    const [showLogin, setShowLogin] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isMovingUser, setIsMovingUser] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        fetch('/atms').then(res => res.json())
            .then(data => setAtms(data.map(atm => ({ ...atm, distance: null }))))
            .catch(console.error)
    }, [])

    useEffect(() => {
        if (token) {
            fetch('/accounts/me', { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => { if (res.ok) return res.json(); throw new Error(); })
                .then(setAccounts).catch(() => { setToken(null); localStorage.removeItem('token'); })
        }
    }, [token])

    useEffect(() => {
        if (userPos && atms.length > 0) {
            setAtms(prev => prev.map(atm => ({
                ...atm,
                distance: getDistanceFromLatLonInKm(userPos[0], userPos[1], atm.latitude, atm.longitude)
            })).sort((a, b) => a.distance - b.distance));
        }
    }, [userPos])

    const handleLocateMe = () => {
        setIsMovingUser(false);
        if (!navigator.geolocation) return alert("Geolocation not supported");
        navigator.geolocation.getCurrentPosition(
            (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
            () => alert("Location access denied")
        );
    }

    const handleMapClick = (pos) => {
        setUserPos(pos);
        setIsMovingUser(false);
    }

    const login = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            if (!res.ok) throw new Error("Login failed")
            const data = await res.json()
            setToken(data.token)
            localStorage.setItem('token', data.token)
            setShowLogin(false)
        } catch (err) { alert(err.message) }
    }

    const performTransaction = async (type, iban, amt) => {
        const endpoint = `/accounts/${type}`
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ iban, amount: parseFloat(amt) })
        })
        const text = await res.text()
        if (!res.ok) throw new Error(text)
        const accRes = await fetch('/accounts/me', { headers: { 'Authorization': `Bearer ${token}` }})
        if(accRes.ok) setAccounts(await accRes.json())
        return text;
    }

    return (
        <div className="h-screen w-full flex flex-col bg-slate-900 text-slate-100 font-sans">
            <header className="h-16 bg-slate-950 border-b border-indigo-900/30 flex items-center justify-between px-6 shadow-lg z-[2000] relative">
                <Link to="/" className="text-xl font-bold tracking-wider text-indigo-400">POINT<span className="text-white">MAP</span></Link>
                <div className="flex gap-3">
                    <button onClick={handleLocateMe} className="px-4 py-1.5 text-sm bg-slate-800 text-indigo-300 border border-indigo-500/30 rounded hover:bg-slate-700 transition flex items-center gap-2">📍 Locate Me</button>
                    {token ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-400 hidden sm:block">Logged in</span>
                            <button onClick={() => {setToken(null); localStorage.removeItem('token')}} className="px-4 py-1.5 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition">Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 rounded text-white shadow-lg transition">Login</button>
                    )}
                </div>
            </header>

            <div className="flex-1 relative z-0">
                {isMovingUser && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[3000] bg-indigo-600 text-white px-4 py-2 rounded-full shadow-xl animate-bounce text-sm font-bold border border-white/20">
                        Tap anywhere on the map to move user location
                    </div>
                )}

                <div className="absolute top-4 right-4 z-[1000] w-72 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[60vh]">
                    <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-2">
                        <h3 className="text-sm font-bold text-indigo-300">Nearest ATMs</h3>
                        <input type="text" placeholder="Search..." className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:border-indigo-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <div className="overflow-y-auto p-2 space-y-1">
                        {atms.filter(atm => atm.name.toLowerCase().includes(searchQuery.toLowerCase())).map(atm => (
                            <button key={atm.id} onClick={() => setSelectedAtm(atm)} className={`w-full text-left px-3 py-3 rounded-lg text-sm transition flex items-center justify-between group ${selectedAtm?.id === atm.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                                <div>
                                    <div className="font-medium">{atm.name}</div>
                                    {atm.distance !== null && <div className={`text-xs mt-0.5 ${selectedAtm?.id === atm.id ? 'text-indigo-200' : 'text-slate-500'}`}>{atm.distance.toFixed(2)} km</div>}
                                </div>
                                {selectedAtm?.id === atm.id && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <MapContainer
                    center={[46.7712, 23.6236]}
                    zoom={13}
                    style={{ height: "100%", width: "100%", cursor: isMovingUser ? 'crosshair' : 'grab' }}
                >
                    {/* "Voyager" Tiles: Colorful but without the clutter */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <MapController selectedAtm={selectedAtm} userPos={userPos} />
                    <Routing userPos={userPos} targetAtm={selectedAtm} />

                    <MapInputHandler active={isMovingUser} onSelect={handleMapClick} />

                    {userPos && (
                        <Marker position={userPos} icon={userIcon}>
                            <Popup>
                                <div className="text-center min-w-[120px]">
                                    <p className="font-bold text-slate-800 mb-2">Your Location</p>
                                    <button
                                        onClick={() => setIsMovingUser(true)}
                                        className="w-full px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500 transition"
                                    >
                                        Move User
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {atms.map(atm => (
                        <Marker key={atm.id} position={[atm.latitude, atm.longitude]} icon={atmIcon} eventHandlers={{ click: () => setSelectedAtm(atm) }}>
                            <Popup>
                                <div className="text-slate-900 min-w-[150px]">
                                    <h3 className="font-bold text-sm mb-1">{atm.name}</h3>
                                    <p className="text-xs text-slate-600">Lat: {atm.latitude}, Lon: {atm.longitude}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {showLogin && (
                    <div className="absolute inset-0 z-[3000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
                            <h2 className="text-xl font-bold mb-4 text-white">Login</h2>
                            <form onSubmit={login} className="space-y-3">
                                <input type="text" placeholder="Username" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 outline-none focus:border-indigo-500" value={username} onChange={e => setUsername(e.target.value)} />
                                <input type="password" placeholder="Password" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 outline-none focus:border-indigo-500" value={password} onChange={e => setPassword(e.target.value)} />
                                <div className="flex gap-2 mt-4">
                                    <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-2 text-slate-400 hover:text-white">Cancel</button>
                                    <button type="submit" className="flex-1 py-2 bg-indigo-600 rounded text-white font-semibold hover:bg-indigo-500">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {selectedAtm && (
                    <TransactionCard
                        atm={selectedAtm}
                        token={token}
                        userPos={userPos}
                        accounts={accounts}
                        onClose={() => setSelectedAtm(null)}
                        onTransaction={performTransaction}
                    />
                )}
            </div>
        </div>
    )
}

export default Atms