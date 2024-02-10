const ledger = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')
const asyncHandler = require('../utils/asyncHandler')

// *--------------------------------------
// * User Registration Logic
// *--------------------------------------
const addexpense = asyncHandler(async (req, res,next) => {
    const { ledger, date, amount, narration } = req.body;
    if (!ledger || !date || !amount || !narration) {
        return next({ status: 400, message: "All Fields are Required" });
    }
    const query = new expense({ userid: req.userid, ledger, date, amount, narration });
    const result = await query.save();
    if (result) {
        return res.status(201).json({
            msg: "Expense Added"
        })
    }
})


// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const userledger = asyncHandler(async (req, res,next) => {
    const { userledger } = req.body;
    if (userledger.length < 1) {
        return next({ status: 422, message: "Ledger Can't be Blank" });
    }

    const result = await user.findByIdAndUpdate({ _id: req.userid }, { ledger: userledger });
    if (result) {
        return res.json({
            msg: "ledger sync",
            data: result
        })
    }
})


// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const userdata = asyncHandler(async (req, res,next) => {
    if (!req.user._id) {
        return next({ status: 422, message: "UserId is Required" });
    }
    // console.time("time taken by userdata");
    const explist = await expense.find({ userid: req.user._id }).populate({ path: 'ledger', select: 'ledger' }).sort({ date: -1 });
    const ledgere = await ledger.find({ userid: req.user._id }).select({ ledger: 1 });
    // console.timeEnd("time taken by userdata");
    if (explist) {
        return res.status(200).json({
            user: req.user,
            explist: explist,
            ledger: ledgere
        })
    }
})




module.exports = { userdata, userledger, addexpense };