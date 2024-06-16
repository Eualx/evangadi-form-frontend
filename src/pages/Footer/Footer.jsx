import React from 'react'
import classes from './Footer.module.css'
import logo2 from '../../assets/img/10003.png'
import { Link } from 'react-router-dom'
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaSquareYoutube } from "react-icons/fa6";
function Footer() {
  return (
    <section className={classes.footer}>
    <div className={classes.footer_container}>
        <div>
        <div className={classes.logo}>
        <Link to=""><img src={logo2} alt="" /></Link>
        </div>
        <div className={classes.icon}>
            <Link to="https://www.facebook.com/evangaditech"><CiFacebook size={40} /></Link>
            <Link to="https://www.instagram.com/evangaditech/"><FaInstagram size={40}/></Link>
            <Link to="https://www.youtube.com/@EvangadiTech"><FaSquareYoutube size={40} /></Link>
        </div>
      
        </div>
        <div className={classes.footerlink}>
        <h3>Useful Link</h3>
        <ul><li><Link to="">How it works</Link></li>
        <li><Link to="https://www.evangadi.com/legal/terms/">Terms of Service</Link></li>
        <li><Link to="https://www.evangadi.com/legal/privacy/">Privacy policy</Link></li>
        
        
        </ul>
        
        
        
       </div>
       <div className={classes.footerlink}>
        <h3> Contact Info</h3>
        <ul><li><Link to="">Evangadi Networks</Link></li>
        <li><Link to="">support@evangadi.com</Link></li>
        <li><Link to="">+1-202-386-2702</Link></li></ul>
        
        
        
       </div>

    </div>
    </section>
  )
}

export default Footer