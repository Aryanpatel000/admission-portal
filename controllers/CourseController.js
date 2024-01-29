const CourseModel = require('../models/Course')
const { params } = require('../routes/web')
const nodemailer = require('nodemailer')
class CourseController {
    static courseInsert = async (req, res) => {
        try {
            const { id } = req.data1;
            // console.log(req.body)
            const { name, email, phone, city, address, course } = req.body
            const result = new CourseModel({
                name: name,
                email: email,
                phone: phone,
                city: city,
                address: address,
                course: course,
                userId: id


            })
            await result.save()
            res.redirect('/courseDisplay')//redirect me hamesh router ka url ata hai 

        } catch (error) {
            console.log(error)
        }
    }
    static courseDisplay = async (req, res) => {
        try {
            const data = await CourseModel.find()
            // console.log(data)
            const { name, image } = req.data1;
            res.render('courseDisplay', { d: data, n: name, img: image });
        } catch (err) {
            console.log(err)
        }
    }

    static courseView = async (req, res) => {
        try {
            // console.log(req.params.id)
            const data = await CourseModel.findById(req.params.id)
            const { name, image } = req.data1;
            res.render('courseView', { d: data, n: name, img: image });

        } catch (err) {
            console.log(err)
        }
    }

    static courseEdit = async (req, res) => {
        try {
            // console.log(req.params.id)
            const data = await CourseModel.findById(req.params.id)
            const { name, image } = req.data1;
            res.render('courseEdit', { d: data, n: name, img: image })

        } catch (err) {
            console.log(err)
        }
    }

    static courseUpdate = async (req, res) => {
        try {
            // console.log(req.params.id)
            // console.log(req.body)
            
            const { name, email, phone, city, address, course } = req.body
            const data = await CourseModel.findByIdAndUpdate(req.params.id, {
                name: name,
                email: email,
                phone: phone,
                city: city,
                address: address,
                course: course,
            })
            await data.save()

         this.sendEmail(name, email, course)
            res.redirect('/courseDisplay')//route ka path

        } catch (err) {
            console.log(err)
        }
    }

    static courseDelete = async (req, res) => {
        try {
            await CourseModel.findByIdAndDelete(req.params.id)
            res.redirect('/courseDisplay')//route ka path

        } catch (err) {
            console.log(err)
        }
    }

    static sendEmail = async (email, name, course) => {

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



module.exports = CourseController