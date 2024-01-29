const CourseModel = require('../../models/Course')
const  nodemailer= require('nodemailer')

class AdminController{
   static GetAllData = async(req,res)=>{
    try{
        const{name, image} = req.data1;
        const data = await CourseModel.find()
        // console.log(data)
        res.render('admin/getAllData',{n:name,img:image,d:data})
    }
    catch(error){
        console.log(errror)
    }
   }

   static updateStatus = async(req,res)=>{
    try{
       // console.log(req.body)
       const{comment, name, email, status, course} =req.body
    //    console.log( name, email, status,course)
       await CourseModel.findByIdAndUpdate(req.params.id,{
        comment: comment,
        status: status
       })
       this.sendEmail(name, email, status,course)
       res.redirect('/admin/getAllData')
    }
    catch(error){
       console.log(error)
    }
   }

   static sendEmail = async ( name, email, status,course) => {
    //   console.log( name, email, status,course)
    //   connenct with the smtp server

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
          subject: `Course ${status} Successfully`, // Subject line
          text: "hello", // plain text body
          html: `<b>${name}</b> ${course} course  <b>${status}</b> successful! `, // html body
      });
  };

}

module.exports = AdminController