const express = require('express')
var User = require("../models/User")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "ashwaniisagoodboy"

var fetchuser = require("../middleware/fetchuser")


// Route 1: create a User using: POST "/api/auth/createuser". Doesnt require authentication
router.post('/createuser', [
    body('email','Enter a valid Email').isEmail(),
    body('name','Enter a valid Name').isLength({ min: 3 }),
    body('password','password be minimum of five characters').isLength({ min: 5 }),
], async (req, res)=>{
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
    let user = await User.findOne({email: req.body.email})
    if (user){
      return res.status(400).json({error: "Sorry a user with this email already exists"})
    }
    const salt = await bcrypt.genSalt(10)
    const secPass = await bcrypt.hash(req.body.password, salt) 
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })

    const data={
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    console.log(authtoken);

    // res.json(user)
    res.json({authtoken})

    // .then(user => res.json(user))
    // .catch(err=>{console.log(err) 
    // res.json({error: 'Please enter a unique value for email', message: err.message})})
  } catch (error) {
      console.error(error.message)
      res.status(500).send("Internal Server Error")
  }
})

// Route 2: Authentication: POST "/api/auth/login".
router.post('/login', [
  body('email','Enter a valid Email').isEmail(),
  body('password','Password cannot be empty').exists(),
], async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email, password} = req.body
  try {
    let user = await User.findOne({email})
    if (!user){
      return res.status(400).json({error: "Please try to login with correct credentials"})
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare){
      return res.status(400).json({error: "Please try to login with correct credentials"})
    }
    const data={
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    console.log(authtoken);
    res.json({authtoken})

  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }

  // Route 3: Get Loggedin User Details using POST "/api/auth/getuser". Login Required
  router.post('/getuser',fetchuser, async (req, res)=>{
  try {
    // const userId = req.user.id;
    const user = await User.findById(req.user.id).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
  }
})
})


module.exports = router