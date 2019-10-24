const express=require('express');
const exphbs=require('express-handlebars');
const methodOverride = require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();

// Load routes
const ideas=require('./routes/ideas');
// Load routes
const users=require('./routes/users');

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
// Body parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.set('view engine','handlebars');

// Method override middleware
app.use(methodOverride('_method'));

// Express session  middleware
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized: true
  }));

  app.use(flash());
//   Global variables
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
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
const port=3000;

app.listen(port,()=>{
    console.log(`Server started on port:${port}`);
})