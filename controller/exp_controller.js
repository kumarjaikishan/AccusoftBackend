const ledger = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')


// *--------------------------------------
// * User Registration Logic
// *--------------------------------------
const addexpense = async (req, res) => {
    const {ledger, date, amount, narration } = req.body;
    // const userid = req.userid
    // console.log(ledger, date, amount, narration, userid);
    if (!ledger || !date || !amount || !narration) {
        return res.status(203).json({
            msg: "all fields are required"
        })
    }
    try {
        const query = new expense({ userid:req.userid, ledger, date, amount, narration });
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
    console.time("time taken by userdata");
    try {
        const explist = await expense.find({ userid: req.user._id }).populate({path:'ledger',select:'ledger'}).sort({date:-1});
        const ledgere = await ledger.find({ userid: req.user._id }).select({ledger:1});
        console.timeEnd("time taken by userdata");
        if (explist) {
            res.status(200).json({
                user: req.user,
                explist: explist,
                ledger:ledgere
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error
        })
    }
}




module.exports = { userdata, userledger, addexpense};