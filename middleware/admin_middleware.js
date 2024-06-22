const adminmiddleware = async (req, res, next) => {
    // console.log(req.user.isadmin);
    if (!req.user.isAdmin) {
      return  res.status(403).json({
        message: "Access Denied!"
        })
    }
    next();
}
module.exports = adminmiddleware;