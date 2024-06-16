import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import Dashbord from './pages/Home/Dashbord'
import Register from './pages/SigInSignUp/Register'
import { useEffect, useState, createContext } from 'react'
import axios from './pages/Axios/axiosConfig'
import AskQuestion from './pages/AskQuestion/AskQuestion'
import QuestionAns from './pages/QuestionAns/QuestionAns'
import Header from './pages/Header/Header'
import { AnimatePresence } from 'framer-motion'
export const AppState=createContext()
 
 
function App() {

  const [user , setUser]=useState(null)
 const token = localStorage.getItem("token")
 const navigate=useNavigate()
 async function checkUser(){
    try {
     const {data} = await axios.get("/users/check",{ headers:{
        Authorization: 'Bearer ' + token,},})
        console.log(data); 
        // if(data?.userid){
          setUser(data)
        // }
      
    } catch (error) {
      console.log(error.response);
      navigate("/register")
      
    }
  }
useEffect(()=>{
    checkUser()
},[])

console.log(user);
 const location =useLocation()
  return (
    <AppState.Provider value={{user, setUser}}>
   
        <Header />
      <AnimatePresence >
   <Routes key={location.pathname}location={location}>
  <Route path="/" element={<Dashbord/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/all-questions" element={<AskQuestion/>}/>
  <Route path="/:questionid" element={<QuestionAns/>}/>
  
   </Routes>
  
   </AnimatePresence>
    </AppState.Provider>
  )
}

export default App
