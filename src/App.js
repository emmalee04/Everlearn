import React, { useContext } from 'react';
import Welcome from './pages/Welcome/Welcome';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RegisterUsername from './pages/Register/RegisterUsername';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/Profile/ProfileEdit';
import Settings from './pages/Settings/Settings';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { currentUser } = useContext(AuthContext);
  // If user is not logged in, navigate to login page
  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/welcome"/>;
    }
    return children;
  }
  console.log(currentUser);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          } />
          <Route path="welcome" element={<Welcome/>} />
          <Route path="login" element={<Login/>} />
          <Route path="register" element={<Register/>} />
          <Route path="register/username" element={<RegisterUsername/>} />
          <Route path="about" element={<About/>} />
          <Route path="chat" element={<Chat/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="profile/edit" element={<ProfileEdit/>} />  
          <Route path="settings" element={<Settings/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
