import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import LoginPage from './pages/Login';
import MainPage from './pages/MainPage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        {/* <Route path="/" element={<MainPage/>}/>
        <Route path="/Login" element={<LoginPage/>}/>
        <Route path="/Signup" element={<SignupPage/>}/>
        <Route path="/Threads/:id" element={<ThreadList/>}/>
        <Route path="/Comments/:id" element={<CommentSection/>}/>
        <Route path="/Unauthorized" element={<Unauthorized/>}/>
        <Route
          path="/Users"
          element={<RequireAuth allowedRoles={["regular", "admin"]}><UsersPage /></RequireAuth>}
        />
        <Route path="*" element={<ErrorPage/>}/> */}
      </Routes>
    </>
  )
}

export default App