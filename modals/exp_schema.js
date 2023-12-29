const mongo = require('mongoose');

const expe = new mongo.Schema({
    userid:{
        type:mongo.Schema.Types.ObjectId,
        ref:'user'
    },
    ledger:{
        type:mongo.Schema.Types.ObjectId,
        ref:'ledger'
    },
    date:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    narration:{
        type:String,
        required:true
    }
})
const expense = new mongo.model("expense",expe);
module.exports=expense;