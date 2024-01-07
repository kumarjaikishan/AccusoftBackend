// const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')
const expense = require('../modals/exp_schema')

// *--------------------------------------
// * Admin get all user expense data Logic
// *--------------------------------------
const allexpense = async (req, res) => {
    // console.log(req.user);
    try {
        const query = await expense.find().populate([{ path: 'userid', select: "name" }, { path: 'ledger', select: 'ledger' }]).sort({ date: -1 });
        res.status(200).json({
            explist: query
        })

    } catch (error) {
        res.status(501).json({ msg:  error.message })
    }
}

// *--------------------------------------
// * Admin get all user Logic
// *--------------------------------------
const alluser = async (req, res) => {
    // console.log(req.user);
    try {
        const query = await user.find().select({ password: 0 }).sort({ date: -1 });
        if (query) {
            res.status(200).json({
                users: query
            })
        }
    } catch (error) {
        res.status(501).json({ msg:  error.message })
    }
}

// *--------------------------------------
// * Admin user data update Logic
// *--------------------------------------
const userupdate = async (req, res) => {
    // console.log(req.body);
    const { id, name, phone, email, admin, verified } = req.body;
    if (!(id, name, phone, email, admin, verified)) {
        return res.status(422).json({
            msg: "All fields are required"
        })
    }
    try {
        const query = await user.findByIdAndUpdate({ _id: id }, { name, phone, email, isadmin: admin, isverified: verified });
        if (!query) {
            throw new Error("something went wrong");
        }
            res.status(200).json({
                msg: "user updated successfully"
            })
       
    } catch (error) {
        res.status(501).json({ msg: error.message })
    }
}

// *--------------------------------------
// * Admin user delete & user Expense Delete Logic
// *--------------------------------------
const removeuser = async (req, res) => {
    // console.log(req.body);
    const { id } = req.body
    if (!id) {
        return res.status(422).json({
            msg: "ID is required"
        })
    }
    try {
        const query = await user.findByIdAndDelete({ _id: id });
        const exp = await expense.remove({ userid: id });
        if (query) {
            res.status(200).json({
                msg: "user updated successfully"
            })
        }
    } catch (error) {
        res.status(501).json({ msg:  error.message })
    }
}



module.exports = { allexpense, alluser, userupdate, removeuser };