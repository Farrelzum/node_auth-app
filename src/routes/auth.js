const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const sendActivationEmail = require('../services/emailService');

const hasCapitalLetter = (string) => /[A-Z]/.test(string);

router.post('/register', async (req, res) => {
  const saltRounds = 10;
  const activationToken = uuidv4();

  try {
    const { name, email, password } = req.body;

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password too short' });
    } else if (!hasCapitalLetter(password)) {
      return res
        .status(400)
        .json({ message: 'Password must contain at least one capital letter' });
    }

    const userExist = await User.findOne({ where: { email: email } });

    if (userExist) {
      return res.status(400).json({ message: 'This email is already in use' });
    }

    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hash,
      activationToken: activationToken,
    });

    await sendActivationEmail(email, activationToken);

    res.status(201).json({
      message:
        // eslint-disable-next-line max-len
        'User registered successfully. Please check your email to activate your account.',
      user: {
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
