const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

// Load user model

const User=mongoose.model('users');
module.exports=function(passport){
   passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
       User.findOne({
           email:email
       }).then(user=>{
        //    Check for user 
           if(!user){
              return done(null,false,{message:'No user found'});
           }
        //    Check for password matching
        bcrypt.compare(password,user.paasword,(err,isMatch)=>{
             if(err) throw err;
             if(isMatch){
               return done(null,user);
             }
             else{
                return done(null,false,{message:'Password Incorrect'});
             }
        })
       })
   }));

   passport.serializeUser(function(user,done){
       done(user,user.id);
   });
   passport.deserializeUser(function(id,done){
       User.findById(id,function(user,error){
           done(err,user);
       });
   });
}