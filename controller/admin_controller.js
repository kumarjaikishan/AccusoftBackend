// const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')
const expense = require('../modals/exp_schema')
const ledger = require('../modals/ledger_schema')
const asyncHandler = require('../utils/asyncHandler')
const { ApiError } = require('../utils/apierror')


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
    // Get all users (without password)
    const users = await user.find().select({ password: 0 }).sort({ createdAt: -1 });

    // Aggregate expenses count per user
    const expenseCounts = await expense.aggregate([
        {
            $group: {
                _id: "$userid",      // group by user ID
                totalExpenses: { $sum: 1 } // count expenses
            }
        }
    ]);

    // Map counts to users
    const usersWithExpenseCount = users.map(u => {
        const found = expenseCounts.find(e => e._id.toString() === u._id.toString());
        return {
            ...u._doc,
            totalExpenses: found ? found.totalExpenses : 0
        };
    });

    return res.status(200).json({
        users: usersWithExpenseCount
    });
});


// *--------------------------------------
// * Admin user data update Logic
// *--------------------------------------
const userupdate = asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    const { id, name, phone, email, admin, verified } = req.body;
    if (id == null || name == null || phone == null || email == null || admin == null || verified == null) {
      throw new ApiError(422, "All Fields are Required");
    }

    const query = await user.findByIdAndUpdate({ _id: id }, { name, phone, email, isadmin: admin, isverified: verified });
    if (!query) {
        throw new ApiError(422, "Id Incorrect");
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
        throw new ApiError(422, "Id is Required");
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

