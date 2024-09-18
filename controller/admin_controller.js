// const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')
const expense = require('../modals/exp_schema')
const ledger = require('../modals/ledger_schema')
const asyncHandler = require('../utils/asyncHandler')


// *--------------------------------------
// * Admin get all user expense data Logic
// *--------------------------------------
const allexpense = asyncHandler(async (req, res, next) => {
    // console.log(req.user);
    const query = await expense.find().populate([{ path: 'userid', select: "name" }, { path: 'ledger', select: 'ledger' }]).sort({ date: -1 });
    return res.status(200).json({
        explist: query
    })
})

// *--------------------------------------
// * Admin get all user Logic
// *--------------------------------------
const alluser = asyncHandler(async (req, res, next) => {
    // console.log(req.user);
    const query = await user.find().select({ password: 0 }).sort({ createdAt: -1 });

    return res.status(200).json({
        users: query
    })

})

// *--------------------------------------
// * Admin user data update Logic
// *--------------------------------------
const userupdate = asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    const { id, name, phone, email, admin, verified } = req.body;
    if (id == null || name == null || phone == null || email == null || admin == null || verified == null) {
        return next({ status: 422, message: "All Fields are Required" });
    }

    const query = await user.findByIdAndUpdate({ _id: id }, { name, phone, email, isadmin: admin, isverified: verified });
    if (!query) {
        return next({ status: 422, message: "Id Incorrect" });
    }
    return res.status(200).json({
        message: "User Updated"
    })
})

// *--------------------------------------
// * Admin user delete & user Expense Delete Logic
// *--------------------------------------
const removeuser = asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    const { id } = req.body
    if (!id) {
        return next({ status: 422, message: "Id is Required" });
    }

    const query = await user.findByIdAndDelete({ _id: id });
    const exp = await expense.deleteOne({ userid: id });
    const ledg = await ledger.deleteOne({ userid: id });
    if (query) {
      return res.status(200).json({
            message: "User Removed"
        })
    }
})

// *--------------------------------------
// * Admin user delete & user Expense Delete Logic
// *--------------------------------------
const admindash = asyncHandler(async (req, res, next) => {
    const usersCount = await user.countDocuments();
    const expensesCount = await expense.countDocuments();
    return res.status(200).json({
        userlen: usersCount,
        explen: expensesCount
    });
})



module.exports = { admindash, allexpense, alluser, userupdate, removeuser };

