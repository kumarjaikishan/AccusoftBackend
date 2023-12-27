const jwt = require('jsonwebtoken');
const User = require('../modals/loginschema');

const authmiddlewre = async (req, res, next) => {
    const bearertoken = req.header('Authorization');
    // console.log(bearertoken);
    if(!bearertoken){
        return res.status(401).json({msg:"Unauthorizes HTTP, token not provided"})
    }

    try {
        const token = bearertoken.replace("Bearer", "").trim();
        const verified = jwt.verify(token, process.env.jwt_token);

        const userdata = await User.findOne({email:verified.email}).select({password:0});
        userdata.date=undefined;
        // console.log(userdata);
        req.user=userdata;
        req.userid=userdata._id.toString();
        req.token=token;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error })
    }
}
module.exports = authmiddlewre;