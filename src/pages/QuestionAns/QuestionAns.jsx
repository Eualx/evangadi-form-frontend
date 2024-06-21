import { useRef, useState, useEffect, useReducer } from "react";
import classes from "./QuestionAns.module.css";
import { Link, useParams,useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import Layout from "../Layout/Layout";
import axios from "../Axios/axiosConfig";
import QA from "../../assets/img/icons8-answer-58.png";
import handpointer from "../../assets/img/icons8-hand-right-50.png";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
import Animationpage from "../Animation/Animationpage";
import Loader from "../../Components/Loader";
import { useContext } from "react";
import { AppState } from "../../App";
import { TbDotsVertical } from "react-icons/tb";

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
  const [showAll, setshowAll] = useState(false);
  const [isEditModeQuestion, setIsEditModeQuestion] = useState(false);
  const [questionIdOnEdit, setQuestionIdOnEdit] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  // const [notification, setNotification] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);
  // const [announce, setAnnounce]=useState('')
  const titleDom = useRef();
  const descriptionDom = useRef();
 
  // {to extract answers from data base}
 
    // if (questionid && token) {
      // setIsLoading(true);
      // axios
      //   .get(`/data/combined/${questionid}`, {
      //     headers: {
      //       Authorization: "Bearer " + token,
      //     },
      //   })

      //   .then((res) => {
      //     setValues(res.data);
      //     console.log(res.data);
      //     setIsLoading(false);
      //   })

      //   .catch((err) => {
      //     console.log(err);
      //     setIsLoading(false);
      //   });
    // }
    

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

  
  // {extracting data which are not included in the mapping}
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
  }, [setDetail]);

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

  const deleteAnswer = async (answerid) => {
    console.log("answerid==>", answerid);
    try {
      const { data } = await axios.delete(`answers/deleteanswer/${answerid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      forceUpdate();
    } catch (error) {
      console.error("Error deleting answer: ", error.response || error.message);
    }
  };

  //edit
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
      alert("Your answer has been updated");

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
  setTittleValue(title);
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
    alert("Your question has been updated");

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

const confirmDeleteQuestion = (questionid) => {
  setDeleteQuestionId(questionid);
  setShowConfirmModal(true);
};
const handleConfirmDelete = async () => {
  setShowConfirmModal(false);
  if (deleteQuestionId) {
    await deleteQuestions(deleteQuestionId);
    setDeleteQuestionId(null);
  }
};
const handleCancelDelete = () => {
  setShowConfirmModal(false);
  setDeleteQuestionId(null);
};
  
  const deleteQuestions = async (questionid) => {
    try {
           const { data } = await axios.delete(`/questions/delete/${questionid}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }).then((res)=>{
            detailQuestion();
          })
      console.log(data);
      // setNotification("You have deleted your question");
      // setTimeout(() => {
        setDetail((prevQuestions) =>
                prevQuestions.filter((details) => details.questionid !== questionid)
            );
            navigate("/",{ replace: true });
      // }, 2000); // Navigate after 2 seconds
    }  catch (error) {
      console.log(error.response);
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
            {showConfirmModal && (
        <Confirmation 
          message="Are you sure you want to delete this question?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
  />
)}
            <div className={classes.title}>
              <h4>Questions title: {details?.title}</h4>
              <h4>Questions description: {details?.description}</h4>
              <div onClick={(e) => e.stopPropagation()}>
             
              {details?.username == user?.username && <div onClick={(e) => e.stopPropagation()}>
              <FaTrashAlt 
                // onClick={() => deleteQuestions(details.questionid,details.title,details.description)}
                onClick={() => confirmDeleteQuestion(details.questionid)}
                style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
              />
               <MdEdit
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
           
</div>
{/* update question  */}
{isEditModeQuestion && (
        <form onSubmit={updateQuestion} className={classes.form}>
          <h2 className={classes.form_heading}>Update Your Question</h2>
          <input
            ref={titleDom}
            type="text"
            size="97"
            placeholder="Enter title"
            className={classes.input_field}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            
          />
          <textarea
            ref={descriptionDom}
            rows="5"
            cols="90"
            placeholder="Enter description"
            className={classes.textarea}
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className={classes.submit_button}
            disabled={isloading}
          >
            {isloading ? "Updating..." : "Post Question"}
          </button>
        </form>
)}

              <h2>
                <img src={QA} width={45} alt="" />{" "}
                <span>
                  <h4>Answer From The Community</h4>
                </span>
              </h2>
            </div>

            <div className={classes.one_question}>
              <div className={classes.all_answer}>
                {values.map((value, i) => (
                  <div key={i}>
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
                          <TbDotsVertical
                            size={25}
                            onClick={() => setshowAll(!showAll)}
                          />
                          {value?.username == user?.username && (
                          // {showAll && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={classes.display}
                            >
                              <FaTrashAlt
                               onClick={() => confirmDeleteQuestion(value.answer)}
                                style={{
                                  cursor: "pointer",
                                  color: "red",
                                  fontSize: "20px",
                                }}
                                className={classes.delete}
                              />
                              <MdEdit
                                onClick={() =>
                                  editAnswer(value.answerid, value.answer)
                                }
                                style={{
                                  cursor: "pointer",
                                  color: "gray",
                                  fontSize: "20px",
                                }}
                                className={classes.edit}
                              />
                            </div>
                          )}
                          {/* //  )} */}
                        </div>
                      </div>

                      <div className={classes.answer}>{value.answer}</div>
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
                    <h3>Answer The Top Question </h3>
                    <img src={handpointer} alt="" />
                    <Link to="/all-questions">Go to question page</Link>
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
