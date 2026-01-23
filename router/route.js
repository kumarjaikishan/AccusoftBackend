const express = require('express');
const app = express();
const router = express.Router();
const login = require("../controller/login_contoroller");
const expense = require("../controller/exp_controller");
const ledger = require("../controller/ledger_controller");
const admin = require("../controller/admin_controller");
const slow = require("../controller/slow_controller");
// const s3 = require("../controller/s3_controller");
// const filecontroller = require("../controller/file_controller");
const authmiddlewre = require('../middleware/auth_middleware')
const { authorizationMiddleware} = require('../middleware/admin_middleware')
const upload = require('../middleware/multer_middleware')
const emailauth = require('../middleware/email_auth')

app.get('/', (req, res) => {
  res.status(200).send("This is From Expense Manager Backend, Created by Jai kishan")
})

router.route('/jwtcheck').get(authmiddlewre, (req, res) => {
  res.status(201).json({
    message: "ok"
  })
});

router.route('/signup').post(login.signup, emailauth);    //used
router.route('/login').post(emailauth, login.login);      //used
router.route('/verify').get(login.verify);
router.route('/setpassword').post(login.setpassword);         //used
router.route('/passreset').get(authmiddlewre,authorizationMiddleware(['user','admin']), login.passreset);         //used
router.route('/checkmail').post(login.checkmail);     //used
router.route('/photo').post(authmiddlewre, upload.single('image'), login.photo); //used
router.route('/updateuserdetail').post(authmiddlewre, login.updateuserdetail); //used

// router.route('/getsignedurl').post(authmiddlewre, s3.getsignedurl); //for getting presigned url for upload
// router.route('/status').post(authmiddlewre, s3.status); //for getting presigned url for upload


// router.route('/createFileJob').post(authmiddlewre, filecontroller.createFileJob); //for getting presigned url for upload
// router.route('/updateJob').post(authmiddlewre, filecontroller.updateJob); //for getting presigned url for upload
// router.route('/updateoneTimer').post(authmiddlewre, filecontroller.updateoneTimer); //for getting presigned url for upload
// router.route('/updateTimerall').post(authmiddlewre, filecontroller.updateTimerall); //for getting presigned url for upload
// router.route('/deleteFileJob').post(authmiddlewre, filecontroller.deleteFileJob); //for getting presigned url for upload
// router.route('/deleteasset').post(authmiddlewre, filecontroller.deleteasset); //for getting presigned url for upload
// router.route('/getFilejobs').get(authmiddlewre, filecontroller.getFilejobs); //for getting presigned url for upload
// router.route('/createFileurl').post(authmiddlewre, filecontroller.createFileurl); //for getting presigned url for upload

router.route('/test').get( expense.allexpe);  
router.route('/expdetail').post(authmiddlewre, expense.expdetail); //used
router.route('/explist').get(authmiddlewre, expense.explist); //used
router.route('/addexpense').post(authmiddlewre, expense.addexpense); //used
router.route('/updateexp').post(authmiddlewre,authorizationMiddleware(['user','admin']), expense.updateexp); //used
router.route('/delmany').post(authmiddlewre,authorizationMiddleware(['user','admin']), expense.delmany); //used
router.route('/userdata').get(authmiddlewre, expense.userdata); //used
router.route('/userledger').post(authmiddlewre, expense.userledger);    //used         


router.route('/addledger').post(authmiddlewre, ledger.addledger); //used
router.route('/updateledger').post(authmiddlewre,authorizationMiddleware(['user','admin']), ledger.updateledger);    //used     
router.route('/mergeledger').post(authmiddlewre,authorizationMiddleware(['user','admin']), ledger.mergeledger);    //used     
router.route('/deleteledger').post(authmiddlewre,authorizationMiddleware(['user','admin']), ledger.deleteledger); //used

router.route('/admindash').get(authmiddlewre, authorizationMiddleware(['admin']), admin.admindash); //used
router.route('/adminexp').get(authmiddlewre, authorizationMiddleware(['admin']), admin.allexpense); //used
router.route('/adminuser').get(authmiddlewre, authorizationMiddleware(['admin']), admin.alluser); //used
router.route('/adminuserupdate').post(authmiddlewre, authorizationMiddleware(['admin']), admin.userupdate); //used
router.route('/removeuser').post(authmiddlewre, authorizationMiddleware(['admin']), admin.removeuser); //used
router.route('/deletemanyexp').post(authmiddlewre, authorizationMiddleware(['admin']), expense.Admindelmany); //used
router.route('/adminupdateexp').post(authmiddlewre, authorizationMiddleware(['admin']), expense.Asminupdateexp); //used

router.route('/stillslow').post(authmiddlewre, authorizationMiddleware(['admin']), slow.stillslow); //used
router.route('/slow').post(authmiddlewre, authorizationMiddleware(['admin']), slow.slow); //used



module.exports = router;