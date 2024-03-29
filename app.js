const express=require('express');
const exphbs=require('express-handlebars');
const path=require('path');
const methodOverride = require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const bodyParser=require('body-parser');
const passport=require('passport');
const mongoose=require('mongoose');

const app=express();

// Load routes
const ideas=require('./routes/ideas');
// Load routes
const users=require('./routes/users');

// Passport config
require('./config/passport',(passport));
// Db Config
const db=require('./config/database');

// Map global promises -get rid of  warning
mongoose.Promise=global.Promise;
// Connect to mongoDb
mongoose.connect('mongodb://localhost/vidjot',{
    useMongoClient:true
})
.then(()=>console.log('MongoDb connected'))
.catch(err=>console.log('Error '));

//  Handle-bars middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
app.set('view engine','handlebars');
// Body parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Static folder
app.use(express.static(path.join(__dirname,'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session  middleware
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized: true
  }));

//   Passport middleware
  app.use(passport.initialize());
  app.use(passport.session);

  app.use(flash());
//   Global variables
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();
});
// Index Route
app.get(('/'),(req,res)=>{
    const add='Welcome!';
    res.render('index',{
        title:add
        });
});
  
// About Route
app.get(('/about'),(req,res)=>{
    res.render('about');
});

// Use routes
app.use('/ideas',ideas);
app.use('/users',users);

// Port number
const port=process.env.PORT||3000;

app.listen(port,()=>{
    console.log(`Server started on port:${port}`);
})