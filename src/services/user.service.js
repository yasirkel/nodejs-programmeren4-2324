const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user)
        database.add(user, (err, data) => {
            if (err) {
                logger.info(
                    'error creating user: ',
                    err.message || 'unknown error'
                )
                callback(err, null)
            } else {
                logger.trace(`User created with id ${data.id}.`)
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        logger.info('getAll')
        database.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },

    update: (userId, user, callback) => {
        database.update(userId, user, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User with id ${userId} updated.`,
                    data: data
                })
            }
        })
    },

    delete: (userId, callback) => {
        database.delete(userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User with id ${userId} deleted.`,
                    data: data
                })
            }
        })
    },

    getById: (userId, callback) => {
        database.getById(userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found user with id ${userId}.`,
                    data: data
                })
            }
        })
    }
}

module.exports = userService
