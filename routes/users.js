const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const emailKey = config.get('SENDGRID_API_KEY');
const sgMail = require('@sendgrid/mail');

// User Model
const User = require('../models/User');

// @route   POST    api/users
// @desc    Register a user
// @access  Public
router.post('/', async (req, res) => {
  const { firstName, lastName, phone, password, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new User
    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save to DB
    await user.save();

    // JWT Payload
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        expiredAt: user.expiredAt,
      },
    };

    // Json web token generate
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).res.send('Server Error...');
  }
});

module.exports = router;
