const office = require('../conn/officeexp')
const model = require('../modals/expschema')
const user = require('../modals/loginschema')


// *--------------------------------------
// * User Registration Logic
// *--------------------------------------
const addexpense = async (req, res) => {
    const { ledger, date, amount, narration } = req.body;
    const userid = req.userid
    // console.log(ledger, date, amount, narration, userid);
    if (!userid || !ledger || !date || !amount || !narration) {
        return res.status(203).json({
            msg: "all fields are required"
        })
    }
    try {
        const query = new model({ userid, ledger, date, amount, narration });
        const result = await query.save();
        if (result) {
            res.status(201).json({
                msg: "data inserted successfully"
            })
        } else {
            res.json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.status(500).json({ msg: "something went wrong in db" })
    }
}



// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const explist = async (req, res) => {
    const userid = req.body.userid;
    try {
        const result = await model.find({ userid }).sort({ date: -1 });
        if (result) {
            res.json({
                msg: "data found",
                data: result
            })
        } else {
            res.json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.json({
            msg: "wrong",
            data: error
        })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const ledger = async (req, res) => {
    const { userid, ledger } = req.body;
    // console.log(userid,ledger)
    const result = await model.find({ userid, ledger });
    // console.log(result)
    if (result) {
        res.json({
            msg: "data found",
            data: result
        })
    } else {
        res.json({
            msg: "something went wrong in db"
        })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const offledger = async (req, res) => {
    try {
        const result = await user.find({ email: "test@gmail.com" });
        if (result) {
            res.json({
                msg: "data found",
                data: result
            })
        } else {
            res.json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.json({
            msg: "wrong",
            data: error
        })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const offexpfetch = async (req, res) => {
    try {
        const result = await office.find();
        if (result) {
            res.json({
                msg: "data found",
                data: result
            })
        } else {
            res.json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.json({
            msg: "wrong",
            data: error
        })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const offexpense = async (req, res) => {
    const { voucher, ledger, date, narration, amount } = req.body;
    try {
        const query = new office({ voucher, ledger, date, narration, amount });
        const result = await query.save();
        if (result) {
            res.json({
                msg: "data inserted successfully"
            })
        } else {
            res.json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.json({
            msg: "wrong",
            data: error
        })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const datafetcheditexp = async (req, res) => {
    const _id = req.body.id;
    // console.log(_id)
    const result = await model.find({ _id });
    if (result) {
        res.json({
            msg: "data found",
            data: result
        })
    } else {
        res.json({
            msg: "something went wrong"
        })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const userledger = async (req, res) => {
    const { userledger } = req.body;
    if (userledger.length < 1) {
        return res.status(401).json({ msg: "ledger can't be empty" })
    }
    try {
        const result = await user.findByIdAndUpdate({ _id: req.userid }, { ledger: userledger });
        if (result) {
            res.json({
                msg: "ledger sync",
                data: result
            })
        }
    } catch (error) {
        res.status(501).json({ msg: error })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const userdata = async (req, res) => {
    // const bearertoken = req.header('Authorization');
    // console.log("from finally",req.user);
    try {
        const explist = await model.find({ userid: req.user._id }).sort({ date: -1 });
        if (explist) {
            res.status(200).json({
                user: req.user,
                explist: explist
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: error
        })
    }
}




module.exports = { userdata, userledger, addexpense, datafetcheditexp, explist, offledger, offexpfetch, offexpense };