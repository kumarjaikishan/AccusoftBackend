const ledmodel = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')
const asyncHandler = require('../utils/asyncHandler')

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const addledger = asyncHandler(async (req, res,next) => {
    if (!req.userid || !req.body.ledger) {
        return next({ status: 400, message: "All Fields are Required" });
    }

    const query = new ledmodel({ userid: req.userid, ledger: req.body.ledger });
    const result = await query.save();
    console.log(result);
    return res.status(200).json({
        msg: "Ledger added Successfully"
    })
})

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const updateledger = asyncHandler(async (req, res,next) => {
    const { ledger_id, newledger } = req.body;

    if (!ledger_id || !newledger) {
        return next({ status: 400, message: "All Fields are Required" });
    }

    const query = await ledmodel.findByIdAndUpdate({ _id: ledger_id }, { ledger: newledger });
    if (!query) {
        return next({ status: 400, message: "Ledger Id not Valid" });
    }
    return res.status(200).json({
        msg: "Ledger Updated Successfully"
    })
})


// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const deleteledger = asyncHandler(async (req, res,next) => {
    // console.log(req.body.ledgerid);
    const { ledgerid } = req.body;
    if (!ledgerid) {
        return next({ status: 400, message: "Ledger Id Required" });
    }
        const result = await ledmodel.findByIdAndDelete({ _id: ledgerid });
        const deleteexp = await expense.deleteMany({ ledger: ledgerid })
        // console.log(result);
        if (!result) {
            return next({ status: 400, message: "Id not Valid" });
        }
        return res.status(200).json({
            msg: "Ledger Deleted Successfully"
        })
  
})




module.exports = { addledger, deleteledger, updateledger };