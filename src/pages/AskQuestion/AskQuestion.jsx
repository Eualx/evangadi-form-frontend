import {useRef, useState} from "react";
import Layout from "../Layout/Layout";
import { useNavigate } from "react-router-dom";
import classes from "./Ask.module.css";
import axios from "../Axios/axiosConfig"
import arrow from  "../../assets/img/icons8-arrow-24.png"
import Animationpage from "../Animation/Animationpage";
import Loader from "../../Components/Loader";

function AskQuestion() {
  const [error , setError]=useState(true)
  const navigate=useNavigate()
  const titleDom=useRef()
  const descriptionDom=useRef()
  const token = localStorage.getItem("token")
  const [isloading, setIsLoading]=useState(false)
  
  
  
  async function handleSubmit(e) {
    e.preventDefault();
    const titlevalue=titleDom.current.value;
    const descriptionvalue=descriptionDom.current.value

if(!titlevalue|| !descriptionvalue){
  setError("please provide all required information")
  return
}
    try {
      setIsLoading(true)
     await axios.post("/questions/all-questions",{
     
      title:titlevalue,
      description:descriptionvalue
      },
      { headers:{
        Authorization: 'Bearer ' + token,}
      }
 
    );

      navigate("/");
      setIsLoading(false)
     
    } catch (error) {
      alert("something went wrong")
      console.log(error);
      setIsLoading(false)
    }
  }
  

  return (
    <Layout>
      <Animationpage>
        
      <section className={classes.AskQuestion_container}>
        <div className={classes.description}>
          <div className={classes.list_title}><h3>Steps to write a good question</h3></div>
          <div>  <ul>
            <li><img src={arrow} alt="" /><span>Summerize your problem in a one-line title</span></li>
            <li><img src={arrow} alt="" />Describe your problem in more detail</li>
            <li><img src={arrow} alt="" />Describe what you tried and what you expected to happen</li>
            <li><img src={arrow} alt="" />Review your question and post it to the site</li>
          </ul></div>
      
        </div>
        { isloading ? (<Loader/>):(  
        <div className={classes.form}>
          <form onSubmit={handleSubmit} action="">
            <div className={classes.public}>
              <h3>Ask a public question </h3><br />
            </div>

            <div className={classes.title}>
              < input
              ref={titleDom}
              type="text" 
              placeholder="Title" />
            </div> <br />
            <div className={classes.Question_Des}>
              {" "}
              <textarea ref={descriptionDom}
              type="text" placeholder="Question Description" ></textarea>
            </div>

            {error &&  <button type=""> Post The Question</button>}<span style={{color:"blue", padding:"5px"}}>{error}</span>
          </form>
        </div> )}
      </section>
    
 </Animationpage>
    </Layout>
  );
}

export default AskQuestion;
