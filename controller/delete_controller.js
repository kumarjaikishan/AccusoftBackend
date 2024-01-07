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
        if (!result) {
            throw new Error("Something went Wrong");
        }
        res.status(201).json({
            msg: "Deleted Successfully",
            data: result
        })

    } catch (error) {
        res.status(501).json({ msg: error.message })
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
        if (!result) {
            throw new Error("Expense Not Updated");
        }

        res.status(201).json({
            msg: "Updated Successfully"
        })

    } catch (error) {
        res.status(502).json({
            msg: error.message
        })
    }
}



module.exports = { delmany, updateexp };