// const errorHandler = (err, req, res, next) => {
//     console.log("Error Handler", err.message)
//     res.status(500).json({
//         message: err.message
//     })
// }

const errorHandler = (err, req, res, next) => {
    // console.error(err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: err.message || "Internal Server Error kishan",
        errors: err.errors || [],
        // data: err.data || null,
        // stack:err.stack,
        // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorHandler;

// const errorHandle =(err,req,res,next)=>{
//     const status = err.status || 500;
//     const msg = err.message || "Backend Error";

//     return res.status(status).json({ message:msg });
// };
// module.exports = errorHandle;