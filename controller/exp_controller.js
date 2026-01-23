const ledger = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')
const user = require('../modals/login_schema')
const asyncHandler = require('../utils/asyncHandler')
const { ApiError } = require('../utils/apierror')
const dayjs = require('dayjs')


// *--------------------------------------
// * User Registration Logic
// *--------------------------------------
// const allexpe = asyncHandler(async (req, res, next) => {
//   const query = await expense.find()
//   for (const doc of query) {
//     doc.date = dayjs(doc.date).toDate();
//     await doc.save();
//   }

//   return res.status(200).json({message:'updated'}); 
// });

// const allexpe = asyncHandler(async (req, res, next) => {
//   await expense.updateMany(
//     { date: { $type: "string" } }, // only update if date is stored as string
//     [
//       {
//         $set: {
//           date: {
//             $dateFromString: { dateString: "$date" }
//           }
//         }
//       }
//     ]
//   );

//   res.status(200).json({ message: 'All string dates converted to Date objects' });
// });

const allexpe = asyncHandler(async (req, res, next) => {
    await expense.updateMany(
        { date: { $type: "string" } }, // only if date is stored as string
        [
            {
                $set: {
                    date: {
                        $dateFromString: {
                            dateString: "$date",
                            timezone: "UTC" // ensures ISO normalization
                        }
                    }
                }
            }
        ]
    );

    res.status(200).json({ message: 'All string dates converted to Date objects in UTC' });
});

const addexpense = asyncHandler(async (req, res, next) => {
    //  throw new ApiError(400, "All Fields are Required");
    const { ledger, date, amount, narration } = req.body;

    if (!ledger || !date || !amount || !narration) {
        throw new ApiError(400, "All Fields are Required");
    }

    await expense.create({
        userid: req.userid,
        ledger,
        date,
        amount,
        narration
    });

    // smart denormalized update
    await user.updateOne(
        { _id: req.userid },
        { $max: { lastActivity: new Date() } }
    );

    return res.status(201).json({
        message: "Expense Added"
    })
})

const delmany = asyncHandler(async (req, res, next) => {
    const id = req.body.id;
    const userId = req.userid;
    // console.log(id);
    if (!Array.isArray(id) || id.length === 0) {
        throw new ApiError(422, "Valid ID array required");
    }

    const result = await expense.deleteMany({
        _id: { $in: id },
        userid: userId
    });

    if (result.deletedCount === 0) {
        throw new ApiError(403, "No expenses deleted or unauthorized access");
    }

    return res.status(200).json({
        message: "Deleted Successfully",
        data: result
    })
})

const Admindelmany = asyncHandler(async (req, res, next) => {
    const id = req.body.id;
    // console.log(id);
    if (!Array.isArray(id) || id.length === 0) {
        throw new ApiError(422, "Valid ID array required");
    }

    const result = await expense.deleteMany({
        _id: { $in: id },
    });

    if (result.deletedCount === 0) {
        throw new ApiError(403, "No expenses deleted or unauthorized access");
    }

    return res.status(200).json({
        message: "Deleted Successfully",
        data: result
    })
})

const updateexp = asyncHandler(async (req, res, next) => {
    const { _id, ledger, date, amount, narration } = req.body;
    const userId = req.userid;

    const result = await expense.findByIdAndUpdate({ _id, userid: userId }, {
        ledger,
        date,
        amount, narration
    });

    if (!result) {
        throw new ApiError(
            403,
            "You are not allowed to update this expense"
        );
    }

    return res.status(200).json({
        message: "Updated Successfully"
    });
})

const Asminupdateexp = asyncHandler(async (req, res, next) => {
    const { _id, ledger, date, amount, narration } = req.body;

    const result = await expense.findByIdAndUpdate({ _id }, {
        ledger,
        date,
        amount, narration
    });

    if (!result) {
        throw new ApiError(
            403,
            "You are not allowed to update this expense"
        );
    }

    return res.status(200).json({
        message: "Updated Successfully"
    });
})

const explist = asyncHandler(async (req, res, next) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const start = (page - 1) * limit;
    const end = page * limit;

    const items = await expense.find({ userid: req.userid }).populate({ path: 'ledger', select: 'ledger' }).sort({ date: -1, _id: -1 });
    // console.log(result)

    res.json({
        message: 'ok',
        total: items.length,
        items: items.slice(start, end),
    });
})

const expdetail = asyncHandler(async (req, res, next) => {
    const { expId } = req.body;
    if (!expId) {
        throw new ApiError(400, "Expense Id is Required");
    }

    const result = await expense.findOne({ _id: expId }).populate({ path: 'ledger', select: 'ledger' });
    // console.log(result)
    if (result) {
        return res.json({
            data: result
        })
    }
})

const userledger = asyncHandler(async (req, res, next) => {
    const { userledger } = req.body;
    if (userledger.length < 1) {
        throw new ApiError(422, "Ledger Can't be Blank");
    }

    const result = await user.findByIdAndUpdate({ _id: req.userid }, { ledger: userledger });
    if (result) {
        return res.json({
            message: "ledger sync",
            data: result
        })
    }
})

const userdata = asyncHandler(async (req, res, next) => {
    // console.time("time taken by userdata");
    const profile = await user.findOne({ _id: req.user._id });
    const explist = await expense.find({ userid: req.user._id }).populate({ path: 'ledger', select: 'ledger' }).sort({ date: -1, _id: -1 });
    const ledgere = await ledger.find({ userid: req.user._id }).select({ ledger: 1, budget: 1 }).sort({ createdAt: -1 });
    // console.timeEnd("time taken by userdata");
    if (explist) {
        return res.status(200).json({
            user: profile,
            explist: explist,
            ledger: ledgere
        })
    }
})


// to find out all the expanse whose userId don't exist and the delete
const findStale = async()=>{
     const allusers =await user.find().select('_id');
     let list = allusers.map((val)=>{
        return val._id.toString();
     })
     console.log("list", list)

     let expes = await expense.find().select('userid')
    //  console.log("expes", list.includes(expes.userid.toString()))
     for (const e of expes) {
        if(list.includes(e.userid.toString())){
            // console.log('yes')
        }else{
            console.log("no")
            await expense.deleteOne({_id:e._id})
        }
     }
}
// findStale()


module.exports = { userdata, userledger, addexpense, expdetail,Admindelmany,Asminupdateexp, explist, allexpe, delmany, updateexp };