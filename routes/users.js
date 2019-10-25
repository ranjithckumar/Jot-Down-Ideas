const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const router=express.Router();

// Load user models
require('../models/User');
const User=mongoose.model('users');

// User login route
router.get('/login',(req,res)=>{
    res.render('users/login');
});
// User register route
router.get('/register',(req,res)=>{
    res.render('users/register');
});
// Login form Post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
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
        User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                req.flash('error_msg','Email already registered');
                res.redirect('/users/register');
            }
            else{
                const newUser=new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                });
                bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password=hash;
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg','You are registered and can login');
                        res.redirect('/users/login');
                    })
                    .catch(err=>{
                      Console.log(err);
                      return;
                    });
                });
                });
         
            }
        })
    }
});
// Logout user
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Your are logged out');
    res.redirect('/users/login');
});
module.exports=router; 