const Expense = require('../modals/exp_schema')



// *--------------------------------------
// * Multiple expense single data delete logic
// *--------------------------------------
const delmany = async (req, res) => {
    const id = req.body.id;
    // console.log(id);
    if (!id) {
        return res.status(400).json({
            msg: "Send some valid ids",
        });
    }

    try {
        const result = await Expense.deleteMany({
            _id: { $in: id }
        });
        if (!result) {
            throw new Error("Deletion failed");
        }
       return res.status(200).json({
            msg: "Deleted Successfully",
            data: result
        })

    } catch (error) {
       return res.status(500).json({ msg: error.message })
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

       return res.status(200).json({
            msg: "Updated Successfully"
        });
    } catch (error) {
        return  res.status(500).json({
            msg: error.message
        })
    }
}



module.exports = { delmany, updateexp };