require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const router = express.Router();
const cors = require('cors')
const login = require("./controller/login_contoroller");
const expense = require("./controller/exp_controller");
const deletee = require("./controller/delete_controller");
const ledger = require("./controller/ledger_controller");
const authmiddlewre= require('./middleware/auth_middleware')
const adminmiddleware= require('./middleware/admin_middleware')
const upload = require('./middleware/multer_middleware')

app.use(express.json());
require('./conn/conn')
require('./test');
app.use(cors());
app.use(router);

app.get('/', (req, res) => {
   res.status(200).send("This is From Expense Manager Backend, Created by Jai kishan")
})

 router.route('/signup').post(login.signup);    //used
router.route('/login').post(login.login);      //used
router.route('/photo').post(authmiddlewre,upload.single('image'),login.photo); //used
router.route('/admin').get(authmiddlewre,adminmiddleware,login.admin); //used
router.route('/updateuserdetail').post(authmiddlewre,login.updateuserdetail); //used

router.route('/addexpense').post(authmiddlewre,expense.addexpense); //used
router.route('/datafetcheditexp').post(authmiddlewre,expense.datafetcheditexp); //used
router.route('/userdata').get(authmiddlewre,expense.userdata); //used
router.route('/userledger').post(authmiddlewre,expense.userledger);    //used     

router.route('/deleteoneexp').post(authmiddlewre,deletee.deleteoneexp); //used
router.route('/delmany').delete(authmiddlewre,deletee.delmany); //used
router.route('/updateexp').post(authmiddlewre,deletee.updateexp); //used

router.route('/addledger').post(authmiddlewre,ledger.addledger); //used
router.route('/updateledger').post(authmiddlewre,ledger.updateledger);    //used     
router.route('/deleteledger').post(authmiddlewre,ledger.deleteledger); //used

app.listen(port, () => {
    console.log(`server listening at ${port}`);
})