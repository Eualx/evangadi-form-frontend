import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../Axios/axiosConfig";
import classes from "./Register.module.css";
import { FaEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import Layout from "../Layout/Layout";

function Register() {



  // error
  const [error, setError] = useState("");

// navigation 
  const navigate = useNavigate();
// use ref to hold the value
  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();
 // password visiblity
  const [visible, setVisible] = useState(false);
  const handleVisblity = () => {
    setVisible(!visible);
  };

  // switch login n register page
  const [register, setRegister] = useState(true);

  const registerpage = () => {
    setRegister(!register);
  };

  // to handle submit for registeration button
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const usernamevalue = usernameDom.current.value.trim();
    const firstnamevalue = firstnameDom.current.value.trim();
    const lastnamevalue = lastnameDom.current.value.trim();
    const emailvalue = emailDom.current.value.trim();
    const passwordvalue = passwordDom.current.value.trim();
    if (
      !usernamevalue ||
      !firstnamevalue ||
      !lastnamevalue ||
      !emailvalue ||
      !passwordvalue
    ) {
      setError("please provide all required information");
      return;
    }


    try {
      await axios.post("/users/register", {
        username: usernamevalue,
        firstname: firstnamevalue,
        lastname: lastnamevalue,
        email: emailvalue,
        password: passwordvalue,
      });
     
      setRegister(!register);
    } catch (error) {
      // alert("something went wrong");

      console.log(error.response);
    }
  }


  // to handle submit for login page button
  async function handleSubmit2(e) {
    e.preventDefault();
    setError("");
    const emailvalue = emailDom.current.value;
    const passwordvalue = passwordDom.current.value;
    if (!emailvalue || !passwordvalue) {
      setError("Please log in to your account first");
      return;
    }

    try {
      const { data } = await axios.post("/users/login", {
        email: emailvalue,
        password: passwordvalue,
      });
      // alert("login sucessfully.");
      localStorage.setItem("token", data.token);
      console.log(data);
      // navigate("/");
      setTimeout(() => { navigate('/'); window.location.reload(); setProcess(false)}, 2000)
    } catch (error) {
      alert(error?.response?.data?.msg);
      console.log(error.response.data);
    }
  }

  return (
    <Layout>
      <section className={classes.Loginsign}>
        <div className={classes.Signup_container}>
          {register ? (
            <div className={classes.left_Login_container}>
              <form onSubmit={handleSubmit2} action="">
                {error && <small >{error}</small>}
                <h4>Login to your account</h4>
                <p>
                  Don't have an account?{" "}
                  <span>
                    <Link onClick={registerpage} to="">
                      Create a new account
                    </Link>
                  </span>
                </p>

                <div>
                  <input ref={emailDom} type="email" placeholder="Your Email" />
                </div>
                <br />
                <div>
                  <input
                    ref={passwordDom}
                    type={!visible ? "password" : "text"}
                    placeholder="Your Password "
                  />
                  <label htmlFor="">
                    {" "}
                    {!visible ? (
                      <FaRegEyeSlash onClick={handleVisblity} />
                    ) : (
                      <FaEye onClick={handleVisblity} />
                    )}
                  </label>
                </div>
                <button type="submit">Login</button>
                <br />
                <Link onClick={registerpage} to="">
                  {" "}
                  Create an account?
                </Link>
<br />
                <Link to=""> Forget password?</Link>
              </form>
            </div>
          ) : ( 
            <div className={classes.left_Signup_container}>
              <form onSubmit={handleSubmit} action="">
                <h4>Join the network</h4>
                <p>
                  Already have an account?{" "}
                  <span>
                    <Link onClick={registerpage}>signin</Link>
                  </span>
                </p>
                <p></p>
                <div>
                  <input ref={emailDom} type="email" placeholder="Email" 
                  />
                </div>{" "}
                <br />
                <div className={classes.first_last_name}>
                  <div>
                    <input
                      ref={firstnameDom}
                      type="text"
                      placeholder="First Name"
                      
                    />
                  </div>
                  <br />
                  <div>
                    <input
                      ref={lastnameDom}
                      type="text"
                      placeholder="Last Name"
                     
                    />
                  </div>
                </div>
                <br />
                <div>
                  <input
                    ref={usernameDom}
                    type="text"
                    placeholder="User Name"
                    
                  />
                </div>
                <br />
                <div>
                  <input
                    ref={passwordDom}
                    type={!visible ? "password" : "text"}
                    placeholder="Password "
                    
                  />
                  <label htmlFor="">
                    {" "}
                    {!visible ? (
                      <FaRegEyeSlash onClick={handleVisblity} />
                    ) : (
                      <FaEye onClick={handleVisblity} />
                    )}
                  </label>
                </div>
                <br />
                <small>I agree to the{" "}</small>
                <span>
                  <a href="">Privacy policy</a> and{" "}
                  <a href="">terms of serivice</a>
                </span>
                <button type="submit">Agree and Join</button>
                <br />
                {error && <small style={{ color: "red" }}>{error}</small>}{" "}
                <br />
                <Link onClick={registerpage} to="">
                  Already have an account?
                </Link>

                
              </form>
            </div>
          )}
          <div className={classes.right_Signup_container}>
            <h5>About</h5>
            <h1>Evangadi Network Q&A </h1>
            <p>
              No matter what stage of life you are in, whether you’re just 
              starting elementary school or being promoted to CEO of a Fortune 
              500 company, you have much to offer to those who are trying to
              follow in your footsteps.     
              <br /> 
              <br />         
              Welcome to Evangadi Forum, your ultimate destination for finding answers and sharing knowledge. Whether you're a curious learner, an expert in a field, or someone looking for a community to engage with, our platform offers a dynamic and interactive environment where questions spark conversations and solutions emerge collaboratively.
            </p>
            <br />

            <button>HOW IT WORKS</button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Register;
