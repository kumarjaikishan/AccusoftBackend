const ledmodel = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const addledger = async (req, res) => {
    if (!req.userid || !req.body.ledger) {
        return res.status(422).json({
            msg: "All fields are required"
        })
    }
    try {
        const query = new ledmodel({ userid: req.userid, ledger: req.body.ledger });
        const result = await query.save();
        console.log(result);
        if (result) {
            res.status(200).json({
                msg: "Ledger added Successfully"
            })
        }
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

// *--------------------------------------
// * expense single data delete logic
// *--------------------------------------
const updateledger = async (req, res) => {
    const { ledger_id, newledger } = req.body;
    if (!ledger_id || !newledger) {
        return res.status(422).json({
            msg: "All fields are required"
        })
    }
    try {
        const query = await ledmodel.findByIdAndUpdate({ _id: ledger_id }, { ledger: newledger });
        // console.log(query);
        if (query) {
            res.status(200).json({
                msg: "Ledger Updated Successfully"
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
    const { ledgerid } = req.body;
    if(!ledgerid){
        return res.status(422).json({
            msg: "Ledger Id Required"
        })
    }
    try {
        const result = await ledmodel.findByIdAndDelete({ _id: ledgerid });
        const deleteexp = await expense.deleteMany({ ledger:ledgerid })
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




module.exports = { addledger, deleteledger, updateledger };