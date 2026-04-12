import React from 'react'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import Home from './pages/Home';
import useGetCurrentUSer from './hooks/useGetCurrent';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import WebsiteEditor from './pages/Editor';
import LiveSite from './pages/LiveSite';
export const serverUrl = "";
function App() {
  const { loading } = useGetCurrentUSer(); 
  const { userData } = useSelector(state => state.user);
  if (loading) return null; 
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Dashboard' element={userData?<Dashboard/>:<Navigate to= {"/"}/>} />
        <Route path='/Generate' element={userData?<Generate/>:<Navigate to= {"/"}/>} />
        <Route path='/editor/:id'element={userData?<WebsiteEditor/>:<Navigate to={"/"}/>} />
        <Route path='/site/:id' element={<LiveSite />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
