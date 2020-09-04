const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registrationValidation,loginValidation} = require('../validation')

router.post('/register',async (req,res) =>{
    
    // Validate User
    try{
        const {error} = registrationValidation(req.body);
        if(error) {
            res.status(403);
            res.send(error.details[0].message); 
        }
        try {
            
            const emailExist = await User.findOne({email: req.body.email});
            if(emailExist) return res.status(403).send('Email Already Exist');
            
            // Hash Password 
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password,salt);

            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                password:hashPassword
            });
            console.log('before save');
            let saveUser = await newUser.save(); //when fail its goes to catch
            console.log(saveUser); //when success it print.
            console.log('after save');
            res.send({
                user:newUser._id
            });
          } catch (err) {
            console.log('err' + err);
            res.status(500).send(err);
          }
    } catch(err) {
        console.log(err);
        
    }
});

//LOGIN

router.post('/login', async (req,res,err) => {
    // Validate User
    try{
        const {error} = loginValidation(req.body);
        if(error) {
            res.status(403);
            res.send(error.details[0].message); 
        }
    } catch (er) {
        console.error(er);
        
    }

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(403).send('Email Doesn\'t Exist');
       
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(403).send('Incorrect Password');

    //Create assign a token 

    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token);

    res.status(200).json({
        user
    })
});

module.exports = router;