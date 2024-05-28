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

    const isExists = await ledmodel.findOne({userid:req.userid, ledger:req.body.ledger});
    if(isExists){
        return next({ status: 400, message: `${req.body.ledger} Already Exist` });
    }

    const query = new ledmodel({ userid: req.userid, ledger: req.body.ledger });
    const result = await query.save();
    // console.log(result);
    return res.status(200).json({
        message: "Ledger Added "
    })
})

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const updateledger = asyncHandler(async (req, res,next) => {
    const { ledger_id, newledger } = req.body;
    console.log("old id",ledger_id);

    if (!ledger_id || !newledger) {
        return next({ status: 400, message: "All Fields are Required" });
    }

    const isExists = await ledmodel.findOne({userid:req.userid, ledger:newledger});
    if(isExists){
        return next({ status: 400, message: `${newledger} Already Exist` });
    }

    //If want to merge ledgers
    // if(isExists){
    //     const query = await expense.updateMany({ ledger: ledger_id }, { ledger: isExists._id });
    //     const query2 = await ledmodel.deleteOne({ _id: ledger_id });

    //     return res.status(200).json({
    //         message: "Ledger Updated"
    //     })
    // }

    const query = await ledmodel.findByIdAndUpdate({ _id: ledger_id }, { ledger: newledger });
    if (!query) {
        return next({ status: 400, message: "Ledger Id not Valid" });
    }
    return res.status(200).json({
        message: "Ledger Updated"
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
            message: "Ledger Deleted"
        })
})




module.exports = { addledger, deleteledger, updateledger };