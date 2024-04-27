require('./conn/conn')
// require('./test');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors')
const errorHandle = require('./utils/error_util')
const route = require('./router/route');

app.use(express.json());
app.use(cors());
app.use("/api", route);
app.use(errorHandle);



app.use((req, res, next) => {
  res.status(404).json({ msg: 'Endpoint not found, kindly Re-Check api End point' });
});

app.listen(port, () => {
  console.log(`server listening at ${port}`);
})
