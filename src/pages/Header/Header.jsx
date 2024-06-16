import React,{useContext, useEffect,useState} from 'react'
import { Link ,useNavigate } from 'react-router-dom'
import logo from '../../assets/img/10002.png'
import classes from "./Header.module.css"
import { AppState } from '../../App'
import { CiMenuFries } from "react-icons/ci";
function Header() {
  const { user, setUser } = useContext(AppState);
  const [sidebar, setSidebar]=useState(false)
  const navigate = useNavigate();





  
const handleAuthButtonClick = () => {

  if (user) {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/register');
    
  } 
  else{
     navigate('/register');
 

  }
};


  const openSlider=()=>{
    setSidebar(true)
    
  }
  const closeSlider=()=>{
    setSidebar(false)
   
  }

  useEffect(() => {
    
  }, []);




  return (
    <div className={classes.header_container}>
      
        <div className={classes.logo}>
        <Link to={ user && "/"}><img src={logo} alt="" /></Link>
        </div>
        <div className={classes.right_container}>
        <div><Link to={ user && "/"}>Home</Link></div>
       <div>
        <Link to="">How it Works</Link>
       </div>
       <div className={classes.header_button}><button type="button" onClick={handleAuthButtonClick}>
            {user ? 'Log out' : 'Log in'}
          </button></div>
 
        </div>
        
        <div className={classes.menu}><CiMenuFries onClick={openSlider} size={40} /></div>
       { sidebar && (<div className={classes.slide}>
       <div className={classes.menu_Container}>
<ul>
  <li><Link to="/">Home</Link></li>
  <li>Terms</li>
  <li>Privacy</li>
  <li onClick={handleAuthButtonClick}>{user ? 'Log out' : 'Log In'}</li>
</ul>

       </div>
     
       
       {
        sidebar && (<div onClick={closeSlider} className={classes.backdrop}>
          
        </div>)
      }
         </div> 
       )}
    </div>
  )
}

export default Header


