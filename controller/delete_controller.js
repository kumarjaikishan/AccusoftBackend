const Expense = require('../modals/exp_schema')
const asyncHandler = require('../utils/asyncHandler')


// *--------------------------------------
// * Multiple expense single data delete logic
// *--------------------------------------
const delmany = asyncHandler(async (req, res,next) => {
    const id = req.body.id;
    // console.log(id);
    if (!id) {
        return next({ status: 422, message: "ID Required" });
    }

    const result = await Expense.deleteMany({
        _id: { $in: id }
    });
    if (!result) {
        return next({ status: 422, message: "Deletion failed" });
    }
    return res.status(200).json({
        msg: "Deleted Successfully",
        data: result
    })
})

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const updateexp = asyncHandler(async (req, res,next) => {
    const { _id, ledger, date, amount, narration } = req.body;

    const result = await Expense.findByIdAndUpdate({ _id }, { ledger, date, amount, narration });
    if (!result) {
        return next({ status: 422, message: "Expense not Updated"});
    }

    return res.status(200).json({
        msg: "Updated Successfully"
    });
})



module.exports = { delmany, updateexp };