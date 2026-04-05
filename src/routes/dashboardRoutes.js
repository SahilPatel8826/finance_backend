const express= require("express");
const router= express.Router();

const { getDashboardData }= require("../controllers/dashboardController");
const { protect }= require("../middleware/authMiddleware");
const { allowRoles }= require("../middleware/roleMiddleware");    

router.get("/:userId", protect, allowRoles("admin", "analyst","viewer"), getDashboardData);

module.exports= router;