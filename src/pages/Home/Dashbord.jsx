import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppState } from '../../App'
import Layout from '../Layout/Layout'
import classes from './Home.module.css'
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom'
import axios from '../Axios/axiosConfig'
import profile from "../../assets/img/profile-user.png"
import userprofile from '../../assets/img/user.png'
import team from '../../assets/img/team-spirit.png'
import Animationpage from '../Animation/Animationpage'
import Loader from '../../Components/Loader'
import { FaTrashAlt } from "react-icons/fa";
function Dashbord() {
  const {user} =useContext(AppState)
  const token = localStorage.getItem("token")
const navigate=useNavigate()
const [values, setValues]=useState([])
const [greeting, setGreeting]=useState(false)
const [search, setSearch]=useState("")
const [isloading, setIsLoading]=useState(false)
// const [question, setQuestion] = useState([]);


 // Pagination state
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;

const AllQuestions = async () => {
  try {
    const { data } = await axios.get("/data/combined", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log(data);
    setValues(data);
  } catch (error) {
    console.log(error.response);
  }
}
useEffect(() => {
  AllQuestions();
}, [setValues]);
useEffect(() => {

}, [values]);

  // search 
    const filter= values?.filter((value) => {
      return (
        value.title.toLowerCase().includes(search.toLowerCase()) ||
        value.username.toLowerCase().includes(search.toLowerCase())
      );
    });




    // to find the answer page

    function Detail(questionid) {
      navigate(`/${questionid}`);
    }


// pagination
const handleSearchChange = (e) => {
  setSearch(e.target.value);
  setCurrentPage(1); // Reset to first page on search
};

 // Pagination calculations
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentItems = filter.slice(indexOfFirstItem, indexOfLastItem);
 const totalPages = Math.ceil(filter.length / itemsPerPage);

 const handleNextPage = () => {
   setCurrentPage((prev) => Math.min(prev + 1, totalPages));
 };

 const handlePreviousPage = () => {
   setCurrentPage((prev) => Math.max(prev - 1, 1));
 };

 // delete the question

//  const [showConfirm, setShowConfirm] = useState(false);
//  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
//  const handleDeleteClick = (questionId) => {
//   setShowConfirm(true);
//   setSelectedQuestionId(questionId);
// };

// const confirmDelete = async (confirm) => {
//   if (confirm && selectedQuestionId !== null) {
//     await deleteQuestions(selectedQuestionId);
//   }
//   setShowConfirm(false);
//   setSelectedQuestionId(null);
// };
// {showConfirm && (
//   <div className="confirm-dialog">
//     <p>Are you sure you want to delete this question?</p>
//     <button onClick={() => confirmDelete(true)}>Yes</button>
//     <button onClick={() => confirmDelete(false)}>No</button>
//   </div>
// )}



 const deleteQuestions = async (questionid) => {
  try {
    const { data } = await axios.delete(`/questions/delete/${questionid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res)=>{
      AllQuestions();
      
    }).catch((err)=>{
      console.log("this catch ", err)
    })
    console.log(data);
    setValues((prevQuestions) =>
      prevQuestions.filter((value) => value.questionid !== questionid)
    );
    setShowConfirm(true);
  } catch (error) {
    console.log(error.response);
  }
};




  return (
    
    <Layout>
<Animationpage>
  {isloading ? (<Loader/>):( <div className={classes.Home_container}>
      <div className={classes.top_container} onMouseLeave={() => setGreeting(false)}>
        <button type="submit"><Link to="/all-questions">Do yo have questions?</Link></button> 
        <div className={classes.welcome_message}><h2>Welcome: Dear {user?.username}</h2></div>
      <div onMouseOver={() => setGreeting(true)}    >
      <img  src={userprofile} width={60} alt="" />
      </div>  

      </div>
      

      { greeting && 
  <div className={classes.greet}>

<p> You are in the right place to ask any questions <br /> that confuse you or if you want to know more details</p>
 <img src={team} alt="" />


</div>
} 



      <br />
      <h3> The Latest Questions</h3>


      <div className={classes.search}>
   <input onChange={(e)=>setSearch(e.target.value)} type="text" placeholder='Search question'/>



    
      </div>
      

{currentItems.map((value, i) => (
        <div onClick={()=>Detail(value.questionid)} key={i} className={classes.one_question}>
          <div  className={classes.button}>

          <Link to={`/${value.questionid}`}> 
        <div className={classes.button}>
            <div className={classes.profile}>
              <div>
          <img src={profile} width={70} alt="" />
          </div> 
            <div className={classes.username}>{value?.username}</div> </div> 
            <div className={classes.title}><span className={classes.titleinside}>{value?.title}</span> <span className={classes.arrow}><MdKeyboardArrowRight size={35}/> </span></div>
          
            </div>
          </Link> 
          </div>
          <div>

</div>


{value.username == user.username && <div onClick={(e) => e.stopPropagation()}>
              <FaTrashAlt
                onClick={() => deleteQuestions(value.questionid)}
                style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
              />
              </div>}
       


          
        </div>

        
      ))}



<div className={classes.pagination}>
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>)}
   


      
  
  

      </Animationpage>
 
    </Layout>
  
     
  )
}

export default Dashbord