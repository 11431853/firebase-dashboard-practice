
import './App.css';
import Login from './Components/Login';
import { Routes, Route } from 'react-router-dom';
import Profile from './Components/Profile';
import { AuthContextProvider } from './Context/AuthContext';
import UserDetails from './Components/UserDetails';

function App() {
  return (
    <div>
      <AuthContextProvider>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/profile' element={<Profile />} />
        <Route path='/userdetails' element={<UserDetails />} />
        <Route path='/userdetails/:id' element={<UserDetails />} />
      </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
