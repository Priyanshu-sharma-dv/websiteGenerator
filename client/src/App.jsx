import React from 'react'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import Home from './pages/Home';
import useGetCurrentUSer from './hooks/useGetCurrent';
export const serverUrl = "";
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
function App() {
  useGetCurrentUSer();
  const {userData} = useSelector(state =>state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Dashboard' element={userData?<Dashboard/>:<Navigate to= {"/"}/>} />
        <Route path='/Generate' element={userData?<Generate/>:<Navigate to= {"/"}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
