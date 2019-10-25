if(process.env.NODE_ENV==='production'){
    module.exports={mongoURI:
    'mongodb+srv://m001-student:m001-mongodb-basics@cluster0-w5qso.mongodb.net/vidjot-prod'}
}
else{
    module.exports={mongoURI:'mongodb://localhost/vidjot'}
}