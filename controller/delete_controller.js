const Expense = require('../modals/exp_schema')



// *--------------------------------------
// * Multiple expense single data delete logic
// *--------------------------------------
const delmany = async (req, res) => {
    const id = req.body.id;
    console.log(id);
    if (!id) {
        res.json({
            msg: "Send some id",
        })
    }

    try {
        const result = await Expense.deleteMany({
            _id: { $in: id }
        });
        // console.log("from delete many",result);
        if (result) {
            res.status(201).json({
                msg: "data deleted",
                data: result
            })
        } else {
            res.status(401).json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        res.status(501).json({ msg: error })
    }
}

// *--------------------------------------
// * User Login Logic
// *--------------------------------------
const updateexp = async (req, res) => {
    const { _id, ledger, date, amount, narration } = req.body;
    // console.log(req.body);
    try {
        const result = await Expense.findByIdAndUpdate({ _id }, { ledger, date, amount, narration });
        if (result) {
            res.status(201).json({
                msg: "data Updated Successfully"
            })
        } else {
            res.status(402).json({
                msg: "something went wrong in db"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(502).json({
            msg: error
        })
    }
}



module.exports = {delmany, updateexp };