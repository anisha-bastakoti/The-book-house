
const sendToken = (user, statusCode, res)=>{


    const token = user.getJwtToken();
    // options for cookie
    const options = {
            expire:Date.now() + 5 * 24 * 60 * 60 * 1000,
            httpOnly:true,
        }
    
    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        user,
        token
    })
}


module.exports = sendToken