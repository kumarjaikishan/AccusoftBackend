require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const router = express.Router();
const cors = require('cors')
const login = require("./controller/login_contoroller");
const expense = require("./controller/exp_controller");
const deletee = require("./controller/delete_controller");
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

router.route('/signup').post(login.signup);
router.route('/login').post(login.login);
router.route('/photo').post(authmiddlewre,upload.single('image'),login.photo);
router.route('/admin').get(authmiddlewre,adminmiddleware,login.admin);

router.route('/addexpense').post(authmiddlewre,expense.addexpense);
router.route('/explist').post(expense.explist);
router.route('/offledger').get(expense.offledger);
router.route('/offexpfetch').get(expense.offexpfetch);
router.route('/offexpense').post(expense.offexpense);
router.route('/datafetcheditexp').post(authmiddlewre,expense.datafetcheditexp);
router.route('/userdata').get(authmiddlewre,expense.userdata);
router.route('/userledger').post(authmiddlewre,expense.userledger);         

router.route('/deleteoneexp').post(authmiddlewre,deletee.deleteoneexp);
router.route('/delmany').delete(authmiddlewre,deletee.delmany);
router.route('/updateexp').post(authmiddlewre,deletee.updateexp);

app.listen(port, () => {
    console.log(`server listening at ${port}`);
})