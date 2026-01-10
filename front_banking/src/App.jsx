import Home from './Home.jsx'
import {Route, Routes} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Atms from "./components/Atms.jsx";
import TwoFASetup from "./TwoFASetup.jsx";
import HomePageUser from "./HomePageUser.jsx";
import AboutUs from "./AboutUs.jsx";
import ServicesAccount from './ServicesAccount.jsx';
import Account from "./Account.jsx";
import ServicesHome from './ServicesHome.jsx';
import FindUs from './FindUs.jsx';

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
                <Route path="/user/account" element={<Account />} />
                <Route path="/home/services" element={<ServicesHome />} />
                <Route path="/find-us" element={<FindUs />} />

            </Routes>

        </>
    );
}

export default App
