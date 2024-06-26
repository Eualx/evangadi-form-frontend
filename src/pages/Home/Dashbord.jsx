import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppState } from "../../App";
import Layout from "../Layout/Layout";
import classes from "./Home.module.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "../Axios/axiosConfig";
import profile from "../../assets/img/profile-user.png";
import userprofile from "../../assets/img/user.png";
import team from "../../assets/img/team-spirit.png";
import Animationpage from "../Animation/Animationpage";
import Loader from "../../Components/Loader";
import Highlighter from 'react-highlight-words'
import { IoSearchOutline } from "react-icons/io5";
function Dashbord() {
  const { user } = useContext(AppState);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [greeting, setGreeting] = useState(false);
  // const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const[val, setVal]=useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] =useState(5) ;

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
  };
  useEffect(() => {
    AllQuestions();
  }, [setValues]);
  useEffect(() => {}, [values]);

  // search
  // const filter = values?.filter((value) => {
  //   return (
  //     value.title.toLowerCase().includes(search.toLowerCase()) ||
  //     value.username.toLowerCase().includes(search.toLowerCase())
  //   );
  // });

  // to find the answer page

  function Detail(questionid) {
    navigate(`/${questionid}`);
  }

// serach 

useEffect(() => {
  setSearchResults(values); // Initialize searchResults with all values
}, [values]);
  const searchQuestion = async () => {
    if (val.trim() === "") {
      setSearchResults(values); 
      // setCurrentPage(1) // Reset search results to all questions if search query is empty
      return;
    }

    try {
      const { data } = await axios.post(
        "/questions/quesearch",
        { stringQuery: val },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setSearchResults(data);
      // setCurrentPage(1) // Update the state with the search results
    } catch (error) {
      console.log(error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setVal(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults(values); // Reset search results to all questions if search query is empty
      setCurrentPage(1)
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    searchQuestion(); // Trigger the search
  };
  // pagination
  // const handleSearchChange = (e) => {
  //   setSearch(e.target.value);
  //   setCurrentPage(1); // Reset to first page on search
  // };

  //Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

 

  return (
    <Layout>
      <Animationpage>
        {isloading ? (
          <Loader />
        ) : (
          <div className={classes.Home_container}>
            <div
              className={classes.top_container}
              onMouseLeave={() => setGreeting(false)}
            >
              <button type="submit">
                <Link to="/all-questions">Do you have questions?</Link>
              </button>
              <div className={classes.welcome_message}>
                <h2>Welcome: Dear {user?.username}</h2>
              </div>
              <div onMouseOver={() => setGreeting(true)}>
                <img src={userprofile} width={60} alt="" />
              </div>
            </div>

            {greeting && (
              <div className={classes.greet}>
                <p>
                  {" "}
                  You are in the right place to ask any questions <br /> that
                  confuse you or if you want to know more details
                </p>
                <img src={team} alt="" />
              </div>
            )}

            <br />
            <h3> The Latest Questions</h3>

            <div className={classes.search}>
              {/* <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search question"
              /> */}
              <div>
                
              
<form onSubmit={handleSubmit} action=""><input
          type="text"
          value={val}
          onChange={handleInputChange}
          placeholder="Search questions..."
          className={classes.search_input}
        />
   </form>
            </div>
            <div>
            <IoSearchOutline onClick={handleSubmit} size={30}
        className={classes.search_button}/>
            </div>
            </div>
            {searchResults.length > 0 ? (

currentItems.map((value, i) => (
              <div
                onClick={() => Detail(value.questionid)}
                key={i}
                className={classes.one_question}
              >
                <div className={classes.button}>
                  <Link to={`/${value.questionid}`}>
                    <div className={classes.button}>
                      <div className={classes.profile}>
                        <div>
                          <img src={profile} width={80} alt="" />
                        </div>
                        <div className={classes.username}>
                          {value?.username}
                        </div>{" "}

                      </div>

                      <Highlighter
                highlightClassName={classes.highlight}
                searchWords={[val]}
                autoEscape={true}
                textToHighlight={value?.title}
              />

                      <div className={classes.title}>
                        <span className={classes.titleinside}>
                          {/* {value?.title} */}
                        </span>{" "}
                        <span className={classes.arrow}>
                          <MdKeyboardArrowRight size={55} />{" "}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

              </div>
            )) 
          ):(<p>No result Found</p>)}

      
            <div className={classes.pagination}>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            </div>
       
        )}
      </Animationpage>
    </Layout>
  );
}
export default Dashbord;
