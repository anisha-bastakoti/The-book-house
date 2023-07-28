const Register = require('../model/schema');
const nodemailer=require('nodemailer');
//const randomstring=require('randomstring');
const trycatchError = require("../middleware/trycatchError");
const { token } = require('morgan');
const bcrypt=require('bcrypt');


const sendresetpasswordEmail= trycatchError(async(name,email,token)=>{
    let transporter = nodemailer.createTransport({
        service:"gmail",
        secure: false,
        auth: {
          user: "barshapoddar986@gmail.com",
          pass: "mrlbsansrghpfilq"
        },
      });
      const mailOptions = {
        from: "barshapoddar986@gmail.com",
        to: email,
        subject: " For Reset password",
        text: `<p> hii `+name+ `,please copy the link and <a href="http://localhost:3000/resetpassword?token =`+token +`"> `

      }
   transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
     // req.flash('message','Email sent successfully.');
      //req.flash('message','Email sent successfully")
//res.redirect('/verifyotp');
console.log ("mail has been send:-",info.response)
    }
  });
})
//secured password
const securePassword=async(password)=>{
  try{
    const passwordHash = await bcrypt.hash(password,10);
    return passwordHash;

  }catch(error){
    console.log (error)}
}

const randomstring = require('randomstring');



  const mongoose = require('mongoose');

const forgotPassword = trycatchError(async (req, res, next) => {
  const user = await Register.findOne({ email: req.body.email });

  if (user) {
    const randomString = randomstring.generate();
    const tokenObj = new mongoose.Types.ObjectId(); // Generate a new ObjectId

    // Update the "tokens" array with a new embedded document
    user.tokens.push({ _id: tokenObj, token: randomString });

    const data = await user.save(); // Save the updated document

    sendresetpasswordEmail(user.name, user.email, randomString);
    res.render('reset-password')
    //res.send({ success: true, msg: 'Please check your email' });
  } else {
   // res.send({ success: false, msg: 'Your email does not exist' });
   res.render('reset-password')
  }

});


const resetpassword = trycatchError(async (req, res, next) => {
    const token= req.query.token;
    const tokenData = await Register.findOne({token:token});
    if (tokenData){
        const   password = req.body.password; 
        const securepassword=  await securePassword(password); 
       // const   confirmPassword = req.body.confirmPassword; 
       const userData= await Register.findByIdAndUpdate({_id:tokenData._id},{$set:{password:securepassword,confirmpassword:securepassword,token:''}},{new:true})
       res.render('login')
      // res.send({msg:"user password has been reset",userData})

    }
})

  
const logOutUser = trycatchError(async (req, res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  });

module.exports = { forgotPassword,resetpassword,
    logOutUser };
