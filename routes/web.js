const express = require('express')
const FrontController = require('../controllers/FrontController')
const CourseController = require('../controllers/CourseController')
const router = express.Router()
const checkAuth = require('../middleware/auth')
const AdminController = require('../controllers/Admin/AdminController')


// Routing localhost:3000

router.get('/dashboard',checkAuth, FrontController.dashboard)
router.get('/about',checkAuth, FrontController.about)
router.get('/contact',checkAuth, FrontController.contact)
router.get('/', FrontController.login)
router.get('/registration', FrontController.registration)
router.get('/editProfile',checkAuth,FrontController.editProfile)
router.get('/updatePassword',checkAuth,FrontController.updatePassword)
router.post('/varify_login',FrontController.varifyLogin)
router.post('/updateProfile',checkAuth,FrontController.updateProfile)
router.post('/changePassword',checkAuth,FrontController.changePassword)
//admin controller
router.get('/admin/getAllData',checkAuth,AdminController.GetAllData)
router.post('/update_status/:id',checkAuth,AdminController.updateStatus)


//user insert   user data
router.post('/user_insert',FrontController.userInsert)


//course controller  
router.post('/course-insert',checkAuth,CourseController.courseInsert)
router.get('/courseDisplay',checkAuth,CourseController.courseDisplay)
router.get('/courseView/:id',checkAuth, CourseController.courseView)
router.get('/courseEdit/:id',checkAuth, CourseController.courseEdit)
router.post('/courseUpdate/:id',checkAuth,CourseController.courseUpdate)
router.get('/courseDelete/:id',checkAuth, CourseController.courseDelete)

router.get('/logout',FrontController.logout)



module.exports = router