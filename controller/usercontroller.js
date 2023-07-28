//register user
const asynchandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateOTP = require("../server/services/generateOTP");
require("dotenv").config();
const nodemailer = require("nodemailer");
//import schememodel
const Register = require("../model/schema");
const { Cookie } = require("cookie-parser");
const imageSchema = require("../model/image");
const jwt = require("jsonwebtoken");

//sendverfiymail
let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "barshapoddar986@gmail.com",
    pass: "mrlbsansrghpfilq",
  },
});

const sendEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const otp = generateOTP();

  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "OTP form The book house ",
    text: ` Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
};

//for register
const register = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  //checking all fields are filled out
  if (!name || !email || !password || !confirmpassword) {
    req.flash("message", "All fields are required");
    return res.redirect("/register");
    //res.send({sucess:true,message:"All fields are required"})
  }
  try {
    const userAvailable = await Register.findOne({ email });
    if (userAvailable) {
      res.send({ sucess: true, message: "Already exist user" });
      req.flash("message", "Already exist user");
      return res.redirect("/register");
    }
    //checking invalid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.flash("message", "Invalid email format");
      //res.send({sucess:true,message:"Invalid email format"})
      return res.redirect("/register");
    }
    if (password !== confirmpassword) {
      req.flash("message", "Passwords do not match");
      return res.redirect("/register");
    }
    //creating hashpassword
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("hashpassword:", hashPassword);
    const otp = generateOTP();
    //creating new user
    const user = await Register.create({
      name,
      email,
      password: hashPassword,
      confirmpassword: hashPassword,
      otp,
    });
    //create token
    const token = jwt.sign({ user_id: user._id, email }, "jwduedhnjnxjkks", {
      expiresIn: "2h",
    });
    // save user token
    user.tokens.push({ token });
    await user
      .save()
      .then(() => {
        console.log("Token saved successfully");
        // Continue with your logic
      })
      .catch((error) => {
        console.log("Error saving token:", error);
        // Handle the error
      });
    console.log(token);

    if (user) {
      // Send the OTP email after successful registration
      const mailOptions = {
        from: "barshapoddar986@gmail.com",
        to: email,
        subject: "OTP Verification",
        text: `Your OTP for registration is: ${otp}.
      this code expires in 1 hr `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          req.flash("message", "Email sent successfully.");
          //req.flash('message','Email sent successfully")
    return res.redirect("/verifyotp");
        }
      });
      res.render("otp");
      // res.send({ success: true, message: "Registered successfully" });
      return;
      //req.flash('message','Registration successful.');
      //res.send({success:true,message:"register sucessfully "})
      //return res.render('login', { message: req.flash('message') }); // Pass the message to the register pag
    }
  } catch (error) {
    console.log(error);
    req.flash("message", "Registration failed");
    return res.redirect("/register");
  }
};

//for login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await Register.findOne({ email: email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      user.is_verified = true;
      await user.save();
      console.log("logged in vako user email : ", user);

      if (passwordMatch) {
        //user is valid.
        //save data to session.

        req.session.userDetail = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        console.log("set vako session ", req.session.userDetail);

        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          "jwduedhnjnxjkks",
          {
            expiresIn: "2h",
          }
        );
        // save user token
        user.tokens.push({ token });
        user
          .save()
          .then(() => {
            console.log("Token saved successfully");
            // Continue with your logic
          })
          .catch((error) => {
            console.log("Error saving token:", error);
            // Handle the error
          });
        user.token = token;
        return res.status(201).redirect("products");
      } else {
        req.flash("message", "password didn't match");
        console.log("password didn't match");
        return res.redirect("/login");
      }
    } else {
      // User with the provided email does not exist
      req.flash("message", "user doesn't exist");
      console.log("user doesn't exist");
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("an error occured");
  }
}
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userEmail = await Register.findOne({ email: email });

    if (userEmail) {
      if (userEmail.otp !== otp) {
        req.flash("message", "Invalid OTP");
        return res.redirect("/verifyotp");
      }

      // OTP is correct
      // Set the session variable to indicate successful OTP verification
      req.session.otpVerified = true;
      req.flash("message", " now you can login ");
      return res.redirect("/login");
    } else {
      // User with the provided email does not exist
      res.send({ sucess: false, msg: "User doesn't exist" });
      req.flash("message", "User doesn't exist");
      return res.redirect("/verifyotp");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("An error occurred");
  }
};
const userprofile = async (req, res) => {
  try {
    // Fetch user data from the database
    const user = await imageSchema.findById(req.user.id);

    if (!user) {
      // Handle case when user is not found
      return res.status(404).send("User not found");
    }
    res.send({ sucess: true, user });
    //res.render('userprofile', { users:user });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

//myprofile
const getProfile = async (req, res) => {
  if (!req.session.userDetail) {
    res.render("templates/unauthorized_user");
  }

  try {
    res.render("profile", {
      success: true,
      message: "Recently logged in user retrieved successfully",
      userDetail: req.session.userDetail,
    });
  } catch (error) {
    console.log(error);
  }
};

// Add reviews and ratings for Products

//for verying register
module.exports = {
  register,
  login,
  sendEmail,
  verifyOtp,
  getProfile,
  userprofile,
};
