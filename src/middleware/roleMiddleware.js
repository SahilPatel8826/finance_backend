exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized, user missing",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }
      next();

    } catch (error) {
      res.status(500).json({
        message: "Role middleware error",
      });
    }
  };
};