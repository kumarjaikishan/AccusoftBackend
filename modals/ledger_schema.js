const mongo = require('mongoose');

const ledexp = new mongo.Schema({
    userid:{
        type:mongo.Schema.Types.ObjectId,
        ref:'user',
    },
    ledger:{
        type:String,
        // required:true
    }
})
const ledmodel = new mongo.model("ledger",ledexp);
module.exports=ledmodel;