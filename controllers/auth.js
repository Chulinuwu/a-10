const User = require('../models/User');

//@desc register user
//@route POST /api/v1/auth/register
//@access Public

//get token from model, create cookie and send response
const sendTokenResponse = (user,statusCode,res)=>{
    //create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true
    };
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    })
};


exports.register = async (req,res,next)=> {
    
    try{
        const {name , email , password ,role} = req.body;
        //create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        //create token
        // const token = user.getSignedJwtToken();

        // res.status(200).json({success:true,token});
        sendTokenResponse(user,200,res);
    }catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
};

exports.login = async (req, res, next)=> {
    try{
    const {email, password} = req.body;
    //validate email and password if null will send status 400
    if(!email || !password){
        return res.status(400).json({success:false, msg:'Please provide email and password'});
    }
    //check for user
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({success:false, msg:'Invalid credentials'});
    }
    //check if password matches
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return res.status(401).json({success:false, msg:'Invalid credentials'});
    }
    //create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    sendTokenResponse(user,200,res);
}
catch(err){
    res.status(401).json({success:false, msg:'Invalid credentials'});
    console.log(err.stack);

}
};

exports.getMe = async(req,res,next) =>{
    const user = await User.findById(req.user.id);
    res.status(200).json({success:true,data:user});
};

exports.logout = async(req,res,next) =>
{
    res.cookie('token','none',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly:true
    });
    res.status(200).json({success:true,data:{}});
}