import { Routes, Route } from "react-router-dom"

import Layout from "./pages/Layout"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Member from "./pages/Member"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Route>
        <Route path="/member" element={<Member />}>
          <Route path="/member/reply/:repliedCommentId" element={null}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
