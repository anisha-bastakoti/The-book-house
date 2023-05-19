const mongoose =require('mongoose');
  mongoose .connect("mongodb://127.0.0.1:27017/loginreg",{
    useNewUrlParser:true,
    useUnifiedTopology:true

    
}).then(()=>{
    console.log("connection sucesfully");
}).catch((e)=>{
    console.log("no connection")
})
    