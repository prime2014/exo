import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Feed from "./Components/Feed/Feed";
import Signup from "./Components/Signup/Signup";
import Activation from "./Components/activation/Activation";
import Profile from "./Components/Profile/Profile";
import Settings from "./Components/Settings/Settings";
import Group from "./Components/group/Group";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account/login" element={ <Login /> } />
          <Route exact path="/feed" element={ <Feed /> } />
          <Route path="/account/signup" element= { <Signup /> } />
          <Route path="/account/:id/activation/:token" element={ <Activation /> } />
          <Route exact path="/:username" element={ <Profile /> } />
          <Route path="/:pk/settings" element={ <Settings /> } />
          <Route path="/groups" element={<Group />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
