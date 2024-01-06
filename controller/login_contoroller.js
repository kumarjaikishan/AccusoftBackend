const user = require('../modals/login_schema')
const ledmodel = require('../modals/ledger_schema')
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const jwt = require('jsonwebtoken');

cloudinary.config({
    cloud_name: 'dusxlxlvm',
    api_key: '214119961949842',
    api_secret: "kAFLEVAA5twalyNYte001m_zFno"
});


// photo 2nd method
const photo2 = async (req, res) => {
    console.log(req.body);
    const old = req.body.oldimage
    const newly = req.body.newimage
    const userid = req.body.userid
    try {
        const result = await user.findByIdAndUpdate({ _id: userid }, { imgsrc: newly });
        if (result) {
            if (old === "https://res.cloudinary.com/dusxlxlvm/image/upload/v1699090690/just_yoljye.png") {
                // console.log("pehle se hi");
                res.status(201).json({
                    msg: "photo updated"
                })
            } else {
                const hu = old.split('/');
                const lastwala = hu[hu.length - 1].split('.')[0];
                await cloudinary.uploader.destroy(lastwala, (error, result) => {
                    // console.log(error,result);
                    res.status(201).json({
                        msg: "photo updated"
                    })
                })

            }
        }

    } catch (error) {
        res.status(501).json({
            msg: error
        })
    }
}

// *--------------------------------------
// * User Profile pic Upload Logic
// *--------------------------------------

const photo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            msg: 'No file uploaded.'
        });
    }
    // console.log("from final",req.body);
    const oldurl = req.body.oldimage;
    const userid = req.userid;
    try {
        await cloudinary.uploader.upload(req.file.path, async (error, result) => {
            // console.log(error, result);
            if (error) {
                return res.status(500).json({
                    msg: error
                });
            }

            const imageurl = result.secure_url;
            // console.log("photo upload ho gaya", imageurl);

            fs.unlink(req.file.path, (err => {
                if (err) {
                    console.log(err);
                    return res.status(500).json("error occured while deleting file");
                }
                //   getFilesInDirectory(); 
                // }
            }));

            const query = await user.findByIdAndUpdate({ _id: userid }, { imgsrc: imageurl });
            // console.log("url updateing", query);
            if (oldurl != "") {
                const hu = oldurl.split('/');
                const lastwala = hu[hu.length - 1].split('.')[0];
                await cloudinary.uploader.destroy(lastwala, (error, result) => {
                    // console.log(error, result);
                    if (result) {
                        res.status(201).json({
                            msg: "photo updated",
                            url: imageurl
                        })
                    } else {
                        res.status(500).json({
                            msg: "something went wrong during previous image delete"
                        })
                    }

                })
            } else {
                res.status(201).json({
                    msg: "photo updated",
                    url: imageurl
                })
            }

        })
    } catch (error) {
        res.status(501).json({
            msg: error
        })
    }

}


// *--------------------------------------
// * User Login 1st method with nodecache Logic
// *--------------------------------------
const login = async (req, res) => {
    let usersdata;
    if (myCache.has("allusers")) {
        usersdata = JSON.parse(myCache.get("allusers"));
    } else {
        usersdata = await user.find({});
        myCache.set("allusers", JSON.stringify(usersdata));
    }
    const { email, password } = req.body;

    const result = await usersdata.find((hel) => {
        return hel.email == req.body.email
    });

    if (!result) {
        return res.status(400).json({ msg: "Invalid Credientials" });
    }
    // console.log("password match: ", await bcrypt.compare(password, result.password));
    const generateToken = async (result) => {
        try {
            return jwt.sign({
                userId: result._id.toString(),
                email: result.email,
                isAdmin: result.isadmin
            },
                process.env.jwt_token,
                {
                    expiresIn: "30d",
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    if (await bcrypt.compare(password, result.password)) {
        const dfg = await generateToken(result);
        const fbf = result._id.toString();
        result.password = undefined;
        result.createdAt = undefined;
        result._id = undefined;
        result.phone = undefined;
        res.status(200).json({
            msg: "Login Successful",
            token: dfg,
            userId: fbf
        });
    } else {
        res.status(400).json({ msg: "Invalid Email or Passowrd" });
    }
}


// *--------------------------------------
// * User Login 2nd method without nodecache Logic
// *--------------------------------------
// const login = async (req, res) => {
//      const { email, password } = req.body;
//      console.log(email, password);
//     try {
//         const result = await user.findOne({ email });
//         const result1 = await user.find();
//         console.log(result1);
//         if (!result) {
//             return res.status(400).json({ msg: "Email not found" });
//         }
//         if (await result.checkpassword(password)) {
//             result.password = undefined;
//             result.date = undefined;
//             result._id = undefined;
//             result.phone = undefined;
//             res.status(200).json({
//                 msg: "Login Successful",
//                 token: await result.generateToken(),
//                 userId: result._id.toString()
//             });
//         } else {
//             res.status(400).json({ msg: "Invalid Email or Passowrd" });
//         }
//     } catch (error) {
//         res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
//     }
// }


// *--------------------------------------
// * User SignUp Logic
// *--------------------------------------
const signup = async (req, res, next) => {
    // console.log(req.body);
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password || !date) {
        console.log("all fieldse are req");
        res.json({
            msg: "all fields are required"
        })
    }
    try {
        // console.log(fgrd,dsd);
        const query = new user({ name, email, phone, password });
        const result = await query.save();
        // console.log(result);
        if (result) {
            // console.log(result);
            myCache.del("allusers");
            const ledger1 = new ledmodel({ userid: result._id.toString(), ledger: "general" });
            const ledger2 = new ledmodel({ userid: result._id.toString(), ledger: "other" });
            const save1 = await ledger1.save();
            const save2 = await ledger2.save();
            // console.log(result._id.toString());
            next();
            // res.status(201).json({
            //     msg: "SignUp successfully",
            //     data: result
            // })
        } else {
            res.status(500).json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        })
    }

}



const updateuserdetail = async (req, res) => {
    // console.log(req.user);
    const { name, phone } = req.body;
    try {
        const query = await user.findByIdAndUpdate({ _id: req.userid }, { name, phone })
        if (query) {
            // console.log(query);
            return res.status(200).json({
                msg: "Profile Detail Updated Successfully"
            })
        } else {
            res.status(500).json({
                msg: "something went wrong"
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }
}

const verify = async (req, res) => {
    try {
        const query = await user.findByIdAndUpdate({ _id: req.query.id }, { isverified: true });
       
        if(query){
            // res.status(201).json({
            //     msg:`Hi ${query.name},Email verified Successfully,Now You can Proceed to Login`
            // })
            res.status(201).send(`<html><h2> Hi ${query.name} , Email Verified Successfully, <button onclick="location.href = 'https://frontend-exp-man.vercel.app';">Login Now</button> </h2></html>`)
        }
    } catch (error) {
        res.status(500).json({
            msg:"User Email not  verified",
            error:error
        })
    }
}

module.exports = { signup, photo, login, updateuserdetail, verify };