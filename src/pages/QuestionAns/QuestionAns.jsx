import { useRef, useState, useEffect, useReducer } from "react";
import classes from "./QuestionAns.module.css";
import { Link, useParams,useNavigate } from "react-router-dom";
import profilepic from "../../assets/img/profile-image.png"
// import { VscAccount } from "react-icons/vsc";
import Layout from "../Layout/Layout";
import axios from "../Axios/axiosConfig";
import QA from "../../assets/img/icons8-answer-58.png";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import Animationpage from "../Animation/Animationpage";
import Loader from "../../Components/Loader";
import { useContext } from "react";
import { AppState } from "../../App";



import Confirmation from './Confirmation'

function QuestionAns() {
  const navigate=useNavigate()
  const { user } = useContext(AppState);
  const answerDom = useRef();
  const token = localStorage.getItem("token");
  const { questionid } = useParams();
  const [values, setValues] = useState([]);
  const [details, setDetail] = useState([]);
  const [render, forceUpdate] = useReducer((x) => x + 1);
  const [error, setError] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [activeBtn, setActiveBtn] = useState("none");
  const [isloading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [answerIdOnEdit, setAnswerIdOnEdit] = useState(null);
  const [annouce, setannounce] = useState(false);
  const [isEditModeQuestion, setIsEditModeQuestion] = useState(false);
  const [questionIdOnEdit, setQuestionIdOnEdit] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [notification, setNotification] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);
  const [deleteAnswerId, setDeleteAnswerId] = useState(null);
  const [ale,setAler]=useState(true)
  // const [announce, setAnnounce]=useState('')
  const titleDom = useRef();
  const descriptionDom = useRef();
 
  // {to extract answers from data base}
 // get the whole answer
    async function answer() {
      try {
        const respond = await axios
        .get(`/data/combined/${questionid}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })

        setValues(respond.data);
    console.log(respond.data);
    } catch (error) {
      console.error("Error with question details:", error);
      if (error.res) {
        console.error( error.res.data);
        console.error( error.res.status);
      }
    }
  }

  useEffect(() => {
    answer()
  }, [isloading, isEditMode, answerIdOnEdit]);

  
  // get detail question 
  async function detailQuestion() {
    setIsLoading(true);
    try {
      const respond = await axios
      .get(`/data/combineddetail/${questionid}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      setDetail(respond.data[0]);
        console.log(respond.data);
        setIsLoading(false);
    } catch (error) {
      console.log(err);
        setIsLoading(false);
    }
  }

      useEffect(() => {
        detailQuestion()
  }, [setDetail ]);

  useEffect(() => {
  
  }, [details]);

  // {to post answers}
  async function handleSubmit(e) {
    e.preventDefault();
    const answervalue = answerDom.current.value;

    console.log("Question ID:", questionid);
    if (!answervalue) {
      setError("before you post you have to answer for the given question");
      return;
    }
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      alert("something went wrong");
      console.log(error);

      setIsLoading(false);
    }
  }
  useEffect(() => {
    handleSubmit();
  }, [render]);

  // to include like and unlike button

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


  // to include confirmation button while deliting

  const confirmDeleteQuestion = (questionid) => {
    setDeleteQuestionId(questionid);
    setShowConfirmModal(true);
  };
  const handleConfirmDeleteQuestion = async () => {
    setShowConfirmModal(false);
    if (deleteQuestionId) {
      await deleteQuestions(deleteQuestionId);
      setDeleteQuestionId(null);
    }
  };
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteQuestionId(null);
    setDeleteAnswerId(null);
  };
    
  const confirmDeleteAnswer = (answerid) => {
    setDeleteAnswerId(answerid);
    setShowConfirmModal(true);
  };
  const handleConfirmDeleteAnswer = async () => {
    setShowConfirmModal(false);
    if (deleteAnswerId) {
      await deleteAnswer(deleteAnswerId);
      setDeleteAnswerId(null);
    }
  };

