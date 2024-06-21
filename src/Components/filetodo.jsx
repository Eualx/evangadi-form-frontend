router.post('/quesearch', authMiddleware, search)



async function search(){
    try{
      const info =await axios.post(`/questions/quesearch`,{
        stringQuery:val
      },{ headers:{
        Authorization: 'Bearer ' + token,}
      })
      setSearch(info.data)
    }
    catch (error){
      console.log(error);
    }
   }


   async function search(req,res){
    try {
      
         const {stringQuery}=req.body
         const query ="SELECT question.title, users.username FROM questions INNER users ON questions.userid=users.userid WHERE questions.title LIKE ? "
         result=await dbConnection.query(query,[`%${stringQuery}%`])
         return res.status(StatusCodes.OK).json(result)
    
    } catch (error) {
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"wrong trial"})
    }
   }


  //  <FaTrashAlt  onClick={() => handleDelete(value.id)} className={classes.delete} />
  //  <MdEdit className={classes.edit} />