const Expense = require('../modals/exp_schema');
const { ApiError } = require('../utils/apierror');
const asyncHandler = require('../utils/asyncHandler')

// *--------------------------------------
// * Multiple expense single data delete logic
// *--------------------------------------
const delmany = asyncHandler(async (req, res, next) => {
    const id = req.body.id;
    // console.log(id);
    if (!id) {
        throw new ApiError(422, "ID Required");
    }

    const result = await Expense.deleteMany({
        _id: { $in: id }
    });
    if (!result) {
        throw new ApiError(422, "Deletion failed");
    }
    return res.status(200).json({
        message: "Deleted Successfully",
        data: result
    })
})

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const updateexp = asyncHandler(async (req, res, next) => {
    const { _id, ledger, date, amount, narration } = req.body;

    const result = await Expense.findByIdAndUpdate({ _id }, {
        ledger,
         date,
        // date: dayjs(date).utc().startOf('day').toDate(),
        amount, narration
    });
    if (!result) {
        throw new ApiError(422, "Incorrect Expense Id");
    }

    return res.status(200).json({
        message: "Updated Successfully"
    });
})



module.exports = { delmany, updateexp };