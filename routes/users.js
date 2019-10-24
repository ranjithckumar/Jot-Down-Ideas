const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();

// User login route
router.get('/login',(req,res)=>{
    res.render('users/login');
});
// User register route
router.get('/register',(req,res)=>{
    res.render('users/register');
});

// Register form post
router.post('/register',(req,res)=>{
    let errors=[];
    if(req.body.password !=req.body.password2){
        errors.push({text:'Password do not match'})
    }
    if(req.body.password.length < 6){
        errors.push({text:'Password must be at least 6 charcters'});
    }
    if(errors.length>0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
            
        });
    }
    else{
        res.send('passed');
    }
});

module.exports=router; 