import React, { children } from 'react'
import {motion} from 'framer-motion'
function Animationpage({children}) {
    const animations={
initial:{opacity:0, y: 100},
animate:{opacity:1,y:0},
// exit:{opacity:0, y:100}

}


  return (
    <motion.div variants={animations}
     animate='animate'
      initial='initial' 
      // exit="exit"
      
      transition={{duration:0.5}}
      >{children}</motion.div>
  )
}

export default Animationpage