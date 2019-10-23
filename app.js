const express=require('express');
const exphbs=require('express-handlebars');

const app=express();
//  Handle-bars middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));
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
    res.send('About page');
});

const port=7000;

app.listen(port,()=>{
    console.log(`Server started on port:${port}`);
})