const ledmodel = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const addledger = async (req, res) => {
    try {
        const query = new ledmodel({ userid:req.userid, ledger: req.body.ledger });
        const result = await query.save();
        console.log(result);
        if (result) {
            res.status(200).json({
                msg: "Ledger added Successfully"
            })
        } else {
            res.status(400).json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.status(501).json({ msg: error })
    }
}

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const updateledger = async (req, res) => {
    console.log(req.body.ledger_id);
    console.log(req.body.newledger);
    try {
        const query = await ledmodel.findByIdAndUpdate({_id:req.body.ledger_id},{ledger:req.body.newledger});
        // console.log(query);
        if (query) {
            res.status(200).json({
                msg: "Ledger Updated Successfully"
            })
        } else {
            res.status(400).json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({ msg: error })
    }
}


// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const deleteledger = async (req, res) => {
    // console.log(req.body.ledgerid);
    try {
        const result = await ledmodel.findByIdAndDelete({ _id:req.body.ledgerid});
        const deleteexp = await expense.deleteMany({ledger:req.body.ledgerid})
        // console.log(result);
        if (result) {
            res.status(200).json({
                msg: "Ledger Deleted Successfully"
            })
        } else {
            res.status(400).json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.status(501).json({ msg: error })
    }
}




module.exports = { addledger,deleteledger,updateledger};