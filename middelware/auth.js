const islogin=async(req,res,next)=>{
try{
  if(req.session.user_id){
  }
  else{
  req.redirect('/');
  }
  next();
}
catch(error)
{
    console.log(error.message);
}
}

const islogout=async(req,res,next)=>{
    try{
    if(req.session.user_id){
        req.redirect( '/');
    }
    next();
    }
    catch(error)
    {
        console.log(error.message);
    }
    }

module.exports={
    islogin,islogout
}