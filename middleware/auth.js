const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

const checkAuth = async (req, res, next) => {
    // console.log('hello middleware')
    const { token } = req.cookies
    // console.log(token)
    if (!token) {
        req.flash('error', 'Unauthorized user Please Login')
        res.redirect('/')
    } else {
        const verifyToken = jwt.verify(token, 'jfhfhfdhyv')
        //    console.log(verifyToken)
        const data = await UserModel.findOne({ _id: verifyToken.ID })
        // console.log(data)
        req.data1 = data;
        next()
    }
};

module.exports = checkAuth
// this is for security purpose