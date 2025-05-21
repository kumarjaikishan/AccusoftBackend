class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong defaulted",
        errors = [],
        stack = ""
    ){
        super(message)
        // this.statusCode = statusCode
        // this.data = null
        // this.message = message
        // this.success = false;
        // this.errors = errors
        this.statusCode = statusCode
        this.status = statusCode >= 400 && statusCode <500 ? 'fail':'error';
        this.isoperational = true;
        this.message = message
        this.errors = errors
        // this.stack = null

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

module.exports = { ApiError };