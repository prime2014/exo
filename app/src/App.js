import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Feed from "./Components/Feed/Feed";
import Signup from "./Components/Signup/Signup";
import Activation from "./Components/activation/Activation";
import Profile from "./Components/Profile/Profile";
import Friends from "./Components/friends/Friends";


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
          <Route path="/:username" element={ <Profile /> } />
          <Route exact path="/friends" element = {<Friends />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
