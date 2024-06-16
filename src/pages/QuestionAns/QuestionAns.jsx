import { useRef, useState, useEffect, useReducer } from "react";
import classes from "./QuestionAns.module.css";
import { Link, useParams } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import Layout from "../Layout/Layout";
import axios from "../Axios/axiosConfig";
import QA from "../../assets/img/icons8-answer-58.png";
import handpointer from "../../assets/img/icons8-hand-right-50.png"
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import Animationpage from "../Animation/Animationpage";
import Loader from "../../Components/Loader"
function QuestionAns() {
  const answerDom = useRef();
  const token = localStorage.getItem("token");
  const { questionid } = useParams();
  const [values, setValues] = useState([]);
  const [details, setDetail] = useState([]);
  const [render, forceUpdate] = useReducer((x) => x + 1);
  const [error, setError]=useState(true)
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [activeBtn, setActiveBtn] = useState("none");
  const [isloading, setIsLoading]=useState(false)

  // {to extract answers from data base}
  useEffect(() => {
    if (questionid && token) {
      setIsLoading(true)
      axios
        .get(`/data/combined/${questionid}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })

        .then((res) => {
          setValues(res.data);
          console.log(res.data);
          setIsLoading(false)
        })

        .catch((err) => {
          console.log(err);
          setIsLoading(false)
        });
    }
  }, [questionid, token, render]);

  // {extracting data which are not included in the mapping}

  useEffect(() => {
    setIsLoading(true)
    axios.get(`/data/combineddetail/${questionid}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setDetail(res.data[0]);
        console.log(res.data);
        setIsLoading(false)
      })

      .catch((err) => {
        console.log(err);
        setIsLoading(false)
      });
  }, []);

 
  // {to post answers}
  async function handleSubmit(e) {
    e.preventDefault();
    const answervalue = answerDom.current.value;

    console.log("Question ID:", questionid);
    if (!answervalue) {
      // alert("please provide all required information");
      setError("before you post you have to answer for the given question")
      return;
    }
    try {
      setIsLoading(true)
      await axios.post(
        `/answers/all-answer/${questionid}`,
        {
          answer: answervalue,
          questionid: questionid,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      forceUpdate();
      setIsLoading(false)
    } catch (error) {
      alert("something went wrong");
      console.log(error);
      
      setIsLoading(false)

    }
  }


  const handleReactionClick = (reaction) => {
    // no button is active
    if (activeBtn === "none") {
      if (reaction === "like") {
        setLikeCount(likeCount + 1);
        setActiveBtn("like");
      } else if (reaction === "dislike") {
        setDislikeCount(dislikeCount + 1);
        setActiveBtn("dislike");
      }
    } else if (activeBtn === reaction) {
      if (reaction === "like") {
        setLikeCount(likeCount - 1);
      } else if (reaction === "dislike") {
        setDislikeCount(dislikeCount - 1);
      }
      setActiveBtn("none");
    }
  };

 // Handle delete answer
//  const handleDelete = async (questioId) => {
//   try {
//     await axios.delete(`/data/combineddelet/${questionid}`, {
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     });
//     forceUpdate();
//   } catch (error) {
//     alert("Failed to delete the answer");
//     console.log(error);
//   }
// };





  return (
    <Layout>
      <Animationpage>
      { isloading ? (<Loader/>):(  
      <div className={classes.answer_container}>
        <div className={classes.title}>
          <h4>Questions title: {details.title}</h4>
          <h4>Questions description: {details.description}</h4>
          <h2>
          <img src={QA} width={45} alt="" /> <span><h4>Answer From The Community</h4></span>
         
        </h2>
        </div>

       

        <div className={classes.one_question}>
          <div className={classes.all_answer}>
            {values.map((value, i) => (
              <div key={Map.id}>
                <div className={classes.username}>
                  <div>
                    
                  
                  <div>
                    <VscAccount className={classes.icon} size={40} /> 
                     </div>
                    <br />
                    <div>
                    <p>{value.username}</p>
                    </div>
                    <br />
                    <div className={classes.icon}>
                      <SlLike
                        onClick={() => handleReactionClick("like")}
                        className={classes.like}
                      />
                      <span>{likeCount}</span>
                      <SlDislike
                        onClick={() => handleReactionClick("dislike")}
                        className={classes.dislike}
                      />
                      <span>{dislikeCount}</span>
                      <FaTrashAlt  onClick={() => handleDelete(value.id)} className={classes.delete} />
                      <MdEdit className={classes.edit} />
                    </div>
                    </div>
                
                  <div className={classes.answer}>{value.answer}</div>
                </div>


              </div>
            ))}
          </div>
          <div className={classes.form}>
            <form onSubmit={handleSubmit} action="">
              <div className={classes.public}>
                <h3>Answer The Top Question </h3>
                <img src={handpointer} alt="" />
                <Link to="/all-questions">Go to question page</Link>
              </div>

              <div >
                <textarea
                  ref={answerDom}
                  placeholder="Your Answer.."
                  className={classes.textarea}
                ></textarea>
              </div>

             {error &&  <button > Post your Answer</button>}<span style={{color:"blue", padding:"5px"}}>{error}</span>
            </form>
          </div>
        </div>
      </div>)}
      </Animationpage>
    </Layout>
  );
}

export default QuestionAns;
