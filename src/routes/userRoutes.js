const express = require("express");
const router = express.Router();

const {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.post("/", protect, allowRoles("admin"), createUser);
router.get("/", protect, allowRoles("admin", "analyst"), getAllUsers);
router.get("/:id", protect, allowRoles("admin", "analyst"), getUser);
router.put("/:id", protect, allowRoles("admin"), updateUser);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);
 
module.exports = router;