const bcrypt = require('bcrypt');
const db = require('../models'); // Import the models

const login = async (req, res) => {
  const { identifier, password } = req.body; // Use a common identifier field

  try {
    // First, try to find a user by username
    let user = await db.User.findOne({ where: { username: identifier } });
    
    // If user not found, check if it's a studentId
    if (!user) {
      user = await db.Student.findOne({ where: { studentId: identifier } });
    }

    // Log the found user
    console.log("User found:", user);

    if (!user) {
      return res.status(400).send('Invalid username or student ID or password');
    }

    // Verify the password
    const validPassword = bcrypt.compareSync(password, user.password);
    console.log("Password valid:", validPassword);

    if (!validPassword) {
      return res.status(400).send('Invalid username or student ID or password');
    }

    // Redirect based on whether the user is a student or an admin
    if (user instanceof db.Student) { // Check if user is an instance of Student
      return res.render('student', { fname: user.fname }); // Pass fname to the view
    } else if (user instanceof db.User) { // Assuming user type is admin
      return res.redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  login
};
