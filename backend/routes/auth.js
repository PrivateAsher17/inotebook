const express = require('express')
var User = require("../models/User")
const router = express.Router()
const { body, validationResult } = require('express-validator');


// create a User using: POST "/api/auth". Doesnt require authentication
router.post('/', [
    body('email','Enter a valid Email').isEmail(),
    body('name','Enter a valid Name').isLength({ min: 3 }),
    body('password','password must be of five characters').isLength({ min: 5 }),
], (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.send(req.body)
})

module.exports = router