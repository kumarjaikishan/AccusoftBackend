const adminmiddleware = async (req, res, next) => {
    // console.log(req.user.isadmin);
    if (!req.user.isadmin) {
      return  res.status(403).json({
            msg: "Access Denied!"
        })
    }
    next();
}
module.exports = adminmiddleware;