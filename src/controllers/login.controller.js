const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');


// Export the login controller function
module.exports = loginController;

// Define your login controller function
const loginController = {

    loginUser: async (req, res, next) => {
        const { emailAddress, password } = req.body;
        console.log("Logging in with:", emailAddress, password);
        database.findByEmail(emailAddress, async (err, user) => {
          if (err || !user) {
            console.log("User not found or error:", err);
            return res.status(401).json({ error: 'Authentication failed' });
          }
   
          console.log("User found, comparing password for user:", user);
          if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
              { userId: user.id, email: user.emailAddress },
              'your_jwt_secret',
              { expiresIn: '1h' }
            );
   
            res.json({ message: 'Login successful', token, user });
          } else {
            console.log("Password comparison failed");
            const error ={
              status:401,
              result: 'Authentication failed'
            }
            next(error)
          }
        });
      },
};

// Export the login controller function
module.exports = loginController;