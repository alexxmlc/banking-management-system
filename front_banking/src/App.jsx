import Home from './Home.jsx'
import {Route, Routes} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Atms from "./components/Atms.jsx";
import TwoFASetup from "./TwoFASetup.jsx";
import HomePageUser from "./HomePageUser.jsx";
import AboutUs from "./AboutUs.jsx";


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/map" element={<Atms/>}/>
                <Route path="/2fa/setup" element={<TwoFASetup />} />
                <Route path="/user/home" element={<HomePageUser />} />
                <Route path="/about" element={<AboutUs />} />

            </Routes>

        </>
    );
}

export default App
