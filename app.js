const express = require('express')
const app = express()
const port = 3000
const web = require('./routes/web')
const connectDb = require('./db/connectDb')
const session = require('express-session')
const flash = require('connect-flash');
//cookies
const cookieparser = require('cookie-parser')
app.use(cookieparser())

const fileUpload= require("express-fileupload");
//for file upload
app.use(fileUpload({useTempFiles:true}));
// view engine use for html or css
app.set('view engine','ejs')
//connection to mongoDb
connectDb()

app.use(session({
    secret: 'secret',
    cookie: {maxAge:60000},
    resave: false,
    saveUninitialized: false,

}));

app.use(flash());

// insert css and image
app.use(express.static('public'))

//data get

//parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))

// router load 
app.use('/', web)












// Create Searver
app.listen(port, () => {
    console.log(`Server start on port localhost:${port}`)
  })