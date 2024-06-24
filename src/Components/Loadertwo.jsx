import React from 'react'
import {PropagateLoader} from 'react-spinners'
function Loader() {
  return (
    <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        height:"50vh",
        color:"orange"
       
    }}>
<PropagateLoader color="#36d7b7" /></div>
  )
}

export default Loader