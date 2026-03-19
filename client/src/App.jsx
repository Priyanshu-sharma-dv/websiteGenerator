import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import useGetCurrentUSer from './hooks/useGetCurrent';
export const serverUrl = "";
function App() {
  useGetCurrentUSer();
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
