const express=require('express');
const exphbs=require('express-handlebars');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');


const app=express();
// Map global promises -get rid of  warning
mongoose.Promise=global.Promise;
// Connect to mongoDb
mongoose.connect('mongodb://localhost/vidjot',{
    useMongoClient:true
})
.then(()=>console.log('MongoDb connected'))
.catch(err=>console.log('Error '));

// Load Idea Model

require('./models/Idea');
const Idea=mongoose.model('Ideas');
//  Handle-bars middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
// Body parser middleware
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.set('view engine','handlebars');
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

// Add ideas
app.get(('/ideas/add'),(req,res)=>{
    res.render('ideas/add');
});

// Process form
app.post('/ideas',(req,res)=>{
  let errors=[];
  if(!req.body.title){
      errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }
  if(errors.length>0){
      res.render('ideas/add',{
          errors:errors,
          title:req.body.title,
          details:req.body.title
      });
  }else{
      res.send('ok');
  }

});
const port=7000;

app.listen(port,()=>{
    console.log(`Server started on port:${port}`);
})