// to delete the answer
  const deleteAnswer = async (answerid) => {
    console.log("answerid==>", answerid);
    try {
      const { data } = await axios.delete(`answers/deleteanswer/${answerid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setNotification("you have deleted your answer")
      setValues((prevValues) =>
        prevValues.filter((values) => values.answerid !== answerid)
    );
    

      forceUpdate();
    } catch (error) {
      console.error( error.response);
    }
  };

  // to update and edit answer
  const editAnswer = async (answerid, answer) => {
    setIsEditMode(true);
    setAnswerIdOnEdit(answerid);
    answerDom.current.value = answer;
  };
  async function updateAnswer(e) {
    e.preventDefault();
    const answerValue = answerDom.current.value;

    if (!answerValue) {
      alert("Please provide all required information");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `/answers/update-answer/${answerIdOnEdit}`,
        {
          answer: answerValue,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setannounce("Your answer has been updated");

      //empty answer
      // answerDom.current.value = "";
      setIsLoading(false);
      setIsEditMode(false);
      // setAnswerIdOnEdit(null)
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

// edit question

const editQuestion = async (questionid, title, description) => {
  setIsEditModeQuestion(true);
  setQuestionIdOnEdit(questionid);
  setTitleValue(title);
  setDescriptionValue(description);
 
};

// update question

useEffect(() => {
  if (isEditModeQuestion) {
    titleDom.current.value = titleValue;
    descriptionDom.current.value = descriptionValue;
  }
}, [isEditModeQuestion, titleValue, descriptionValue]);

const updateQuestion = async (e) => {
  e.preventDefault();

  

  if (!titleValue || !descriptionValue) {
    alert("Please provide all required information");
    return;
  }

  try {
    setIsLoading(true);
    await axios.post(
      `/questions/update-question/${questionIdOnEdit}`,
      {
        title: titleValue,
        description: descriptionValue,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    setNotification("Your question has been updated");

    // Reset form
    setTitleValue("");
    setDescriptionValue("");
    setIsLoading(false);
    setIsEditModeQuestion(false);
    // Refresh question details
    setDetail({
      ...details,
      title: titleValue,
      description: descriptionValue,
    });
  } catch (error) {
    console.error(error);
    setIsLoading(false);
}
};

  const deleteQuestions = async (questionid) => {
    setIsLoading(true);
    try {
      const { data } = await axios.delete(`/questions/delete/${questionid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

     // Update your state to remove the deleted question
      setTimeout(() => {
        setNotification("you have deleted your question ")
      setDetail((prevQuestions) =>
        prevQuestions.filter((details) => details.questionid !== questionid)
      );
    
    }, 2000)
      console.log(data);
      // Navigate to the home page
      navigate("/",{ replace: true });
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      setIsLoading(false);
    }
  };

  // display box

  const handleClickOutside = (event) => {
    if (event.target.classList.contains(classes.editQuestion)) {
      setIsEditModeQuestion(false);
    }
  };

  const handleClickOut = (event) => {
    if (event.target.classList.contains(classes.notification_main)) {
      setNotification(false);
    }
  };



// Other functions (handleSubmit, updateAnswer, editAnswer, etc.) go here...
  return (
    <Layout>
      <Animationpage>
        {isloading ? (
          <Loader />
        ) : (
          <div className={classes.answer_container}>

{notification && (
  <div onClick={ handleClickOut} className={classes.notification_main}>
      <div className={classes.notification}>{notification}</div>
  </div>
      
      )}
      {showConfirmModal && (
        <Confirmation
          message={
            deleteQuestionId
              ? "Are you sure you want to delete this question?"
              : "Are you sure you want to delete this answer?"
          }
          onConfirm={
            deleteQuestionId
              ? handleConfirmDeleteQuestion
              : handleConfirmDeleteAnswer
          }
          onCancel={handleCancelDelete}
  />
)}


            <div className={classes.top}>
              <div>
              <div className={classes.title_Que}><p>Questions title: {details?.title}</p></div>
              <div className={classes.description}>
              <p>Questions description: {details?.description}</p> 
              </div>
              </div>
              {/* <div className={classes.icon} onClick={(e) => e.stopPropagation()}> */}
             
              {details?.username == user?.username && <div className={classes.icon} onClick={(e) => e.stopPropagation()}>
              <FaTrashAlt size={25}
                
                onClick={() => confirmDeleteQuestion(details.questionid)}
                style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
              />
               <MdEdit size={25}
              onClick={() =>
                editQuestion(
                  details.questionid,
                  details.title,
                  details.description
                )
              }
              style={{ cursor: "pointer", color: "gray", fontSize: "20px" }}
            />
              </div>}
           
{/* </div> */}
{/* update question  */}

 
            </div>

            {isEditModeQuestion && (
  <div className={classes.editQuestion} onClick={handleClickOutside}> <form onSubmit={updateQuestion} className={classes.formedit}>
  <h2 className={classes.form_title}>Update Your Question</h2>
  <input
    ref={titleDom}
    type="text"
    placeholder="Title"
    className={classes.title}
    value={titleValue}
    onChange={(e) => setTitleValue(e.target.value)}
    
  />
  <textarea
    ref={descriptionDom}
    placeholder="Enter description"
    className={classes.Question_Des}
    value={descriptionValue}
    onChange={(e) => setDescriptionValue(e.target.value)}
  ></textarea>
  <button
    type="submit"
    className={classes.button}
    disabled={isloading}
  >

    {isloading ? "Updating..." : "Post Question"}
  </button>
</form></div>
        
)}



            <div className={classes.community}>
            <div>
            <img src={QA} width={45} alt="" />
            </div>
              
                <div>
                  <h4>Answer From The Community</h4>
                </div>
              
            </div>

            <div className={classes.one_question}>
              <div className={classes.all_answer}>
                {values.map((value, i) => (
                  <div key={i}>
                    <div className={classes.eachanswer}>
                      <div>
                        <div className={classes.Profileicon}>
                          {/* <VscAccount  size={60} /> */}
                          <img src={profilepic} width={100}  alt="" />
                        </div>
                       
                        <div className={classes.username}>
                          <p>{value?.username}</p>
                          
                        </div>
                        
                        <div className={classes.Answericon}>
                          <div><SlLike size={25}
                            onClick={() => handleReactionClick("like")}
                            className={classes.like}
                          />
                          <span>{likeCount}</span></div>
                          
                          <div><SlDislike size={25}
                            onClick={() => handleReactionClick("dislike")}
                            className={classes.dislike}
                          /> 

                                <span>{dislikeCount}</span>

                          </div>
                          
                          
                         
                          {value?.username == user?.username && (
                          // {showAll && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={classes.display}
                            >
                              <div>
                              <FaTrashAlt size={25}
                               onClick={() => confirmDeleteAnswer(value?.answerid)}
                                style={{
                                  cursor: "pointer",
                                  color: "red",
                                  fontSize: "20px",
                                }}
                                className={classes.delete}
                              />
                              </div>
                             
                              <div> <MdEdit size={25}
                                onClick={() =>
                                  editAnswer(value.answerid, value.answer)
                                }
                                style={{
                                  cursor: "pointer",
                                  color: "gray",
                                  fontSize: "20px",
                                }}
                                className={classes.edit}
                              /></div>
                             
                            </div>
                          )}
                          {/* //  )} */}
                        </div>
                      </div>

                      <div className={classes.answer}>{value?.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={classes.form}>

                <form
                  onSubmit={isEditMode ? updateAnswer : handleSubmit}
                  action=""
                >
                  <div className={classes.public}>
                    <div > <h3>{isEditMode
                        ? " Update Answer"
                        : "Answer The Top Question"} </h3></div>
                   <div className={classes.link}><Link to="/all-questions">Go to question page</Link></div>
                    
                    
                  </div>

                  <div>
                    <textarea
                      ref={answerDom}
                      placeholder="Your Answer.."
                      className={classes.textarea}
                    ></textarea>
                  </div>

                  {error && (
                    <button>
                      {" "}
                      {isloading
                        ? "posting..."
                        : isEditMode
                        ? " Update Answer"
                        : "Post your Answer"}
                    </button>
                  )}
                  <span style={{ color: "blue", padding: "5px" }}>{error}</span>
                </form>
              </div>
            </div>
          </div>
        )}
      </Animationpage>
    </Layout>
  );
}

export default QuestionAns;
