const UserModel = require('../models/User')
const TeacherModel = require('../models/Teacher')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;
const CourseModel = require("../models/Course")
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


class FrontController {

    static dashboard = async (req, res) => {
        try {

            // console.log(req.data1);
            const { name, image, id } = req.data1
            const btech = await CourseModel.findOne({ userId: id, course: 'btech' });
            const BCA = await CourseModel.findOne({ userId: id, course: 'BCA' });
            const mca = await CourseModel.findOne({ userId: id, course: 'mca' });
            // console.log(btech)
            res.render('dashboard', { msg: req.flash("success"), n: name, img: image, b: btech, BCA: BCA, mca: mca });
        } catch (error) {
            console.log(error)
        }
    }
    static about = (req, res) => {
        try {
            const { name, image } = req.data1
            res.render('About', { n: name, img: image })
        } catch (error) {
            console.log(error)
        }
    }


    static contact = (req, res) => {
        try {
            const { name, image } = req.data1
            res.render('contact', { n: name, img: image })
        } catch (error) {
            console.log(error)
        }
    }

    static login = (req, res) => {
        try {
            res.render('login', { msg: req.flash('success'), msg1: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }

    static registration = (req, res) => {
        try {
            res.render('registration', { msg: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }

    static editProfile = async (req, res) => {
        try {
            //    console.log(req.data1)
            const { name, image,email } = req.data1
            res.render('editProfile', { n: name, img: image ,e:email})
            
        } catch (error) {
            console.log(error)
        }
    }

    static updateProfile = async (req, res) => {
        try {
            //    console.log(req.data1)
            const { id } = req.data1
            const { name, image, email } = req.body
            if (req.files) {
                const user = await UserModel.findById(id)
                const imageID = user.image.public_id
                // console.log(imageID)

                //deleting image from cloudinary

                await cloudinary.uploader.destroy(imageID)

                // new image update

                const file = req.files.image //for upload image cloudinary
                const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'profileImage'
                });
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageUpload.public_id,
                        url: imageUpload.secure_url
                    }


                }

            } else {
                var data = {
                    name: name,
                    email: email,
                }
            }
            await UserModel.findByIdAndUpdate(id, data)
            req.flash('success', "update Profile Successfully")
            res.redirect('/editProfile')


        } catch (error) {
            console.log(error)
        }
    }

    static updatePassword = async (req, res) => {
        try {
            //    console.log(req.data1)
            const { currentPassword,newPassword,confirmPasssword,image } = req.data1
            res.render('updatePassword', { cp: currentPassword, np: newPassword ,CP:confirmPasssword,img:image})
            


        } catch (error) {
            console.log(error)
        }
    }


    static changePassword = async (req, res) => {
        try {
            //    console.log(req.body)
            const { cp, np, CP } = req.body
            const { id } = req.data1
            if (cp && np && CP) {
                const user = await UserModel.findById(id)
                const isMatched = await bcrypt.compare(cp, user.password)

                console.log(isMatched)
                if (!isMatched) {
                    req.flash('error', 'Current password is incorrect')
                    res.redirect('/updatePassword')
                } else {
                    if (np != cp) {
                        req.flash('error', 'Password does not match')
                        res.redirect('/updatePassword')
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('error', 'ALL fields are required')
                        res.redirect('/updatePassword')
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    //get user sign in data
    static userInsert = async (req, res) => {
        try {
            console.log(req.files.image)
            const file = req.files.image //for upload image cloudinary
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'profileImage'
            });

            // console.log(imageUpload);        
            //console.log(req.body)
            const { n, e, p, cp } = req.body
            const user = await UserModel.findOne({ email: e })
            // console.log(user)
            if (user) {
                req.flash('error', 'Email Already Exist')
                res.redirect('/registration')
            } else {
                if (n && e && p && cp) {
                    if (p === cp) {
                        const hashpassword = await bcrypt.hash(p, 10)
                        const result = new UserModel({
                            name: n,
                            email: e,
                            password: hashpassword,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }

                        })
                        await result.save()
                        req.flash('success', 'Registration Succesfully, Please Login')
                        res.redirect('/') // redirect to login page
                    } else {
                        req.flash('error', 'Password and Confirm Password does not match')
                        res.redirect('/registration')
                    }
                } else {
                    req.flash('error', 'All field are Required')
                    res.redirect('/registration')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    static TeacherModel = async (req, res) => {
        try {
            //console.log(req.body)
            const { name, email, password, } = req.body
            const result = new TeacherModel({
                name: name,
                email: email,
                password: password,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            })
            await result.save()
            res.redirect('/')//router ka url     user_insert vala
        } catch (error) {
            console.log(error)
        }
    }
    // varify login
    static varifyLogin = async (req, res) => {
        try {
            console.log(req.body)
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                // console.log(user)
                if (user != null) {
                    const isMatched = await bcrypt.compare(password, user.password)
                    //console.log(isMatched)
                    if (isMatched) {
                        //console.log(user.role)
                        if (user.role == 'admin') {
                            const token = jwt.sign({ ID: user.id }, 'jfhfhfdhyv');
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/admin/getAllData')
                        }
                        if (user.role == 'student') {
                            const token = jwt.sign({ ID: user.id }, 'jfhfhfdhyv');
                            //console.log(token)
                            res.cookie('token', token)
                            res.redirect('/dashboard')
                        }

                    } else {
                        req.flash('error', 'Email & Password does not Match, Try Agian')
                        res.redirect('/')
                    }
                } else {
                    req.flash('error', 'You are not Registered User, Please Register')
                    res.redirect('/')
                }
            } else {
                req.flash('error', 'All field are Required')
                res.redirect('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (err) {
            console.log(error);
        }
    }

    static sendEmail = async (email,name, course) => {
       
        //connenct with the smtp server
    
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
    
          auth: {
            user: "patel.aryanbhai246@gmail.com",
            pass: "axqp cctn pkbs psbq",
          },
});
        let info = await transporter.sendMail({
          from: "test@gmail.com", // sender address
          to: email, // list of receivers
          subject: 'Course Registration Successfully, Please wait', // Subject line
          text: "hello", // plain text body
          html: `<b>${name}</b> Registration for  <b>${course}</b> successful! `, // html body
        });
};

}
module.exports = FrontController