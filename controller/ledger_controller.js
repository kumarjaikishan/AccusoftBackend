const ledmodel = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apierror');

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const addledger = asyncHandler(async (req, res, next) => {
    const { userid, ledger, budget = 0 } = req.body;

    if (!req.userid || !req.body.ledger) {
        throw new ApiError(400, "All Fields are Required");
    }

    const isExists = await ledmodel.findOne({ userid: userid, ledger });
    if (isExists) {
        throw new ApiError(400, `${req.body.ledger} Already Exist`);
    }

    const query = new ledmodel({ userid, ledger, budget });
    const result = await query.save();
    // console.log(result);
    return res.status(200).json({
        message: "Ledger Added "
    })
})

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const updateledger = asyncHandler(async (req, res, next) => {
    const { ledger_id, newledger, newbudget } = req.body;
    // console.log("old id", ledger_id, newbudget);

    if (!ledger_id || !newledger) {
        throw new ApiError(400, "All Fields are Required");
    }

    // Check if another ledger (different _id) already has the same name
    const isExists = await ledmodel.findOne({
        userid: req.userid,
        ledger: newledger,
        _id: { $ne: ledger_id }   // exclude the current ledger
    });

    if (isExists) {
        throw new ApiError(421, `${newledger} Already Exists`);
    }

    const query = await ledmodel.findByIdAndUpdate(
        { _id: ledger_id },
        { ledger: newledger, budget: newbudget },
        { new: true } // return updated doc if needed
    );

    if (!query) {
        throw new ApiError(422, "Ledger Id not Valid");
    }

    return res.status(200).json({
        message: "Ledger Updated"
    });
});


const mergeledger = asyncHandler(async (req, res, next) => {
    const { ledger_id, newledger } = req.body;

    if (!ledger_id || !newledger) {
        throw new ApiError(400, "All Fields are Required");
    }

    const isExists = await ledmodel.findOne({ userid: req.userid, ledger: newledger });

    //If want to merge ledgers
    if (isExists) {
        const query = await expense.updateMany({ ledger: ledger_id }, { ledger: isExists._id });
        const query2 = await ledmodel.deleteOne({ _id: ledger_id });
        return res.status(200).json({
            message: "Ledger Merged"
        })
    }
})


// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const deleteledger = asyncHandler(async (req, res, next) => {
    // console.log(req.body.ledgerid);
    const { ledgerid } = req.body;
    if (!ledgerid) {
        throw new ApiError(400, "Ledger Id Required");
    }
    const result = await ledmodel.findByIdAndDelete({ _id: ledgerid });
    const deleteexp = await expense.deleteMany({ ledger: ledgerid })
    // console.log(result);
    if (!result) {
        throw new ApiError(400, "Id not Valid");
    }
    return res.status(200).json({
        message: "Ledger Deleted"
    })
})




module.exports = { addledger, deleteledger, updateledger, mergeledger };