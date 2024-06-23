import axios from "axios"

const axiosBase = axios.create({

// local host 
    // baseURL:'http://localhost:5000/api'

    // web host
   baseURL:'https://evangadi-forum-backend-z3tu.onrender.com/api'
})
export default axiosBase


