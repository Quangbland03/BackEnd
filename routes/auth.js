const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/Auth');
const OrderModel = require('../models/Order');
var router = express.Router();

//register
router.post('/register', async (req, res) => {
  try {
    const newUser = req.body;

    const existingUser = await AuthModel.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(400).json({ email: 'Email is already in use' });
    }

    if (newUser.password != null && newUser.password.length >= 6) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
    }

    await AuthModel.create(newUser);
    res.send(newUser)
  } catch (error) {
    
    if (error.name === 'ValidationError') {
      let inputErrors = {};
      for (let er in error.errors) {
        inputErrors[er] = error.errors[er].message;

      }
      res.status(400).json(inputErrors);
    } else {
      console.error(error);
      res.status(500).send('Internal Server Error' + error);
    }
  }
});


//login 
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await AuthModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        email: 'Email is incorrect',
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        password: 'Password is incorrect',
      });
    }
    const token = jwt.sign({ userId: user._id }, '262003', { expiresIn: '1h' });
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

//logout
router.get('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});


const verify = () => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, "262003", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid!" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};

//get user
router.get('/getUser', verify(), async (req, res) => {
  const userId = req.user.userId;
console.log(userId)
 var user = await AuthModel.findById(userId )
  res.send(user);
});
router.get('/orders1',verify(), async function (req, res) {
  try {
      var orders = await OrderModel.find({ UserId:req.user.userId});
      res.status(200).send(orders);
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});
module.exports = router;
