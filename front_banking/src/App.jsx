

import Home from './Home.jsx'
import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

function App(){
  return(
    <>
    <Routes>
          <Route path = "/" element={<Home/>}/>
          <Route path = "/login" element={<Login/>}/>
          <Route path = "/register" element={<Register/>}/>
          
    </Routes>
      
    </>
  );
}

export default App
