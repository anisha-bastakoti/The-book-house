const express = require('express');
const router = express.Router();

// Render the admin login page
router.get('/login', (req, res) => {
  res.render('adminlogin');
});
router.get('/dashboard',(req,res)=>{
    res.render('admindashboard')
})
// Handle the admin login request
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password match
  if (email === 'admin@example.com' && password === 'adminpassword') {
    // Set the admin's authenticated state (e.g., session or token)
    req.session.isAdminLoggedIn = true;
    
    // Redirect to the admin dashboard or protected area
    res.redirect('/admin/dashboard');
   //res.send({sucess:true,message:"admin login in "})
  } else {
    // Invalid credentials

    res.render('adminlogin', { error: 'Invalid email or password' });
  }
});

module.exports = router;
