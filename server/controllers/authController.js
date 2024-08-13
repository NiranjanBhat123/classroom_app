const jwt = require('jsonwebtoken');
const Principal = require('../models/principal');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const principal = await Principal.findOne({ email });

    if (!principal || principal.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: principal._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};