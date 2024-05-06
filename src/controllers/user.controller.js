const userService = require('../services/user.service');
const userRoutes = require('../routes/user.routes');
const database = require('../dao/inmem-db');
const logger = require('../util/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userController = {
    create: (req, res, next) => {
        const user = req.body

        // Validate user input
        // const validationResult = userRoutes.validateUserCreate(user)
        // if (validationResult.error) {
        //     return next({
        //         status: 400,
        //         message: validationResult.error.details[0].message,
        //         data: {}
        //     })
        // }

        logger.info('create user', user.firstName, user.lastName)
        userService.create(user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAll: (req, res, next) => {
        logger.trace('getAll')
        userService.getAll((error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getById: (req, res, next) => {
        const userId = req.params.userId
        logger.trace('userController: getById', userId)
        userService.getById(userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },
    // Todo: Implement the update and delete methods
    update: (req, res, next) => {
        const userId = req.params.userId
        const user = req.body
        userService.update(userId, user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    delete: (req, res, next) => {
        const userId = req.params.userId
        userService.delete(userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    loginUser: async (req, res, next) => {
        const { emailAddress, password } = req.body;
        console.log("Logging in with:", emailAddress, password);
        database.findByEmail(emailAddress, async (err, user) => {

          if (err || !user) {
            console.log("User not found or error:", err);
            return res.status(401).json({ error: 'Authentication failed' });
          }
   
          console.log("User found, comparing password for user:", user);
          if (password === user.password || await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
              { userId: user.id, email: user.emailAddress },
              'your_jwt_secret',
              { expiresIn: '1h' }
            );
   
            user.token = token; // Save the token inside the user object
            
            res.json({ message: 'Login successful', user });
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
    
}

module.exports = userController
