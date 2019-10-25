module.exports={
    ensureAuthenticated:function(req,res,next){
       if(req.isAuthenticated()){
           return next();
       }
       req.flash('err_msg','Not Authorised');
       res.redirect('/users/login');
    }
}