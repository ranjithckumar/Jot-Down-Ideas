const express=require('express');
const exphbs=require('express-handlebars');
const methodOverride = require('method-override');
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

// Method override middleware
app.use(methodOverride('_method'));
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
// Idea index page
app.get(('/ideas'),(req,res)=>{
    res.render('ideas/index');
})

// Add ideas
app.get(('/ideas/add'),(req,res)=>{
    Idea.find({})
    .sort({dare:'desc'})
    .then(ideas=>{
        res.render('ideas/add',{
            ideas:ideas
        });
    })
  
});
// Edit idea form
app.get('/ideas/edit/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        res.render('ideas/edit',{
            idea:idea
        });
    });    
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
      const newUser={
          title:req.body.title,
          details:req.body.details
      }
      new Idea(newUser)
      .save()
      .then(idea=>{
          res.redirect('/ideas');
      })
  }

});

// Edit form process
app.put('/ideas/:id',(req,res)=>{
  Idea.findOne({
      _id:req.params.id
  })
  .then(idea=>{
    //   new values
       idea.title=req.body.title; 
       idea.details=req.body.details;
       
       idea.save()
       .then(idea=>{
           res.redirect('/ideas');
       })
  });
});
const port=3000;

app.listen(port,()=>{
    console.log(`Server started on port:${port}`);
})