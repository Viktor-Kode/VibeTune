import React from 'react'
import Home from './Pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashbaoard'
import Seach from './Pages/Seach'
import Playlist from './Pages/Playlist'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signUp' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/search' element={<Seach/>}/>
      <Route path='/playlist' element={<Playlist/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App