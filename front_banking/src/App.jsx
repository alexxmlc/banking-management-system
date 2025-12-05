import Home from './Home.jsx'
import {Route, Routes} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Atms from "./components/Atms.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/map" element={<Atms/>}/>
            </Routes>

        </>
    );
}

export default App
