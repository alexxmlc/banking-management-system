import Home from './Home.jsx'
import {Route, Routes} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Atms from "./components/Atms.jsx";
import TwoFASetup from "./TwoFASetup.jsx";
import HomePageUser from "./HomePageUser.jsx";
import AboutUs from "./AboutUs.jsx";
import ServicesAccount from './ServicesAccount.jsx';


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
                <Route path="/services" element={<ServicesAccount />} />
            </Routes>

        </>
    );
}

export default App
